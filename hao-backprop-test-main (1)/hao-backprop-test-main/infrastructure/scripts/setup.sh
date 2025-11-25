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
BACKEND_DIR=$PROJECT_ROOT/src
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
                    echo -e "${YELLOW}Warning: Unusual environment specified: $NODE_ENV${NC}"
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
    
    # Check if node is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed or not in the PATH${NC}"
        echo "Please install Node.js version $MIN_NODE_VERSION or higher"
        echo "Visit https://nodejs.org/ for installation instructions"
        return 1
    fi
    
    # Get current Node.js version
    CURRENT_VERSION=$(node --version | cut -d "v" -f 2)
    echo "Current Node.js version: $CURRENT_VERSION"
    
    # Compare versions
    if [ "$(printf '%s\n' "$MIN_NODE_VERSION" "$CURRENT_VERSION" | sort -V | head -n1)" != "$MIN_NODE_VERSION" ]; then
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
# Description: Installs Node.js dependencies using npm
# Returns:
#   0 if installation was successful, 1 otherwise
# ==============================================================================
install_dependencies() {
    echo -e "${BLUE}Installing dependencies...${NC}"
    
    # Change to the backend directory
    cd "$BACKEND_DIR" || {
        echo -e "${RED}Error: Could not change to backend directory: $BACKEND_DIR${NC}"
        return 1
    }
    
    # Run npm install
    echo "Running npm install in $(pwd)"
    if npm install; then
        echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
        return 0
    else
        echo -e "${RED}Error: Failed to install dependencies${NC}"
        echo "Try running 'npm install' manually in the $BACKEND_DIR directory"
        return 1
    fi
}

# ==============================================================================
# Function: setup_environment
# Description: Sets up environment configuration by creating .env file from template
# Returns:
#   0 if setup was successful, 1 otherwise
# ==============================================================================
setup_environment() {
    echo -e "${BLUE}Setting up environment...${NC}"
    
    # Create .env file if it doesn't exist
    if [ -f "$ENV_FILE" ]; then
        echo "Environment file (.env) already exists"
    elif [ -f "$ENV_EXAMPLE_FILE" ]; then
        echo "Creating environment file from example template"
        cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
    else
        echo "Creating new environment file"
        echo "# Node.js Hello World Application Environment Configuration" > "$ENV_FILE"
        echo "# Created by setup script on $(date)" >> "$ENV_FILE"
        echo "" >> "$ENV_FILE"
        echo "# Server configuration" >> "$ENV_FILE"
        echo "PORT=$PORT" >> "$ENV_FILE"
        echo "NODE_ENV=$NODE_ENV" >> "$ENV_FILE"
    fi
    
    # Update PORT in .env if specified
    if grep -q "PORT=" "$ENV_FILE"; then
        sed -i.bak "s/PORT=.*/PORT=$PORT/" "$ENV_FILE" && rm -f "$ENV_FILE.bak"
    else
        echo "PORT=$PORT" >> "$ENV_FILE"
    fi
    
    # Update NODE_ENV in .env if specified
    if grep -q "NODE_ENV=" "$ENV_FILE"; then
        sed -i.bak "s/NODE_ENV=.*/NODE_ENV=$NODE_ENV/" "$ENV_FILE" && rm -f "$ENV_FILE.bak"
    else
        echo "NODE_ENV=$NODE_ENV" >> "$ENV_FILE"
    fi
    
    # Create logs directory if it doesn't exist
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
    # Last resort - try to bind to the port directly
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
    
    # Check if node_modules directory exists
    if [ -d "$BACKEND_DIR/node_modules" ]; then
        echo -e "${GREEN}✓ Dependencies are installed${NC}"
    else
        echo -e "${RED}× Dependencies are not installed${NC}"
        status=1
    fi
    
    # Check if .env file exists
    if [ -f "$ENV_FILE" ]; then
        echo -e "${GREEN}✓ Environment configuration exists${NC}"
    else
        echo -e "${RED}× Environment configuration is missing${NC}"
        status=1
    fi
    
    # Check if logs directory exists
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
    # Parse command line arguments
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
    
    # Setup environment
    setup_environment || exit 1
    
    # Check port availability (non-blocking)
    check_port_availability "$PORT"
    
    # Verify setup
    verify_setup
    local setup_status=$?
    
    if [ $setup_status -eq 0 ]; then
        echo
        echo -e "${GREEN}==================================================${NC}"
        echo -e "${GREEN}Setup completed successfully!${NC}"
        echo -e "${GREEN}==================================================${NC}"
        echo
        echo "Next steps:"
        echo "1. Navigate to the backend directory: cd $BACKEND_DIR"
        echo "2. Start the server: npm start"
        echo "3. Access the service at: http://localhost:$PORT/hello"
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

# Execute main function with all script arguments
main "$@"