#!/bin/bash
#
# Health check script for Node.js Hello World application
# This script verifies that the /welcome endpoint returns the expected response
# and status code, indicating that the application is functioning correctly.

# Default configuration values
HOST="localhost"
PORT="3000"
ENDPOINT="/welcome"
EXPECTED_RESPONSE="Welcome to HelloGHES"
EXPECTED_STATUS="200"
TIMEOUT="5"
VERBOSE="false"
EXIT_CODE_SUCCESS=0
EXIT_CODE_FAILURE=1

# Accepted bounds for the two numeric options, enforced before either value is
# used. The port range is the whole valid TCP range rather than the 1024-65535
# range infrastructure/scripts/setup.sh and infrastructure/scripts/start-server.sh
# enforce: those two bind the port, where anything below 1024 needs privilege,
# while this script only connects to one - and infrastructure/scripts/deploy.sh
# probes port 80 when it deploys with --env production, so a 1024 floor here would
# make the deployment gate reject its own port. The timeout floor is 1 second
# because "curl -m 0" means no timeout at all, so accepting 0 would silently
# retire the bound this gate advertises.
MIN_PORT=1
MAX_PORT=65535
MIN_TIMEOUT=1
MAX_TIMEOUT=300

# Status parse_arguments returns when the operator asked for the help screen, as
# opposed to mistyping an option. main() maps it to EXIT_CODE_SUCCESS: a help
# screen that was requested is not a failed health check, and that is how the
# sibling scripts' "print_usage; exit 0" help paths already behave. It is an
# internal status only - the exit status this script hands back to a caller
# remains EXIT_CODE_SUCCESS or EXIT_CODE_FAILURE.
EXIT_CODE_HELP_REQUESTED=2

# Print usage information
print_usage() {
    echo "Usage: $(basename "$0") [OPTIONS]"
    echo "Performs a health check on the Node.js Hello World application."
    echo
    echo "Options:"
    echo "  --host HOST      Specify the host to check (default: $HOST)"
    echo "  --port PORT      Specify the port to check (default: $PORT)"
    echo "  --timeout SEC    Specify request timeout in seconds (default: $TIMEOUT)"
    echo "  --verbose        Enable verbose output"
    echo "  --help           Display this help message and exit"
    echo
    echo "Examples:"
    echo "  $(basename "$0")"
    echo "  $(basename "$0") --host example.com --port 8080"
    echo "  $(basename "$0") --verbose"
    echo "  $(basename "$0") --timeout 10"
}

# Log an info message with timestamp
log_info() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "[INFO] [$timestamp] $1"
}

# Log an error message with timestamp
log_error() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "[ERROR] [$timestamp] $1" >&2
}

# Log a verbose message if verbose mode is enabled
log_verbose() {
    if [ "$VERBOSE" = "true" ]; then
        log_info "$1"
    fi
}

# Reject an option value that is not a whole number inside an inclusive range.
# Both numeric options share this check so the two cannot drift apart, and the
# message names the range so the operator is told what to pass instead.
#   $1 - the option as the operator typed it, for the message
#   $2 - the value supplied
#   $3 - lowest accepted value
#   $4 - highest accepted value
validate_numeric_range() {
    local option="$1"
    local value="$2"
    local min="$3"
    local max="$4"

    # The digit cap is derived from the maximum: a value carrying more digits
    # than that can never be in range, and admitting one to the comparisons
    # below would overflow bash's integer test, which then fails with "integer
    # expression expected" and lets the value through.
    if ! [[ "$value" =~ ^[0-9]{1,${#max}}$ ]] || [ "$value" -lt "$min" ] || [ "$value" -gt "$max" ]; then
        log_error "The $option option must be a whole number between $min and $max, got '$value'."
        print_usage
        return 1
    fi

    return 0
}

# Parse command line arguments
parse_arguments() {
    while [ $# -gt 0 ]; do
        case "$1" in
            --host)
                if [ -n "$2" ]; then
                    HOST="$2"
                    shift 2
                else
                    log_error "The --host option requires an argument."
                    print_usage
                    return 1
                fi
                ;;
            --port)
                if [ -n "$2" ]; then
                    # Validate before assigning: an unusable port otherwise reaches
                    # the probe URL, where curl rejects it and the failure surfaces
                    # through the "Check if the server is running" branch below,
                    # blaming a healthy service for an operator input error.
                    if ! validate_numeric_range "--port" "$2" "$MIN_PORT" "$MAX_PORT"; then
                        return 1
                    fi
                    PORT="$2"
                    shift 2
                else
                    log_error "The --port option requires an argument."
                    print_usage
                    return 1
                fi
                ;;
            --timeout)
                if [ -n "$2" ]; then
                    # Validate before assigning, for the same reason as --port, and
                    # so that the advertised bound cannot be turned off: curl reads
                    # "-m 0" as no timeout at all rather than as an instant one.
                    if ! validate_numeric_range "--timeout" "$2" "$MIN_TIMEOUT" "$MAX_TIMEOUT"; then
                        return 1
                    fi
                    TIMEOUT="$2"
                    shift 2
                else
                    log_error "The --timeout option requires an argument."
                    print_usage
                    return 1
                fi
                ;;
            --verbose)
                VERBOSE="true"
                shift
                ;;
            --help)
                # A requested help screen is not a failure, so it returns its own
                # status rather than the one a parse error uses; main() maps it to
                # EXIT_CODE_SUCCESS and no health check is performed.
                print_usage
                return $EXIT_CODE_HELP_REQUESTED
                ;;
            *)
                log_error "Unknown option: $1"
                print_usage
                return 1
                ;;
        esac
    done

    return 0
}

# Check if curl is installed
check_prerequisites() {
    if ! command -v curl >/dev/null 2>&1; then
        log_error "curl is not installed. Please install curl and try again."
        return 1
    fi
    
    log_verbose "Prerequisites check passed. curl is available."
    return 0
}

# Perform the health check
perform_health_check() {
    log_info "Starting health check for $HOST:$PORT$ENDPOINT"
    
    local url="http://$HOST:$PORT$ENDPOINT"
    log_verbose "Health check URL: $url"
    
    log_verbose "Executing curl request with timeout of $TIMEOUT seconds..."
    
    # Use curl to get both status code and response body from a single request,
    # captured entirely in shell variables. The body goes to stdout and
    # "%{http_code}" is appended on its own trailing line, so this gate needs no
    # temporary file and therefore no temporary directory.
    #
    # Staging the body on disk instead made the gate depend on a writable TMPDIR.
    # An unwritable or missing one left the temp-file name empty, curl rejected
    # the resulting blank -o argument with exit code 2, and the failure surfaced
    # through the "Check if the server is running" branch below - blaming a
    # healthy service for an environment fault. It also left the temp file behind
    # whenever a run was terminated while the request was in flight: a cleanup
    # trap covers SIGINT, SIGTERM and SIGHUP but never SIGKILL, which cannot be
    # caught, so creating nothing on disk is the only way to leave no residue on
    # every exit path.
    local curl_response
    curl_response=$(curl -s -w "\n%{http_code}" -m "$TIMEOUT" "$url")
    local curl_exit_code=$?
    
    if [ $curl_exit_code -ne 0 ]; then
        log_error "curl command failed with exit code $curl_exit_code. Check if the server is running."
        return 1
    fi
    
    # Split the captured output on its final newline: the status code is
    # everything after it, the response body everything before it.
    local status_code="${curl_response##*$'\n'}"
    local response_body="${curl_response%$'\n'*}"
    
    log_verbose "Received HTTP status code: $status_code"
    log_verbose "Received response body: '$response_body'"
    
    # Check if status code matches expected status
    if [ "$status_code" != "$EXPECTED_STATUS" ]; then
        log_error "Health check failed: Expected status code $EXPECTED_STATUS, got $status_code"
        return 1
    fi
    
    # Check if response contains expected content
    if [[ "$response_body" != *"$EXPECTED_RESPONSE"* ]]; then
        log_error "Health check failed: Response does not contain expected content."
        log_error "Expected: '$EXPECTED_RESPONSE'"
        log_error "Received: '$response_body'"
        return 1
    fi
    
    log_info "Health check passed! Service is responding correctly."
    return 0
}

# Main function
main() {
    # Parse command line arguments. Three outcomes are distinguished: a requested
    # help screen succeeds without running a check, a rejected option fails, and
    # anything else proceeds to the check itself.
    parse_arguments "$@"
    local parse_status=$?
    if [ "$parse_status" -eq "$EXIT_CODE_HELP_REQUESTED" ]; then
        return $EXIT_CODE_SUCCESS
    fi
    if [ "$parse_status" -ne 0 ]; then
        return $EXIT_CODE_FAILURE
    fi
    
    # Check prerequisites
    check_prerequisites
    if [ $? -ne 0 ]; then
        return $EXIT_CODE_FAILURE
    fi
    
    # Perform health check
    perform_health_check
    if [ $? -ne 0 ]; then
        return $EXIT_CODE_FAILURE
    fi
    
    return $EXIT_CODE_SUCCESS
}

# Run the main function with all script arguments
main "$@"
exit $?