# Node.js Hello World Infrastructure

This directory contains infrastructure configuration and deployment scripts for the Node.js Hello World application. The infrastructure is designed to be lightweight and educational, demonstrating basic concepts of containerization, orchestration, and monitoring.

## Prerequisites

Before using the infrastructure components, ensure you have the following installed:

- Docker (20.10.x or later)
- Docker Compose (2.x or later)
- Node.js 18.x LTS (for local deployment)
- curl (for health checks)

## Directory Structure

```
infrastructure/
├── docker-compose.yml         # Docker Compose configuration
├── monitoring/
│   ├── prometheus.yml         # Prometheus configuration
│   └── grafana-dashboard.json # Grafana dashboard configuration
└── scripts/
    ├── deploy.sh              # Deployment script
    └── health-check.sh        # Health check script
```

## Deployment Options

The application can be deployed in several ways, depending on your needs and environment:

### Local Deployment

For local development and testing, you can run the application directly with Node.js:

```bash
# Navigate to the backend directory
cd ../src/backend

# Install dependencies
npm install

# Start the application
npm start
```

The application will be available at http://localhost:3000/hello.

### Docker Deployment

To deploy the application as a standalone Docker container:

```bash
# Build the Docker image
docker build -t hello-node:latest ../src/backend

# Run the container
docker run -p 3000:3000 -d --name hello-node hello-node:latest
```

The application will be available at http://localhost:3000/hello.

To stop the container:

```bash
docker stop hello-node
docker rm hello-node
```

### Docker Compose Deployment

For a more complete deployment with monitoring, use Docker Compose:

```bash
# Start all services
docker-compose up -d
```

This will start:
- The Node.js Hello World application (http://localhost:3000/hello)
- Prometheus monitoring (http://localhost:9090)
- Grafana dashboards (http://localhost:3001, login with admin/admin)

To stop all services:

```bash
docker-compose down
```

### Using the Deployment Script

For convenience, a deployment script is provided that handles different deployment methods:

```bash
# Deploy using Docker
./scripts/deploy.sh --method docker

# Deploy using Docker Compose
./scripts/deploy.sh --method docker-compose

# Deploy locally
./scripts/deploy.sh --method local
```

For more options:

```bash
./scripts/deploy.sh --help
```

## Monitoring

The application includes a basic monitoring setup using Prometheus and Grafana when deployed with Docker Compose.

### Prometheus

Prometheus collects metrics from the application, including:

- Request counts and rates
- Response times
- Error rates
- Memory and CPU usage
- Node.js event loop lag

Access the Prometheus UI at http://localhost:9090 when deployed with Docker Compose.

### Grafana

Grafana provides visualization of the metrics collected by Prometheus through a pre-configured dashboard that includes:

- Server status (up/down)
- Request rate
- Response time distribution
- Error rate
- Memory usage
- CPU usage
- HTTP status code distribution
- Event loop lag

Access Grafana at http://localhost:3001 and log in with username `admin` and password `admin` when deployed with Docker Compose.

## Health Checks

A health check script is provided to verify that the application is running correctly:

```bash
# Basic health check
./scripts/health-check.sh

# Health check with custom host and port
./scripts/health-check.sh --host localhost --port 3000

# Verbose health check
./scripts/health-check.sh --verbose
```

The script checks if the `/hello` endpoint returns "Hello world" with a 200 OK status code.

## Docker Compose Configuration

The `docker-compose.yml` file defines three services:

1. **hello-world-app**: The Node.js Hello World application
2. **prometheus**: Metrics collection and storage
3. **grafana**: Metrics visualization

The services are connected through a bridge network named `hello-world-network` and configured with appropriate volumes for persistence and configuration.

## Environment Variables

The application and infrastructure components support the following environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | The port number the server listens on |
| HOST | 0.0.0.0 | The host address the server binds to |
| NODE_ENV | development | The environment the application runs in |

These can be set in the Docker Compose file or passed to the container at runtime.

## Maintenance

### Updating Dependencies

To update the application dependencies:

```bash
cd ../src/backend
npm update
```

### Rebuilding Containers

After making changes to the application code or dependencies, rebuild the containers:

```bash
docker-compose build
docker-compose up -d
```

## Troubleshooting

### Application Not Responding

1. Check if the container is running: `docker ps`
2. Check container logs: `docker logs hello-world-app`
3. Run the health check script: `./scripts/health-check.sh --verbose`

### Monitoring Not Working

1. Check if Prometheus and Grafana containers are running: `docker ps`
2. Check Prometheus logs: `docker logs prometheus`
3. Check Grafana logs: `docker logs grafana`
4. Verify Prometheus can reach the application: http://localhost:9090/targets

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)