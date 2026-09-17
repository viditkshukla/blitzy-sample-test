#!/bin/bash
#
# start-server.sh - A shell script to start the Node.js Hello World server
#
# This script provides a consistent way to launch the server across different
# environments with proper configuration, logging, and error handling.
#

# Global variables
SCRIPT_DIR=$(dirname "$0")
PROJECT_ROOT=$(realpath "$SCRIPT_DIR/../..")
BACKEND_DIR=$PROJECT_ROOT/src/backend
DEFAULT_PORT=3000
DEFAULT_NODE_ENV=development
LOG_DIR=$PROJECT_ROOT/logs
# This launcher's own transcript. Port-independent and always appended to, so it
# never overwrites the history of a concurrent or previous launch, and kept
# separate from the server's output so the two are not interleaved.
LOG_FILE=$LOG_DIR/start-server.log

# Default settings
PORT=$DEFAULT_PORT
NODE_ENV=$DEFAULT_NODE_ENV
DETACHED=false
VERBOSE=false

# Per-port runtime paths. These defaults keep the variables defined before the
# arguments are parsed; resolve_runtime_paths() re-derives them from the port
# that was actually requested, so two instances on two ports never share a file.
PID_FILE=$LOG_DIR/server-$PORT.pid
SERVER_LOG_FILE=$LOG_DIR/server-$PORT.log

# Upper bound on how long the launcher waits for a freshly started server to
# accept and answer a request before it reports failure. Fixed on purpose: this
# is a startup guard, not a tunable, and an unbounded wait would hang the script.
SERVER_READY_TIMEOUT_SECONDS=15
# Gap between readiness probes. Short enough that a healthy start is reported
# promptly, long enough not to spin the CPU while node boots.
SERVER_READY_POLL_INTERVAL=0.2

# How much of the server log is echoed when a start fails. A Node.js module
# resolution failure prints its headline ("Error: Cannot find module ...") above
# roughly twenty-five lines of stack and require-stack, so a shorter window
# would show the operator the stack while hiding the actual cause.
STARTUP_FAILURE_LOG_LINES=40

print_usage() {
    echo "Usage: $(basename "$0") [OPTIONS]"
    echo
    echo "Start the Node.js Hello World server with specified options."
    echo
    echo "Options:"
    echo "  -p PORT       Port to listen on (default: $DEFAULT_PORT)"
    echo "  -e ENV        Node.js environment: development, production or test (default: $DEFAULT_NODE_ENV)"
    echo "  -d            Run in detached mode (background)"
    echo "  -v            Enable verbose output"
    echo "  -h, --help    Show this help message and exit"
    echo
    echo "Examples:"
    echo "  $(basename "$0")                  # Start with default settings"
    echo "  $(basename "$0") -p 8080          # Start on port 8080"
    echo "  $(basename "$0") -e production    # Start in production environment"
    echo "  $(basename "$0") -d               # Start in background"
    echo "  $(basename "$0") -v               # Start with verbose logging"
}

parse_arguments() {
    # The trailing "-:" entry lets getopts hand long options (--help) to the "-)"
    # branch below instead of rejecting them as invalid short options.
    while getopts ":p:e:dvh-:" opt; do
        case ${opt} in
            p)
                PORT=$OPTARG
                # Reject anything that is not a usable TCP port before it can reach
                # the operator-facing URL. Same range and wording as
                # infrastructure/scripts/setup.sh so the two scripts agree.
                if ! [[ $PORT =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1024 ] || [ "$PORT" -gt 65535 ]; then
                    log_message "ERROR" "Port must be a number between 1024 and 65535"
                    print_usage
                    exit 1
                fi
                ;;
            e)
                NODE_ENV=$OPTARG
                # Reject anything src/backend/config.js cannot recognise before it is
                # exported: that module compares NODE_ENV for equality, so an
                # unrecognised value leaves IS_DEV, IS_PROD and IS_TEST all false and
                # every environment gate silently mis-resolves. Same set and wording as
                # infrastructure/scripts/setup.sh so the two scripts agree.
                if [[ ! "$NODE_ENV" =~ ^(development|production|test)$ ]]; then
                    log_message "ERROR" "Environment must be one of: development, production, test"
                    print_usage
                    exit 1
                fi
                ;;
            d)
                DETACHED=true
                ;;
            v)
                VERBOSE=true
                ;;
            h)
                print_usage
                exit 0
                ;;
            -)
                # Long options arrive here with the name (without the leading --) in OPTARG.
                case "${OPTARG}" in
                    help)
                        print_usage
                        exit 0
                        ;;
                    *)
                        log_message "ERROR" "Invalid option: --${OPTARG}"
                        print_usage
                        exit 1
                        ;;
                esac
                ;;
            \?)
                log_message "ERROR" "Invalid option: -$OPTARG"
                print_usage
                exit 1
                ;;
            :)
                log_message "ERROR" "Option -$OPTARG requires an argument."
                print_usage
                exit 1
                ;;
        esac
    done
}

log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    local formatted_message="[$timestamp] [$level] $message"
    
    if [ "$level" == "ERROR" ]; then
        echo "$formatted_message" >&2
    else
        echo "$formatted_message"
    fi
    
    # If log directory exists, also log to file
    if [ -d "$(dirname "$LOG_FILE")" ]; then
        echo "$formatted_message" >> "$LOG_FILE"
    fi
}

resolve_runtime_paths() {
    # Derive the per-port pid and log file names from the port that was parsed.
    # Two detached instances on two ports therefore keep separate records, so
    # neither the pid of a running instance nor its output is ever overwritten.
    PID_FILE=$LOG_DIR/server-$PORT.pid
    SERVER_LOG_FILE=$LOG_DIR/server-$PORT.log
}

is_process_alive() {
    local pid=$1

    if [ -z "$pid" ] || ! kill -0 "$pid" 2>/dev/null; then
        return 1
    fi

    # kill -0 also succeeds for a zombie, which has exited but not been reaped.
    # Such a process is not serving anything, so its state disqualifies it.
    local state
    state=$(ps -o stat= -p "$pid" 2>/dev/null | tr -d '[:space:]')

    # No state available (ps missing or the process just went away): the
    # kill -0 result above is the best signal there is.
    if [ -z "$state" ]; then
        return 0
    fi

    case "$state" in
        Z*)
            return 1
            ;;
        *)
            return 0
            ;;
    esac
}

check_recorded_instance() {
    # A detached launch must not orphan an instance already running on this
    # port: its pid would stop being recorded anywhere while it kept serving.
    if [ ! -f "$PID_FILE" ]; then
        return 0
    fi

    local recorded_pid
    recorded_pid=$(cat "$PID_FILE" 2>/dev/null)

    if [[ $recorded_pid =~ ^[0-9]+$ ]] && is_process_alive "$recorded_pid"; then
        log_message "ERROR" "A server is already running on port $PORT with PID: $recorded_pid"
        log_message "ERROR" "Stop it first with: kill $recorded_pid"
        return 1
    fi

    # The recorded process is gone, so the file is stale and safe to replace.
    log_message "INFO" "Removing stale PID file: $PID_FILE"
    rm -f "$PID_FILE"
    return 0
}

check_dependencies() {
    log_message "INFO" "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        log_message "ERROR" "Node.js is not installed. Please install Node.js and try again."
        return 1
    fi
    
    local node_version=$(node -v | cut -d 'v' -f 2)
    log_message "INFO" "Found Node.js version $node_version"
    
    if ! command -v npm &> /dev/null; then
        log_message "ERROR" "npm is not installed. Please install npm and try again."
        return 1
    fi
    
    if [ ! -d "$BACKEND_DIR" ]; then
        log_message "ERROR" "Backend directory not found: $BACKEND_DIR"
        return 1
    fi
    
    # Check if server entry point exists
    if [ ! -f "$BACKEND_DIR/index.js" ] && [ ! -f "$BACKEND_DIR/server.js" ]; then
        log_message "ERROR" "Server entry point not found in $BACKEND_DIR"
        return 1
    fi
    
    log_message "INFO" "All dependencies are available."
    return 0
}

setup_environment() {
    log_message "INFO" "Setting up environment..."
    
    if [ ! -d "$LOG_DIR" ]; then
        log_message "INFO" "Creating logs directory: $LOG_DIR"
        mkdir -p "$LOG_DIR"
        if [ $? -ne 0 ]; then
            log_message "ERROR" "Failed to create logs directory: $LOG_DIR"
            return 1
        fi
    fi
    
    if [ -f "$BACKEND_DIR/.env" ]; then
        log_message "INFO" "Found .env file in backend directory."
    else
        log_message "INFO" "No .env file found. Using default environment variables."
    fi
    
    export PORT=$PORT
    export NODE_ENV=$NODE_ENV
    
    log_message "INFO" "Environment set up successfully."
    return 0
}

check_port_availability() {
    local port=$1
    local port_in_use=false
    
    # Try various methods to check port availability
    if command -v lsof &> /dev/null; then
        lsof -i :$port >/dev/null 2>&1 && port_in_use=true
    elif command -v netstat &> /dev/null; then
        netstat -tuln | grep -q ":$port " && port_in_use=true
    elif command -v ss &> /dev/null; then
        ss -tuln | grep -q ":$port " && port_in_use=true
    elif command -v nc &> /dev/null; then
        nc -z localhost $port >/dev/null 2>&1 && port_in_use=true
    else
        # If none of the above tools are available, try the bash /dev/tcp approach
        # This might not work on all systems
        { bash -c "echo > /dev/tcp/localhost/$port" >/dev/null 2>&1; } && port_in_use=true
    fi
    
    if $port_in_use; then
        log_message "WARNING" "Port $port is already in use. The server may fail to start."
        return 1
    else
        log_message "INFO" "Port $port is available."
        return 0
    fi
}

is_server_responding() {
    local port=$1

    # An HTTP request, not a bare connect: a foreign TCP listener squatting on
    # the port accepts a connection without ever answering HTTP, and must not be
    # mistaken for this service. curl -f fails on any non-2xx status as well.
    if command -v curl &> /dev/null; then
        curl -sf -o /dev/null --max-time 2 "http://127.0.0.1:$port/welcome"
        return $?
    fi

    # Fallback for a host without curl: a successful connect is the strongest
    # signal available. The subshell closes the descriptor when it exits.
    if (exec 3<>"/dev/tcp/127.0.0.1/$port") 2>/dev/null; then
        return 0
    fi

    return 1
}

wait_for_server_ready() {
    local pid=$1
    local port=$2
    local deadline=$(( SECONDS + SERVER_READY_TIMEOUT_SECONDS ))

    log_message "INFO" "Waiting for the server to become ready on port $port..."

    while true; do
        if is_server_responding "$port"; then
            log_message "INFO" "Server is ready and responding on port $port."
            return 0
        fi

        # The child dying is conclusive - a missing dependency, an address
        # already in use, or an environment that suppresses startup altogether.
        if ! is_process_alive "$pid"; then
            log_message "ERROR" "Server process $pid exited before it began listening on port $port."
            return 1
        fi

        if [ "$SECONDS" -ge "$deadline" ]; then
            log_message "ERROR" "Server did not respond on port $port within $SERVER_READY_TIMEOUT_SECONDS seconds."
            return 1
        fi

        sleep "$SERVER_READY_POLL_INTERVAL"
    done
}

report_startup_failure() {
    local pid=$1

    # The server's own output holds the real cause, so put it in front of the
    # operator instead of leaving them to hunt for the log file.
    if [ -f "$SERVER_LOG_FILE" ]; then
        log_message "ERROR" "Last $STARTUP_FAILURE_LOG_LINES lines of $SERVER_LOG_FILE:"
        tail -n "$STARTUP_FAILURE_LOG_LINES" "$SERVER_LOG_FILE" >&2
    fi

    # Leave nothing running that was reported as failed, and no pid file naming
    # a process that is not serving.
    if is_process_alive "$pid"; then
        log_message "INFO" "Stopping the unresponsive server process with PID: $pid"
        kill "$pid" 2>/dev/null
    fi

    rm -f "$PID_FILE"
}

log_access_url() {
    # The single place the operator-facing service URL is published, used by both
    # the detached and the foreground success paths.
    log_message "INFO" "To access the Welcome endpoint, visit: http://localhost:$PORT/welcome"
}

start_server() {
    log_message "INFO" "Starting server on port $PORT in $NODE_ENV mode..."
    
    cd "$BACKEND_DIR" || {
        log_message "ERROR" "Failed to change to backend directory: $BACKEND_DIR"
        return 1
    }
    
    # Determine the main server file
    local server_file="index.js"
    if [ ! -f "$server_file" ] && [ -f "server.js" ]; then
        server_file="server.js"
    fi
    
    # Start the server
    if [ "$DETACHED" = true ]; then
        if [ "$VERBOSE" = true ]; then
            log_message "INFO" "Starting server in detached mode with output to $SERVER_LOG_FILE"
        fi
        
        if ! check_recorded_instance; then
            return 1
        fi
        
        # Appended, not truncated: a relaunch on this port keeps the previous
        # instance's output, which is where the cause of a failed start lives.
        nohup node "$server_file" >> "$SERVER_LOG_FILE" 2>&1 &
        local pid=$!
        
        if is_process_alive "$pid"; then
            # Written owner-only: the pid file sits at a predictable path inside the
            # working tree, so the umask is narrowed for this write alone rather than
            # leaving the record of a running process group- and world-readable.
            ( umask 077; echo "$pid" > "$PID_FILE" )
            log_message "INFO" "Server started in background with PID: $pid"
        else
            log_message "ERROR" "Failed to start server in background."
            report_startup_failure "$pid"
            return 1
        fi
        
        # Nothing is reported as successful, and no URL is published, until the
        # server actually answers a request on this port.
        if ! wait_for_server_ready "$pid" "$PORT"; then
            report_startup_failure "$pid"
            return 1
        fi
    else
        if [ "$VERBOSE" = true ]; then
            log_message "INFO" "Starting server in foreground mode"
        fi
        
        # Started in the background so that readiness can be verified and the
        # access URL published here too, not only on the detached path. The
        # child inherits this script's stdout and stderr, so the server's own
        # log still streams straight to the operator's terminal.
        node "$server_file" &
        local pid=$!
        
        # Ctrl-C or a SIGTERM aimed at the launcher must reach the server so it
        # runs its own graceful shutdown and releases the port.
        trap 'kill -TERM "$pid" 2>/dev/null' TERM INT
        
        if ! wait_for_server_ready "$pid" "$PORT"; then
            if is_process_alive "$pid"; then
                log_message "INFO" "Stopping the unresponsive server process with PID: $pid"
                kill "$pid" 2>/dev/null
                wait "$pid" 2>/dev/null
            fi
            trap - TERM INT
            return 1
        fi
        
        log_message "INFO" "Server started successfully in foreground."
        log_access_url
        
        # Block until the server exits, as the foreground mode always has. A
        # signal handled by the trap above interrupts wait and returns a status
        # over 128, so wait again on the same child for its real exit status.
        wait "$pid"
        local server_status=$?
        if [ "$server_status" -gt 128 ]; then
            wait "$pid" 2>/dev/null
            server_status=$?
        fi
        trap - TERM INT
        
        if [ "$server_status" -ne 0 ]; then
            log_message "ERROR" "Server exited with an error."
            return 1
        fi
    fi
    
    return 0
}

main() {
    parse_arguments "$@"
    
    # The pid and log file names depend on the parsed port, so they are resolved
    # before anything reads or writes them.
    resolve_runtime_paths
    
    # Print welcome message
    log_message "INFO" "==== Node.js Hello World Server Startup Script ===="
    log_message "INFO" "Project root: $PROJECT_ROOT"
    log_message "INFO" "Backend directory: $BACKEND_DIR"
    
    if [ "$VERBOSE" = true ]; then
        log_message "INFO" "Starting with options:"
        log_message "INFO" "  Port: $PORT"
        log_message "INFO" "  Environment: $NODE_ENV"
        log_message "INFO" "  Detached mode: $DETACHED"
        log_message "INFO" "  Verbose mode: $VERBOSE"
    fi
    
    check_dependencies
    if [ $? -ne 0 ]; then
        log_message "ERROR" "Dependency check failed. Cannot start server."
        return 1
    fi
    
    setup_environment
    if [ $? -ne 0 ]; then
        log_message "ERROR" "Environment setup failed. Cannot start server."
        return 1
    fi
    
    # Check port availability (non-blocking warning)
    check_port_availability "$PORT"
    
    start_server
    local start_result=$?
    
    if [ $start_result -eq 0 ]; then
        if [ "$DETACHED" = true ]; then
            log_message "INFO" "Server started successfully in background."
            log_access_url
            log_message "INFO" "To stop the server: kill $(cat "$PID_FILE")"
        else
            # This will only be reached if the server exits normally in foreground mode
            log_message "INFO" "Server has stopped."
        fi
    else
        log_message "ERROR" "Failed to start the server."
    fi
    
    return $start_result
}

main "$@"