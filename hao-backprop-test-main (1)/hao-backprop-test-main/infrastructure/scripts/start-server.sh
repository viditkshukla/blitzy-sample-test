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
PID_FILE=$LOG_DIR/server.pid
LOG_FILE=$LOG_DIR/server.log

# Default settings
PORT=$DEFAULT_PORT
NODE_ENV=$DEFAULT_NODE_ENV
DETACHED=false
VERBOSE=false

print_usage() {
    echo "Usage: bash ./start-server.sh [OPTIONS]"
    echo
    echo "Start the Node.js Hello World server with specified options."
    echo
    echo "Options:"
    echo "  -p PORT       Port to listen on (default: $DEFAULT_PORT)"
    echo "  -e ENV        Node.js environment (default: $DEFAULT_NODE_ENV)"
    echo "  -d            Run in detached mode (background)"
    echo "  -v            Enable verbose output"
    echo "  -h, --help    Show this help message and exit"
    echo
    echo "Examples:"
    echo "  bash ./start-server.sh                # Start with default settings"
    echo "  bash ./start-server.sh -p 8080        # Start on port 8080"
    echo "  bash ./start-server.sh -e production  # Start in production environment"
    echo "  bash ./start-server.sh -d             # Start in background"
    echo "  bash ./start-server.sh -v             # Start with verbose logging"
}

parse_arguments() {
    while getopts ":p:e:dvh" opt; do
        case ${opt} in
            p)
                PORT=$OPTARG
                ;;
            e)
                NODE_ENV=$OPTARG
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

    # Handle --help
    for arg in "$@"; do
        if [ "$arg" == "--help" ]; then
            print_usage
            exit 0
        fi
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
            log_message "INFO" "Starting server in detached mode with output to $LOG_FILE"
        fi
        
        nohup node "$server_file" > "$LOG_FILE" 2>&1 &
        local pid=$!
        
        if ps -p $pid > /dev/null; then
            echo $pid > "$PID_FILE"
            log_message "INFO" "Server started in background with PID: $pid"
        else
            log_message "ERROR" "Failed to start server in background."
            return 1
        fi
    else
        if [ "$VERBOSE" = true ]; then
            log_message "INFO" "Starting server in foreground mode"
        fi
        
        node "$server_file"
        if [ $? -ne 0 ]; then
            log_message "ERROR" "Server exited with an error."
            return 1
        fi
    fi
    
    return 0
}

main() {
    parse_arguments "$@"
    
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
            log_message "INFO" "To access the Welcome endpoint, visit: http://localhost:$PORT/welcome"
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