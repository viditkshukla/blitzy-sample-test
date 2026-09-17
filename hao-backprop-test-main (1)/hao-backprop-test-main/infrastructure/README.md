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
├── local/
│   └── docker-compose.yml     # Docker Compose configuration
├── monitoring/
│   ├── prometheus.yml         # Prometheus configuration
│   └── grafana-dashboard.json # Grafana dashboard configuration
└── scripts/
    ├── deploy.sh              # Deployment script
    ├── health-check.sh        # Health check script
    ├── setup.sh               # Local provisioning script
    └── start-server.sh        # Server launcher
```

## Deployment Options

The application can be deployed in several ways, depending on your needs and environment:

### Local Deployment

For local development and testing, you can run the application directly with Node.js:

```bash
cd ../src/backend

# No manifest declares the application's dependencies, so install its one
# runtime dependency explicitly; --no-save leaves package.json unchanged
npm install --no-save dotenv@16.0.3

# No "start" script is defined, and npm start would fall back to the unrelated
# root server.js demo, so run the backend entry point directly
node index.js
```

The application will be available at http://localhost:3000/welcome.

### Docker Deployment

To deploy the application as a standalone Docker container:

```bash
# The build fails until src/backend carries a manifest: its Dockerfile copies
# package*.json and runs npm ci, and neither file exists in that directory
docker build -t hello-node:latest ../src/backend

docker run -p 3000:3000 -d --name hello-node hello-node:latest
```

The application will be available at http://localhost:3000/welcome.

To stop the container:

```bash
docker stop hello-node
docker rm hello-node
```

### Docker Compose Deployment

To deploy the application through Docker Compose:

```bash
# The Compose file lives in local/, so its path is passed explicitly; it defines
# the single application service, which builds the root Dockerfile and is
# blocked by the same missing src/backend manifest
docker-compose -f local/docker-compose.yml up -d
```

This starts the one service the Compose file defines:
- The Node.js Hello World application (http://localhost:3000/welcome)

The Prometheus and Grafana configurations under `monitoring/` are not declared in that file,
so this command starts neither of them. See [Monitoring](#monitoring) for what those files
cover and the gap they carry.

To stop all services:

```bash
docker-compose -f local/docker-compose.yml down
```

### Using the Deployment Script

For convenience, a deployment script is provided that handles different deployment methods:

```bash
# deploy.sh exposes only --env (development|staging|production), --verbose and
# --help; its pipeline is fixed: build the image, then Docker Compose, then the
# health check. It aborts at its prerequisite check until health-check.sh is
# executable (chmod +x scripts/health-check.sh)
bash ./scripts/deploy.sh --env development

# The same deployment with verbose logging
bash ./scripts/deploy.sh --env production --verbose
```

For more options:

```bash
bash ./scripts/deploy.sh --help
```

### Using the Setup and Launcher Scripts

Two further scripts cover a local run without Docker. `setup.sh` provisions the checkout —
it checks the Node.js and npm prerequisites, installs dependencies unless `-s` is given,
writes `PORT` and `NODE_ENV` into `.env`, creates the `logs/` directory and probes the
requested port. `start-server.sh` launches the server, in the foreground by default or in
the background with `-d`, and on either path it waits for the server to answer on the
requested port before it reports success. Its bookkeeping is per-port, so two launchers on
different ports never overwrite each other: the server's output goes to
`logs/server-$PORT.log` and its pid to `logs/server-$PORT.pid`, while the launcher's own
transcript goes to `logs/start-server.log`. A launch is refused outright when the pid
recorded for that port is still alive.

```bash
# Provision locally on the default port, skipping dependency installation
bash ./scripts/setup.sh -p 3000 -e development -s

# Start the server in the foreground, then the same in the background
bash ./scripts/start-server.sh -p 3000
bash ./scripts/start-server.sh -p 3000 -d
```

Both accept `-h` (also `--help`) and print their full option list: `-p PORT` and `-e ENV` on
both, `-s` on `setup.sh`, `-d` and `-v` on `start-server.sh`. `start-server.sh` additionally
rejects a `-p` value that is not a number between 1024 and 65535. Both also print the service
URL on success — `setup.sh` as step 3 of its "Next steps" block, `start-server.sh` from a
single helper used by both its foreground and its detached path — and both publish
`http://localhost:$PORT/welcome`, the one route
the application registers. The [Endpoint Reference Record](#endpoint-reference-record) below
gives the line each of those URLs is printed from.

## Monitoring

The `monitoring/` directory carries a Prometheus scrape configuration and a Grafana dashboard
definition for the application. Both are configuration only: no Prometheus or Grafana service
is declared anywhere in this repository, so the Compose file starts neither, and running
either one means bringing it up yourself with these files supplied to it.

### Known gap: the scrape targets have no producer

`prometheus.yml` scrapes `hello-world-app:3000/metrics` (job `hello-world-app`, every 5s) and
`hello-world-app:3000/health` (job `hello-world-health`, every 30s). **The application serves
neither path.** Its route table registers exactly one route, `/welcome`, so both requests
return `404 Not Found`, and `up{job="hello-world-app"}` and `up{job="hello-world-health"}`
read `0` against a service that is in fact healthy. The application also carries no metrics
instrumentation — it declares no dependencies and no metrics library — so every dashboard
panel querying `http_requests_total`, `http_request_duration_seconds_bucket`,
`nodejs_memory_usage_bytes`, `nodejs_cpu_usage_percentage`, `nodejs_event_loop_lag_seconds`
or `process_start_time_seconds` renders empty.

This is a pre-existing gap, recorded here rather than closed:

- Adding a `/metrics` or `/health` endpoint, an exporter or any instrumentation is out of
  scope for the change that introduced `/welcome`.
- Deleting the jobs or the panels is not the remedy either. The configuration is retained
  as the record of what the dashboard expects, and its job and service label values are
  what every PromQL selector in the dashboard matches on, so removing or renaming either
  would orphan the dashboard instead of repairing it.
- The check that does verify this service today is `bash ./scripts/health-check.sh` (see
  [Health Checks](#health-checks)), which requests `/welcome` and matches the response body.
  It is a deployment gate rather than a scrape target, so it produces no Prometheus series.

### Prometheus

`prometheus.yml` defines three scrape jobs — `prometheus` (self-monitoring on
`localhost:9090/metrics`), `hello-world-app` (`/metrics`) and `hello-world-health`
(`/health`) — with a 15s default scrape and evaluation interval. Alerting and rule files are
declared as empty placeholders: no alertmanager is configured and no rule file is loaded. The
two application jobs are subject to the gap above.

Access the Prometheus UI at http://localhost:9090 when you run Prometheus with this
configuration.

### Grafana

`grafana-dashboard.json` is a pre-configured dashboard (uid `hello-world-dashboard`) of 13
panels: one markdown header panel and twelve metric panels —

- Application Status and Health Check Status (the two `up` series)
- Uptime and Total Requests
- Request Rate, Response Time and Endpoint Traffic
- HTTP Status Codes and Error Rate
- Memory Usage, CPU Usage and Event Loop Lag

Its PromQL selectors query `job="hello-world-app"` and `job="hello-world-health"`, exactly
the job labels `prometheus.yml` sets, so the dashboard and the scrape configuration agree
with each other; both await a producer per the gap above.

Access Grafana at http://localhost:3001 and log in with username `admin` and password `admin`
when you run Grafana with this dashboard.

## Health Checks

A health check script is provided to verify that the application is running correctly:

```bash
# Basic health check
bash ./scripts/health-check.sh

# Health check with custom host and port
bash ./scripts/health-check.sh --host localhost --port 3000

# Verbose health check
bash ./scripts/health-check.sh --verbose
```

The script checks if the `/welcome` endpoint returns "Welcome to HelloGHES" with a 200 OK status code.

## Docker Compose Configuration

The `docker-compose.yml` file defines one service:

1. **hello-world-app**: The Node.js Hello World application

It is attached to a bridge network named `hello-world-network`, bind-mounts `../../src/backend`
over `/app`, keeps the container's `node_modules` on an anonymous volume, and declares a
`node_modules` named volume that is reserved and currently unused. Its `healthcheck` entry is
the only container health check in the repository — neither Dockerfile carries a `HEALTHCHECK`
instruction.

The file also declares the obsolete top-level `version: '3.8'` key at line 1. Compose v2
ignores the attribute and warns `the attribute version is obsolete, it will be ignored, please
remove it to avoid potential confusion` on every invocation — `config`, `build`, `up` and
`down` alike. The key has been there since the file was written and is kept deliberately: it
has no effect on what Compose resolves, and removing it falls outside the single line
(the health-check URL) that the `/welcome` change authorizes in this file. Anyone permitted to
edit the file more widely should delete the line; nothing else depends on it.

## Endpoint Reference Record

Where the endpoint and the deliberately-kept product identifiers appear in this directory,
with the line each sits on as of this commit. Line numbers drift whenever a file above them
grows, so each row carries the command that re-derives it.

`local/docker-compose.yml` — `grep -n "hello-world\|/welcome\|^version" local/docker-compose.yml`:

| Line | Content | Status |
|------|---------|--------|
| 1 | `version: '3.8'` | Obsolete under Compose v2, ignored, warns on every invocation; deliberately kept |
| 8 | `hello-world-app:` | Service name — an identifier, not renamed by the `/welcome` change |
| 12 | `image: hello-world-app:latest` | Image name — identifier, not renamed |
| 13 | `container_name: hello-world-app` | Container name — identifier, not renamed |
| 26 | `test: ["CMD", "curl", "-f", "http://localhost:3000/welcome"]` | The only container health check; the one line the `/welcome` change touched |
| 33 | `- hello-world-network` | Network reference — identifier, not renamed |
| 36 | `hello-world-network:` | Network definition — identifier, not renamed |

`scripts/` — `grep -n "/welcome" scripts/*.sh`:

| File | Line | Content |
|------|------|---------|
| `scripts/setup.sh` | 476 | `echo "3. Access the service at: http://localhost:$PORT/welcome"` |
| `scripts/start-server.sh` | 291 | `curl -sf -o /dev/null --max-time 2 "http://127.0.0.1:$port/welcome"` — the readiness probe the launcher polls before reporting success, not an operator-facing URL |
| `scripts/start-server.sh` | 356 | `log_message "INFO" "To access the Welcome endpoint, visit: http://localhost:$PORT/welcome"` — the published access line, emitted from `log_access_url` on both the foreground and the detached path |
| `scripts/health-check.sh` | 10 | `ENDPOINT="/welcome"`, with `EXPECTED_RESPONSE="Welcome to HelloGHES"` on the line below |

`scripts/health-check.sh:4` also names the endpoint in its header comment. The grep above
reports it alongside the four rows in the table.

`monitoring/prometheus.yml` and `monitoring/grafana-dashboard.json` contain no endpoint
reference of either kind: their `hello-world-app` and `hello-world-health` occurrences are job,
service and selector labels, and their scrape paths are `/metrics` and `/health`. See the
[known gap](#known-gap-the-scrape-targets-have-no-producer) above.

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
docker-compose -f local/docker-compose.yml build
docker-compose -f local/docker-compose.yml up -d
```

## Troubleshooting

### Application Not Responding

1. Check if the container is running: `docker ps`
2. Check container logs: `docker logs hello-world-app`
3. Run the health check script: `bash ./scripts/health-check.sh --verbose`

### Monitoring Not Working

Neither Prometheus nor Grafana is started by the Compose file, so start by confirming you
brought up the one you are debugging yourself, with the configuration from `monitoring/`.

1. Check if the Prometheus and Grafana containers you started are running: `docker ps`
2. Check their logs: `docker logs prometheus` and `docker logs grafana`
3. Check the scrape targets at http://localhost:9090/targets — `hello-world-app` and
   `hello-world-health` report down even against a healthy service, which is the
   [known gap](#known-gap-the-scrape-targets-have-no-producer) above rather than a fault
   to chase

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)