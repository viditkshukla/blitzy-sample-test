#!/bin/bash
# ==============================================================================
# Node.js Hello World Application - Setup Script
# 
# This script automates the initial setup process for the Node.js Hello World application.
# It checks prerequisites, installs dependencies, configures the environment, and
# ensures the system is ready to run the application.
# ==============================================================================

set -e  # Exit immediately if a command exits with a non-zero status

# Global variables
SCRIPT_DIR=$(dirname "$0")
PROJECT_ROOT=$(realpath "$SCRIPT_DIR/../..")
BACKEND_DIR=$PROJECT_ROOT/src/backend
MANIFEST_DIR=$PROJECT_ROOT  # Directory holding the project's package.json
MIN_NODE_VERSION="18.0.0"
DEFAULT_PORT="3000"
LOG_DIR=$PROJECT_ROOT/logs
ENV_FILE=$BACKEND_DIR/.env
ENV_EXAMPLE_FILE=$BACKEND_DIR/.env.example

# Command line parameters
PORT=$DEFAULT_PORT
NODE_ENV="development"
SKIP_DEPS=false

# ANSI color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==============================================================================
# Function: print_usage
# Description: Prints usage information for the script
# ==============================================================================
print_usage() {
    echo -e "${BLUE}NAME${NC}"
    echo "    setup.sh - Node.js Hello World Application Setup Script"
    echo
    echo -e "${BLUE}SYNOPSIS${NC}"
    echo "    ./setup.sh [OPTIONS]"
    echo
    echo -e "${BLUE}DESCRIPTION${NC}"
    echo "    This script automates the initial setup process for the Node.js Hello World application."
    echo "    It checks prerequisites, installs dependencies, configures the environment, and ensures"
    echo "    the system is ready to run the application."
    echo
    echo -e "${BLUE}OPTIONS${NC}"
    echo "    -p PORT       Specify the port number for the server (default: 3000)"
    echo "    -e ENV        Specify the environment (development, production, test)"
    echo "                  (default: development)"
    echo "    -s            Skip dependency installation"
    echo "    -h, --help    Display this help message and exit"
    echo
    echo -e "${BLUE}EXAMPLES${NC}"
    echo "    ./setup.sh"
    echo "    ./setup.sh -p 8080"
    echo "    ./setup.sh -e production"
    echo "    ./setup.sh -s"
    echo
}

# ==============================================================================
# Function: parse_arguments
# Description: Parses command line arguments to configure the setup process
# Parameters:
#   $@ - Command line arguments
# ==============================================================================
parse_arguments() {
    while getopts ":p:e:sh-:" opt; do
        case ${opt} in
            p)
                PORT=$OPTARG
                if ! [[ $PORT =~ ^[0-9]+$ ]] || [ $PORT -lt 1024 ] || [ $PORT -gt 65535 ]; then
                    echo -e "${RED}Error: Port must be a number between 1024 and 65535${NC}"
                    exit 1
                fi
                ;;
            e)
                NODE_ENV=$OPTARG
                if [[ ! "$NODE_ENV" =~ ^(development|production|test)$ ]]; then
                    echo -e "${RED}Error: Environment must be one of: development, production, test${NC}" >&2
                    exit 1
                fi
                ;;
            s)
                SKIP_DEPS=true
                ;;
            h)
                print_usage
                exit 0
                ;;
            -)
                case "${OPTARG}" in
                    help)
                        print_usage
                        exit 0
                        ;;
                    *)
                        echo -e "${RED}Error: Invalid option: --${OPTARG}${NC}" >&2
                        print_usage
                        exit 1
                        ;;
                esac
                ;;
            \?)
                echo -e "${RED}Error: Invalid option: -$OPTARG${NC}" >&2
                print_usage
                exit 1
                ;;
            :)
                echo -e "${RED}Error: Option -$OPTARG requires an argument${NC}" >&2
                print_usage
                exit 1
                ;;
        esac
    done
}

# ==============================================================================
# Function: check_node_version
# Description: Checks if the installed Node.js version meets the minimum requirement
# Returns:
#   0 if Node.js version is adequate, 1 otherwise
# ==============================================================================
check_node_version() {
    echo -e "${BLUE}Checking Node.js version...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed or not in the PATH${NC}"
        echo "Please install Node.js version $MIN_NODE_VERSION or higher"
        echo "Visit https://nodejs.org/ for installation instructions"
        return 1
    fi
    
    CURRENT_VERSION=$(node --version | cut -d "v" -f 2)
    echo "Current Node.js version: $CURRENT_VERSION"
    
    # Compare versions
    if [ "$(printf '%s\n' "$MIN_NODE_VERSION" "$CURRENT_VERSION" | sort -V | head -n1)" = "$MIN_NODE_VERSION" ]; then
        echo -e "${GREEN}✓ Node.js version is adequate${NC}"
        return 0
    else
        echo -e "${RED}Error: Node.js version $CURRENT_VERSION is less than the required minimum version $MIN_NODE_VERSION${NC}"
        echo "Please upgrade Node.js to version $MIN_NODE_VERSION or higher"
        echo "Visit https://nodejs.org/ for upgrade instructions"
        return 1
    fi
}

# ==============================================================================
# Function: check_npm
# Description: Checks if npm is installed and accessible
# Returns:
#   0 if npm is available, 1 otherwise
# ==============================================================================
check_npm() {
    echo -e "${BLUE}Checking npm availability...${NC}"
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm is not installed or not in the PATH${NC}"
        echo "npm should be installed with Node.js"
        echo "Check your Node.js installation or visit https://nodejs.org/"
        return 1
    fi
    
    NPM_VERSION=$(npm --version)
    echo "npm version: $NPM_VERSION"
    echo -e "${GREEN}✓ npm is available${NC}"
    return 0
}

# ==============================================================================
# Function: install_dependencies
# Description: Installs Node.js dependencies using npm, run from MANIFEST_DIR so that the
#              install is driven by this project's package.json
# Returns:
#   0 if installation was successful, 1 otherwise
# ==============================================================================
install_dependencies() {
    echo -e "${BLUE}Installing dependencies...${NC}"
    
    cd "$MANIFEST_DIR" || {
        echo -e "${RED}Error: Could not change to manifest directory: $MANIFEST_DIR${NC}"
        return 1
    }
    
    echo "Running npm install in $(pwd)"
    if npm install; then
        echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
        return 0
    else
        echo -e "${RED}Error: Failed to install dependencies${NC}"
        echo "Try running 'npm install' manually in the $MANIFEST_DIR directory"
        return 1
    fi
}

# ==============================================================================
# Function: set_env_value
# Description: Writes KEY=VALUE into ENV_FILE, replacing the first line that starts with
#              "KEY=" and appending the assignment when no such line exists. The key and
#              the value reach awk through the environment, so neither is ever read as a
#              pattern or as a replacement escape: a value containing /, & or \ is written
#              verbatim, which an in-place `sed "s/KEY=.*/KEY=$VALUE/"` cannot do. The
#              rewrite is built in a temporary file beside ENV_FILE and moved into place,
#              and the result is read back before success is reported, so a failed write
#              can never be mistaken for an applied value.
# Parameters:
#   $1 - Environment variable name to set
#   $2 - Value to assign, written verbatim
# Usage:
#   set_env_value "NODE_ENV" "production" || return 1
# Returns:
#   0 when ENV_FILE contains exactly the line "KEY=VALUE", 1 on any failure
# ==============================================================================
set_env_value() {
    local key=$1
    local value=$2
    local file=$ENV_FILE
    local tmp_file
    
    if ! [[ $key =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
        echo -e "${RED}Error: Invalid environment variable name: $key${NC}" >&2
        return 1
    fi
    
    # A newline in the value would write a second line into the file, which no reader
    # would attribute to this key
    if [ "$value" != "${value//$'\n'/}" ]; then
        echo -e "${RED}Error: Value for $key must not contain a newline${NC}" >&2
        return 1
    fi
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}Error: Environment file not found: $file${NC}" >&2
        return 1
    fi
    
    tmp_file=$(mktemp "$file.XXXXXX") || {
        echo -e "${RED}Error: Could not create a temporary file beside $file${NC}" >&2
        return 1
    }
    
    if ! ENV_KEY=$key ENV_VALUE=$value awk '
        BEGIN {
            prefix = ENVIRON["ENV_KEY"] "="
            value = ENVIRON["ENV_VALUE"]
            replaced = 0
        }
        {
            if (!replaced && substr($0, 1, length(prefix)) == prefix) {
                print prefix value
                replaced = 1
            } else {
                print
            }
        }
        END {
            if (!replaced) {
                print prefix value
            }
        }
    ' "$file" > "$tmp_file"; then
        rm -f "$tmp_file"
        echo -e "${RED}Error: Failed to rewrite $file with $key=$value${NC}" >&2
        return 1
    fi
    
    # Owner-only access on the replacement, unconditionally. This helper rewrites nothing
    # but ENV_FILE (see `local file=$ENV_FILE` above), the dotenv file config.js loads and
    # therefore the place an operator puts a local credential, so there is no mode worth
    # carrying over from the file being replaced: preserving it would let a permissive
    # mode survive every write, and depending on `chmod --reference` would leave the
    # tightening to whether that option is supported.
    if ! chmod 600 "$tmp_file"; then
        rm -f "$tmp_file"
        echo -e "${RED}Error: Failed to restrict permissions on the replacement for $file${NC}" >&2
        return 1
    fi
    
    if ! mv "$tmp_file" "$file"; then
        rm -f "$tmp_file"
        echo -e "${RED}Error: Failed to update $file with $key=$value${NC}" >&2
        return 1
    fi
    
    # Read the result back: the value counts as applied only if the exact line is there
    if ! grep -Fxq -- "$key=$value" "$file"; then
        echo -e "${RED}Error: $file does not contain $key=$value after the update${NC}" >&2
        return 1
    fi
    
    return 0
}

# ==============================================================================
# Function: setup_environment
# Description: Sets up environment configuration by creating .env file from template
# Returns:
#   0 if setup was successful, 1 otherwise
# ==============================================================================
setup_environment() {
    echo -e "${BLUE}Setting up environment...${NC}"
    
    # Create .env file if it doesn't exist. dotenv loads this file (src/backend/config.js),
    # which makes it the file an operator puts a local credential in, so each creation path
    # narrows the umask to 077 in a subshell first: the file is owner-only from the moment
    # it exists, with no window in which it is world-readable waiting for a later chmod.
    if [ -f "$ENV_FILE" ]; then
        echo "Environment file (.env) already exists"
    elif [ -f "$ENV_EXAMPLE_FILE" ]; then
        echo "Creating environment file from example template"
        # A copy takes the template's mode masked by the umask, so the umask is what
        # decides the result rather than whatever mode .env.example happens to carry
        if ! ( umask 077; cp "$ENV_EXAMPLE_FILE" "$ENV_FILE" ); then
            echo -e "${RED}Error: Failed to create environment file from $ENV_EXAMPLE_FILE${NC}" >&2
            return 1
        fi
    else
        echo "Creating new environment file"
        # Create and truncate the file owner-only, then append the content to it
        if ! ( umask 077; : > "$ENV_FILE" ); then
            echo -e "${RED}Error: Failed to create environment file: $ENV_FILE${NC}" >&2
            return 1
        fi
        echo "# Node.js Hello World Application Environment Configuration" >> "$ENV_FILE"
        echo "# Created by setup script on $(date)" >> "$ENV_FILE"
        echo "" >> "$ENV_FILE"
        echo "# Server configuration" >> "$ENV_FILE"
        echo "PORT=$PORT" >> "$ENV_FILE"
        echo "NODE_ENV=$NODE_ENV" >> "$ENV_FILE"
    fi
    
    # The mode belongs to the file, not to the run that created it: an .env left behind at
    # a permissive mode by an earlier run is tightened here too, which also closes any gap
    # the copy above could leave
    if ! chmod 600 "$ENV_FILE"; then
        echo -e "${RED}Error: Failed to restrict permissions on environment file: $ENV_FILE${NC}" >&2
        return 1
    fi
    
    # Update PORT in .env if specified
    set_env_value "PORT" "$PORT" || return 1
    
    # Update NODE_ENV in .env if specified
    set_env_value "NODE_ENV" "$NODE_ENV" || return 1
    
    if [ ! -d "$LOG_DIR" ]; then
        echo "Creating logs directory: $LOG_DIR"
        mkdir -p "$LOG_DIR" || {
            echo -e "${RED}Error: Failed to create logs directory: $LOG_DIR${NC}"
            return 1
        }
    fi
    
    echo -e "${GREEN}✓ Environment setup completed${NC}"
    return 0
}

# ==============================================================================
# Function: check_port_availability
# Description: Checks if the specified port is available for use
# Parameters:
#   $1 - Port number to check
# Returns:
#   0 if port is available, 1 otherwise
# ==============================================================================
check_port_availability() {
    local port=$1
    
    echo -e "${BLUE}Checking if port $port is available...${NC}"
    
    # Use netstat if available
    if command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":$port "; then
            echo -e "${YELLOW}Warning: Port $port appears to be in use${NC}"
            echo "You may need to choose a different port with the -p option"
            return 1
        fi
    # Otherwise try a simple connect test
    elif command -v nc &> /dev/null; then
        if nc -z localhost "$port" 2>/dev/null; then
            echo -e "${YELLOW}Warning: Port $port appears to be in use${NC}"
            echo "You may need to choose a different port with the -p option"
            return 1
        fi
    # Last resort - attempt a TCP connection to detect an existing listener
    else
        (
            exec 3<> /dev/tcp/localhost/$port
        ) 2>/dev/null
        
        if [ $? -eq 0 ]; then
            exec 3>&-
            echo -e "${YELLOW}Warning: Port $port appears to be in use${NC}"
            echo "You may need to choose a different port with the -p option"
            return 1
        fi
    fi
    
    echo -e "${GREEN}✓ Port $port is available${NC}"
    return 0
}

# ==============================================================================
# Function: verify_setup
# Description: Verifies that the setup was successful by checking key components
# Returns:
#   0 if all checks pass, 1 otherwise
# ==============================================================================
verify_setup() {
    echo -e "${BLUE}Verifying setup...${NC}"
    local status=0
    
    if [ -d "$MANIFEST_DIR/node_modules" ]; then
        echo -e "${GREEN}✓ Dependencies are installed${NC}"
    elif [ "$SKIP_DEPS" = true ]; then
        # The operator declined the install with -s, so missing dependencies are the
        # requested outcome rather than a setup failure: report and leave status alone
        echo -e "${YELLOW}! Dependency check skipped because installation was skipped with -s${NC}"
        echo "Run 'npm install' in $MANIFEST_DIR before starting the server"
    else
        echo -e "${RED}× Dependencies are not installed${NC}"
        status=1
    fi
    
    if [ -f "$ENV_FILE" ]; then
        echo -e "${GREEN}✓ Environment configuration exists${NC}"
    else
        echo -e "${RED}× Environment configuration is missing${NC}"
        status=1
    fi
    
    if [ -d "$LOG_DIR" ]; then
        echo -e "${GREEN}✓ Logs directory exists${NC}"
    else
        echo -e "${RED}× Logs directory is missing${NC}"
        status=1
    fi
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}Verification completed successfully!${NC}"
    else
        echo -e "${RED}Verification failed. Please check the errors above.${NC}"
    fi
    
    return $status
}

# ==============================================================================
# Function: main
# Description: Main function that orchestrates the setup process
# Parameters:
#   $@ - Command line arguments
# Returns:
#   Exit code indicating success (0) or failure (1)
# ==============================================================================
main() {
    parse_arguments "$@"
    
    echo -e "${BLUE}==================================================${NC}"
    echo -e "${BLUE}Node.js Hello World Application - Setup${NC}"
    echo -e "${BLUE}==================================================${NC}"
    echo "Project root: $PROJECT_ROOT"
    echo "Backend directory: $BACKEND_DIR"
    echo "Port: $PORT"
    echo "Environment: $NODE_ENV"
    echo "Skip dependencies: $SKIP_DEPS"
    echo -e "${BLUE}==================================================${NC}"
    
    # Check prerequisites
    check_node_version || exit 1
    check_npm || exit 1
    
    # Install dependencies if not skipped
    if [ "$SKIP_DEPS" = false ]; then
        install_dependencies || exit 1
    else
        echo -e "${YELLOW}Skipping dependency installation as requested${NC}"
    fi
    
    setup_environment || exit 1
    
    # Check port availability (non-blocking)
    check_port_availability "$PORT" || true
    
    local setup_status=0
    verify_setup || setup_status=$?
    
    if [ $setup_status -eq 0 ]; then
        echo
        echo -e "${GREEN}==================================================${NC}"
        echo -e "${GREEN}Setup completed successfully!${NC}"
        echo -e "${GREEN}==================================================${NC}"
        echo
        echo "Next steps:"
        echo "1. Navigate to the backend directory: cd $BACKEND_DIR"
        echo "2. Start the server: PORT=$PORT node index.js"
        echo "3. Access the service at: http://localhost:$PORT/welcome"
        echo
    else
        echo
        echo -e "${RED}==================================================${NC}"
        echo -e "${RED}Setup completed with errors!${NC}"
        echo -e "${RED}==================================================${NC}"
        echo
        echo "Please address the issues above and try again."
        echo
    fi
    
    return $setup_status
}

main "$@"