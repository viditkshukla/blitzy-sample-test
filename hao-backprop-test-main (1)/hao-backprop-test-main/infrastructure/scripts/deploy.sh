#!/bin/bash
#
# Deployment script for Node.js Hello World application
# This script automates the deployment process including environment setup,
# Docker image building, container deployment, and health verification.

# Script directory and project paths
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
PROJECT_ROOT=$(dirname "$(dirname "$SCRIPT_DIR")")
BACKEND_DIR=$PROJECT_ROOT/src/backend
INFRA_DIR=$PROJECT_ROOT/infrastructure

# Application configuration
APP_NAME="node-hello-world"
APP_VERSION="1.0.0"
DOCKER_IMAGE="$APP_NAME:$APP_VERSION"
DOCKER_LATEST="$APP_NAME:latest"

# Deployment configuration
APP_PORT="3000"
APP_HOST="localhost"
HEALTH_CHECK_RETRIES="5"
HEALTH_CHECK_INTERVAL="3"
DEPLOYMENT_ENV="development"
VERBOSE="false"

print_usage() {
    echo "Usage: bash ./$(basename "$0") [OPTIONS]"
    echo "Deploys the Node.js Hello World application to the specified environment."
    echo
    echo "Options:"
    echo "  -e, --env ENV       Deployment environment (development, staging, production)"
    echo "                       Default: $DEPLOYMENT_ENV"
    echo "  -v, --verbose       Enable verbose output"
    echo "  -h, --help          Display this help message and exit"
    echo
    echo "Examples:"
    echo "  bash ./$(basename "$0")"
    echo "  bash ./$(basename "$0") --env production"
    echo "  bash ./$(basename "$0") -e staging -v"
}

log_info() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "[INFO] [$timestamp] $1"
}

log_error() {
    local timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "[ERROR] [$timestamp] $1" >&2
}

log_verbose() {
    if [ "$VERBOSE" = "true" ]; then
        log_info "$1"
    fi
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker >/dev/null 2>&1; then
        log_error "Docker is not installed. Please install Docker and try again."
        return 1
    fi
    log_verbose "Docker is installed."
    
    if ! command -v docker-compose >/dev/null 2>&1; then
        log_error "Docker Compose is not installed. Please install Docker Compose and try again."
        return 1
    fi
    log_verbose "Docker Compose is installed."
    
    if ! command -v curl >/dev/null 2>&1; then
        log_error "curl is not installed. Please install curl and try again."
        return 1
    fi
    log_verbose "curl is installed."
    
    # Check health-check.sh exists and is executable
    if [ ! -f "$SCRIPT_DIR/health-check.sh" ]; then
        log_error "health-check.sh not found in $SCRIPT_DIR"
        return 1
    fi
    
    if [ ! -x "$SCRIPT_DIR/health-check.sh" ]; then
        log_error "health-check.sh is not executable. Run: chmod +x $SCRIPT_DIR/health-check.sh"
        return 1
    fi
    
    log_info "All prerequisites satisfied."
    return 0
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -e|--env)
                if [ -n "$2" ]; then
                    DEPLOYMENT_ENV="$2"
                    shift 2
                else
                    log_error "The --env option requires an argument."
                    print_usage
                    return 1
                fi
                ;;
            -v|--verbose)
                VERBOSE="true"
                shift
                ;;
            -h|--help)
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
    
    # Validate environment
    case "$DEPLOYMENT_ENV" in
        development|staging|production)
            log_verbose "Deployment environment set to: $DEPLOYMENT_ENV"
            ;;
        *)
            log_error "Invalid environment: $DEPLOYMENT_ENV. Must be development, staging, or production."
            return 1
            ;;
    esac
    
    return 0
}

setup_environment() {
    log_info "Setting up environment for $DEPLOYMENT_ENV deployment..."
    
    # Set environment-specific variables
    case "$DEPLOYMENT_ENV" in
        production)
            log_verbose "Configuring production environment"
            NODE_ENV="production"
            APP_PORT="80"
            MONITORING="true"
            ;;
        staging)
            log_verbose "Configuring staging environment"
            NODE_ENV="production"
            APP_PORT="3000"
            MONITORING="true"
            ;;
        development)
            log_verbose "Configuring development environment"
            NODE_ENV="development"
            APP_PORT="3000"
            MONITORING="true"
            ;;
    esac
    
    export NODE_ENV APP_PORT MONITORING
    
    # Create any necessary directories
    log_verbose "Ensuring required directories exist"
    
    # Make sure monitoring directory exists
    if [ ! -d "$INFRA_DIR/monitoring" ] && [ "$MONITORING" = "true" ]; then
        mkdir -p "$INFRA_DIR/monitoring"
        log_verbose "Created monitoring directory"
    fi
    
    log_info "Environment setup complete."
    return 0
}

build_docker_image() {
    log_info "Building Docker image $DOCKER_IMAGE..."
    
    cd "$BACKEND_DIR" || {
        log_error "Failed to change to backend directory: $BACKEND_DIR"
        return 1
    }
    
    if docker build -t "$DOCKER_IMAGE" -t "$DOCKER_LATEST" .; then
        log_info "Docker image built successfully."
        return 0
    else
        log_error "Failed to build Docker image."
        return 1
    fi
}

deploy_with_docker_compose() {
    log_info "Deploying application with Docker Compose..."
    
    cd "$INFRA_DIR" || {
        log_error "Failed to change to infrastructure directory: $INFRA_DIR"
        return 1
    }
    
    # Unused legacy exports: no Compose file in the repository interpolates
    # APP_NAME, APP_VERSION, APP_PORT or NODE_ENV, and Compose is invoked below
    # from $INFRA_DIR, which holds no Compose file at all. Kept until the
    # Compose integration is fixed.
    export APP_NAME APP_VERSION APP_PORT NODE_ENV
    
    if docker-compose up -d; then
        log_info "Application deployed successfully."
        return 0
    else
        log_error "Failed to deploy application with Docker Compose."
        return 1
    fi
}

verify_deployment() {
    log_info "Verifying deployment..."
    
    # Wait for initial startup
    log_verbose "Waiting 10 seconds for application to start..."
    sleep 10
    
    # Check health multiple times
    for ((i=1; i<=HEALTH_CHECK_RETRIES; i++)); do
        log_verbose "Health check attempt $i of $HEALTH_CHECK_RETRIES"
        
        if "$SCRIPT_DIR/health-check.sh" --host "$APP_HOST" --port "$APP_PORT" --timeout 5; then
            log_info "Health check passed. Application is running correctly."
            return 0
        else
            log_verbose "Health check failed. Retrying in $HEALTH_CHECK_INTERVAL seconds..."
            sleep "$HEALTH_CHECK_INTERVAL"
        fi
    done
    
    log_error "Health check failed after $HEALTH_CHECK_RETRIES attempts."
    return 1
}

cleanup() {
    log_info "Performing post-deployment cleanup..."
    
    # Temporary-file cleanup is unimplemented: the message below is emitted in
    # verbose mode although no temporary file is removed here.
    log_verbose "Removing temporary files..."
    
    # Optionally remove old Docker images
    if [ "$DEPLOYMENT_ENV" = "production" ]; then
        log_verbose "Cleaning up old Docker images..."
        # Keep only the last 3 versions of the image
        docker images "$APP_NAME" --format "{{.ID}} {{.Tag}}" | 
            grep -v "$APP_VERSION" | 
            grep -v "latest" | 
            head -n -3 | 
            awk '{print $1}' | 
            xargs -r docker rmi
    fi
    
    log_info "Cleanup complete."
    return 0
}

rollback_deployment() {
    log_error "Deployment failed. Rolling back..."
    
    cd "$INFRA_DIR" || {
        log_error "Failed to change to infrastructure directory: $INFRA_DIR"
        return 1
    }
    
    docker-compose down
    
    # Check if there's a previous version to roll back to
    local previous_version
    previous_version=$(docker images "$APP_NAME" --format "{{.Tag}}" | 
                      grep -v "$APP_VERSION" | 
                      grep -v "latest" | 
                      sort -r | 
                      head -1)
    
    if [ -n "$previous_version" ]; then
        log_info "Rolling back to previous version: $previous_version"
        
        # Rollback image selection is ineffective pending Compose interpolation:
        # the only Compose file in the repository, infrastructure/local/docker-compose.yml,
        # hard-codes "hello-world-app:latest" and interpolates no variables, so
        # neither of these exports reaches the deployed image.
        export APP_VERSION="$previous_version"
        export DOCKER_IMAGE="$APP_NAME:$previous_version"
        
        # Re-runs Compose, which redeploys that same hard-coded
        # "hello-world-app:latest" image rather than "$previous_version".
        if docker-compose up -d; then
            log_info "Rollback successful."
            return 0
        else
            log_error "Failed to roll back to previous version."
            return 1
        fi
    else
        log_error "No previous version found for rollback."
        return 1
    fi
}

main() {
    log_info "Starting deployment of Node.js Hello World application..."
    
    parse_arguments "$@"
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    check_prerequisites
    if [ $? -ne 0 ]; then
        log_error "Prerequisite check failed. Aborting deployment."
        return 1
    fi
    
    setup_environment
    if [ $? -ne 0 ]; then
        log_error "Environment setup failed. Aborting deployment."
        return 1
    fi
    
    build_docker_image
    if [ $? -ne 0 ]; then
        log_error "Docker image build failed. Aborting deployment."
        return 1
    fi
    
    deploy_with_docker_compose
    if [ $? -ne 0 ]; then
        log_error "Deployment failed."
        rollback_deployment
        return 1
    fi
    
    verify_deployment
    if [ $? -ne 0 ]; then
        log_error "Deployment verification failed."
        rollback_deployment
        return 1
    fi
    
    cleanup
    
    log_info "Deployment completed successfully!"
    return 0
}

main "$@"
exit $?