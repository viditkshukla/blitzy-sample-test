#!/bin/bash
#
# Health check script for Node.js Hello World application
# This script verifies that the /hello endpoint returns the expected response
# and status code, indicating that the application is functioning correctly.

# Default configuration values
HOST="localhost"
PORT="3000"
ENDPOINT="/hello"
EXPECTED_RESPONSE="Hello world"
EXPECTED_STATUS="200"
TIMEOUT="5"
VERBOSE="false"
EXIT_CODE_SUCCESS=0
EXIT_CODE_FAILURE=1

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
                print_usage
                return 1
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
    
    # Create a temporary file for the response body
    local tmp_file
    tmp_file=$(mktemp)
    
    log_verbose "Executing curl request with timeout of $TIMEOUT seconds..."
    
    # Use curl to get both status code and response body
    local status_code
    status_code=$(curl -s -o "$tmp_file" -w "%{http_code}" -m "$TIMEOUT" "$url")
    local curl_exit_code=$?
    
    if [ $curl_exit_code -ne 0 ]; then
        log_error "curl command failed with exit code $curl_exit_code. Check if the server is running."
        rm -f "$tmp_file"
        return 1
    fi
    
    local response_body
    response_body=$(cat "$tmp_file")
    rm -f "$tmp_file"
    
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
    # Parse command line arguments
    parse_arguments "$@"
    if [ $? -ne 0 ]; then
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