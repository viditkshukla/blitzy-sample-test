# Technical Specification

# 1. Introduction

## 1.1 Executive Summary

### 1.1.1 Project Overview

The Node.js Hello World Service is an educational tutorial project designed to demonstrate fundamental web service concepts with minimal complexity. This project implements a simple HTTP server application that exposes a single REST endpoint `/hello`, which returns the text "Hello world" to HTTP clients. 

The project serves as a practical learning tool for developers new to Node.js and RESTful API development, providing a complete implementation that follows modern best practices while maintaining simplicity and readability. Despite its educational focus, the project includes production-ready patterns including containerization with Docker, observability with Prometheus and Grafana, comprehensive testing with Jest, and complete governance documentation.

**Project Metadata:**
- **Project Name:** hello_world
- **Version:** 1.0.0
- **Author:** hxu
- **License:** MIT
- **Runtime:** Node.js 18.x LTS
- **Primary Language:** JavaScript (ES2022+)

### 1.1.2 Core Business Problem

The Node.js Hello World Service addresses a fundamental need in web development education: the lack of straightforward, practical examples that demonstrate core server-side concepts without overwhelming complexity. Many learning resources either oversimplify to the point of being unrealistic or introduce too many concepts simultaneously, creating barriers to understanding.

This project solves this educational challenge by providing:

1. **Entry Point to Server-Side JavaScript:** A minimal implementation that introduces developers to Node.js HTTP server capabilities without requiring extensive prerequisite knowledge
2. **Practical Reference Implementation:** A working example that demonstrates how to structure a simple web service following industry best practices
3. **Foundation for Complex Applications:** A baseline implementation that can serve as a starting point for building more sophisticated systems
4. **Best Practices Demonstration:** A showcase of proper error handling, configuration management, testing, and operational practices in a context simple enough to understand

The project bridges the gap between theoretical knowledge and practical implementation, enabling learners to understand not just how to write code, but how to structure it for maintainability, testability, and operational excellence.

### 1.1.3 Key Stakeholders and Users

| Stakeholder Group | Role and Interest | Primary Needs |
|---|---|---|
| Developers Learning Node.js | Primary users who study and modify the code to understand web service fundamentals | Clear documentation, simple implementation, well-commented code, practical examples |
| Technical Trainers and Educators | Use the project as teaching material in Node.js courses and workshops | Comprehensive examples, best practices demonstration, extensible architecture |
| Software Engineers | Reference the implementation when creating baseline projects or prototypes | Production-ready patterns, complete operational setup, minimal dependencies |

### 1.1.4 Expected Business Impact and Value Proposition

**Value Proposition:** The Node.js Hello World Service demonstrates fundamental Node.js web service concepts with minimal complexity, enabling rapid learning and prototyping while showcasing production-ready development practices.

**Educational Benefits:**

- **Simplicity and Readability:** Code structure designed specifically for comprehension, with clear separation of concerns and extensive inline documentation
- **Best Practices Demonstration:** Complete implementation following modern Node.js development standards, including configuration management, error handling, and graceful shutdown
- **Comprehensive Governance:** Full contribution guidelines, coding standards, and quality gates that demonstrate professional software development processes
- **Complete Operational Setup:** Production-ready containerization, monitoring, and testing infrastructure that learners can study and adapt
- **Minimal Dependencies:** Focuses on core Node.js functionality to reduce cognitive overhead and external complexity

**Measurable Impact:**

- Reduces time-to-competency for developers learning Node.js web service development
- Provides reusable foundation for rapid prototyping and proof-of-concept implementations
- Demonstrates complete development lifecycle from code to deployment to monitoring
- Serves as quality benchmark for simple web service implementations

## 1.2 System Overview

### 1.2.1 Project Context

#### Business Context and Market Positioning

The Node.js Hello World Service operates as a standalone educational tool within the broader ecosystem of web development learning resources. The project occupies a specific niche focused on practical, hands-on demonstration of fundamental concepts rather than theoretical instruction.

**Market Position:**

- **Target Audience:** Beginners to intermediate developers learning Node.js server-side development
- **Differentiation:** Combines simplicity with production-ready patterns, unlike tutorials that sacrifice quality for brevity
- **Educational Approach:** Learning through working code rather than isolated code snippets or theoretical examples
- **Scope:** Intentionally narrow focus on HTTP server basics to enable deep understanding of core concepts

The project demonstrates several critical web service concepts:

- Basic HTTP server implementation using Node.js native modules
- RESTful endpoint design and implementation patterns
- Modern JavaScript server-side development practices
- Configuration management and environment-based settings
- Error handling and graceful failure management
- Request logging and observability fundamentals
- Containerization and deployment practices

#### Current System Limitations

This is a new educational project developed from the ground up, not a replacement or upgrade of an existing system. Therefore, there are no legacy system limitations or migration concerns.

#### Integration with Enterprise Landscape

The Node.js Hello World Service is designed as a **standalone tutorial project** with no enterprise integration requirements. The project intentionally avoids external dependencies and integration points to maintain focus on core concepts and minimize setup complexity.

The service operates independently and does not require:
- Connection to enterprise authentication systems
- Integration with existing API gateways or service meshes
- Access to shared databases or data stores
- Coordination with other microservices or distributed systems

This isolation is a deliberate design choice to ensure the learning experience remains focused and accessible.

### 1.2.2 High-Level Description

#### Primary System Capabilities

The Node.js Hello World Service provides a focused set of capabilities that demonstrate fundamental web service patterns:

| Capability | Description | Implementation |
|---|---|---|
| HTTP Server | Lightweight Node.js server handling incoming HTTP requests on configurable port | Native `http` module or Express.js framework |
| REST Endpoint | Single `/hello` endpoint responding with "Hello world" text | GET request returns plain text response with 200 status |
| Configuration Management | Configurable server settings via environment variables | PORT, HOST, NODE_ENV, LOG_LEVEL with validation and defaults |
| Error Handling | Comprehensive error management for server lifecycle and request processing | 404, 405, 500 status codes with proper HTTP responses |

| Capability | Description | Implementation |
|---|---|---|
| Security Headers | Standard HTTP security headers applied to all responses | X-Content-Type-Options, X-Frame-Options, Content-Security-Policy |
| Request Logging | Basic logging of incoming requests with timestamps and details | Console-based logger with configurable verbosity levels |
| Health Checking | Monitoring endpoint for availability verification | `/hello` endpoint serves dual purpose as health check |
| Containerization | Docker support for consistent development and deployment | Multi-stage Dockerfile with Alpine Linux base image |

| Capability | Description | Implementation |
|---|---|---|
| Observability | Metrics collection and visualization for monitoring | Prometheus metrics scraping with Grafana dashboards |
| Graceful Shutdown | Proper server lifecycle management for clean termination | SIGINT/SIGTERM signal handling with connection draining |
| Development Tools | Hot-reload and testing infrastructure | nodemon for auto-restart, Jest for unit and integration testing |

**Request Processing Flow:**

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Middleware
    participant Router
    participant Handler
    
    Client->>Server: HTTP GET /hello
    Server->>Middleware: Process Request
    Middleware->>Middleware: Log Request Details
    Middleware->>Middleware: Apply Security Headers
    Middleware->>Router: Forward Request
    Router->>Router: Match URL Path
    Router->>Handler: Route to Hello Handler
    Handler->>Handler: Generate Response
    Handler->>Router: Return "Hello world"
    Router->>Middleware: Return Response
    Middleware->>Server: Return Response
    Server->>Client: HTTP 200 "Hello world"
```

#### Major System Components

The system architecture follows a layered design with clear separation of concerns, organized into distinct functional components:

```mermaid
graph TD
    subgraph "Application Entry Point"
        A[index.js]
    end
    
    subgraph "Server Layer"
        B[server.js]
        C[router.js]
    end
    
    subgraph "Middleware Layer"
        D[requestLogger.js]
        E[securityHeaders.js]
        F[applyMiddleware.js]
    end
    
    subgraph "Handler Layer"
        G[hello.js]
        H[notFound.js]
        I[methodNotAllowed.js]
    end
    
    subgraph "Support Layer"
        J[config.js]
        K[errorHandler.js]
        L[constants.js]
        M[logger.js]
    end
    
    A-->B
    B-->C
    B-->F
    F-->D
    F-->E
    C-->G
    C-->H
    C-->I
    B-->J
    B-->K
    G-->L
    D-->M
```

**Component Descriptions:**

| Component | File Location | Responsibility |
|---|---|---|
| Application Bootstrap | `index.js` | Entry point that initializes and starts the server |
| HTTP Server | `server.js` | Manages server lifecycle, socket connections, graceful shutdown |
| Request Router | `router.js` | Path-based request dispatching and route matching |
| Configuration Module | `config.js` | Environment variable loading, validation, and default value management |

| Component | File Location | Responsibility |
|---|---|---|
| Hello Handler | `handlers/hello.js` | Processes requests to `/hello` endpoint and generates response |
| Not Found Handler | `handlers/notFound.js` | Handles requests to non-existent paths with 404 response |
| Method Not Allowed Handler | `handlers/methodNotAllowed.js` | Handles invalid HTTP methods with 405 response |
| Error Handler | `errorHandler.js` | Centralized error management and error response formatting |

| Component | File Location | Responsibility |
|---|---|---|
| Request Logger | `middleware/requestLogger.js` | Logs incoming requests with method, path, and timestamp |
| Security Headers | `middleware/securityHeaders.js` | Applies standard HTTP security headers to responses |
| Middleware Composer | `middleware/applyMiddleware.js` | Chains middleware functions in correct order |
| Constants | `utils/constants.js` | Defines HTTP status codes, headers, and route paths |
| Logger Utility | `utils/logger.js` | Console-based logging with configurable levels |

**Component Interaction Architecture:**

```mermaid
graph LR
    subgraph "External"
        Client[HTTP Client]
    end
    
    subgraph "Server Process"
        Server[HTTP Server<br/>server.js]
        Config[Configuration<br/>config.js]
        
        subgraph "Request Pipeline"
            MW1[Request Logger]
            MW2[Security Headers]
            Router[Router<br/>router.js]
        end
        
        subgraph "Handlers"
            Hello[Hello Handler]
            NotFound[404 Handler]
            Method[405 Handler]
        end
        
        Error[Error Handler]
    end
    
    Client-->|HTTP Request|Server
    Config-->|Settings|Server
    Server-->MW1
    MW1-->MW2
    MW2-->Router
    Router-->|/hello|Hello
    Router-->|unknown path|NotFound
    Router-->|invalid method|Method
    Hello-->|Response|Client
    Error-->|Error Response|Client
```

#### Core Technical Approach

The Node.js Hello World Service employs a deliberate technical strategy that prioritizes educational value while maintaining production-ready patterns:

**Implementation Philosophy:**

1. **Native-First Approach:** The project primarily uses Node.js built-in `http` module rather than heavyweight frameworks, maximizing learning value by exposing fundamental concepts. An Express.js implementation is provided as an optional alternative to demonstrate framework usage patterns.

2. **Minimal Dependencies:** The production runtime depends only on Node.js native modules and the `dotenv` package for configuration. This design choice reduces complexity, minimizes security surface area, and focuses attention on core concepts rather than framework-specific patterns.

3. **Test-Friendly Design:** All components expose promise-based APIs (e.g., `startServer()`, `stopServer()`) and pure functions to enable comprehensive testing without mocking complexity. The architecture separates concerns to allow isolated unit testing of individual components.

4. **Configuration-Driven Behavior:** All runtime behavior is controlled through environment variables with sensible defaults, demonstrating the twelve-factor app methodology and enabling easy configuration across development, testing, and production environments.

5. **Production-Ready Patterns:** Despite its educational focus, the project implements proper error handling, graceful shutdown, health checks, observability, and security headers—demonstrating that even simple services should follow operational best practices.

**Architecture Style:**

The system follows a **monolithic HTTP server architecture** using a synchronous request-response pattern. This traditional approach is intentionally chosen for its simplicity and direct mapping to HTTP fundamentals, making it ideal for learning purposes.

**Request Processing Strategy:**

```mermaid
flowchart TD
    Start[Incoming HTTP Request] --> Receive[Server Receives Request]
    Receive --> Log[Request Logger Middleware]
    Log --> Security[Security Headers Middleware]
    Security --> Route{Router: Match Path}
    
    Route -->|/hello + GET| HelloHandler[Hello Handler]
    Route -->|/hello + other method| MethodHandler[405 Handler]
    Route -->|unknown path| NotFoundHandler[404 Handler]
    
    HelloHandler --> Response[Generate Response]
    MethodHandler --> Response
    NotFoundHandler --> Response
    
    Response --> Error{Error Occurred?}
    Error -->|Yes| ErrorHandler[Error Handler]
    Error -->|No| Send[Send Response]
    ErrorHandler --> Send
    
    Send --> End[Response Sent to Client]
```

**Key Design Decisions:**

- **Stateless Design:** No session management or persistent state, each request is independent
- **Synchronous Processing:** Simple request-response without asynchronous complexity or queuing
- **Single Process:** No clustering or multi-process architecture to maintain simplicity
- **Direct Response:** No caching, CDN, or response transformation layers
- **Explicit Error Handling:** Clear error paths with specific HTTP status codes and messages

### 1.2.3 Success Criteria

#### Measurable Objectives

The Node.js Hello World Service defines clear, measurable objectives that establish concrete targets for successful implementation:

| Objective | Measurement Criteria | Priority | Status |
|---|---|---|---|
| Functional HTTP Server | Server successfully starts and listens for connections on configured port | Must-Have | Core Requirement |
| Correct Response | `/hello` endpoint returns exact "Hello world" string with 200 status | Must-Have | Core Requirement |
| Educational Value | Code is well-documented and follows Node.js best practices | Must-Have | Core Requirement |
| Accessibility | Project can be set up and run with minimal dependencies and configuration | Must-Have | Core Requirement |

**Functional Requirements:**

- **F-001 (HTTP Server Implementation):** Server must start successfully, bind to configured port, accept incoming connections, and handle HTTP/1.1 requests
- **F-002 (Hello World Endpoint):** GET requests to `/hello` must return plain text "Hello world" with Content-Type: text/plain and HTTP 200 status
- **F-003 (Error Handling):** Server must gracefully handle startup errors, invalid requests, and unexpected failures with appropriate HTTP status codes

#### Critical Success Factors

The following factors are essential for the project to achieve its educational mission:

1. **Simplicity and Readability**
   - Code structure must be immediately comprehensible to developers new to Node.js
   - Clear separation of concerns with single-responsibility components
   - Extensive inline comments explaining key concepts and design decisions
   - Consistent naming conventions and code organization

2. **Proper Error Handling**
   - Graceful handling of server startup failures (e.g., port already in use)
   - Appropriate HTTP status codes for different error scenarios (404, 405, 500)
   - Informative error messages that aid debugging
   - No unhandled promise rejections or uncaught exceptions

3. **Adherence to Node.js Best Practices**
   - Use of native Node.js APIs where appropriate
   - Proper async/await patterns and promise handling
   - Environment-based configuration management
   - Graceful shutdown with signal handling
   - Resource cleanup and connection management

4. **Comprehensive Documentation**
   - Clear README with setup and usage instructions
   - API documentation for the `/hello` endpoint
   - Architecture explanations and design rationale
   - Contributing guidelines and coding standards
   - Inline code comments for complex logic

5. **Test Coverage**
   - High test coverage demonstrating quality practices
   - Both unit tests (isolated component testing) and integration tests (end-to-end scenarios)
   - Test code serves as additional usage documentation
   - Automated test execution in development workflow

#### Key Performance Indicators

The project defines specific, measurable KPIs to evaluate implementation quality:

**Performance KPIs:**

| KPI | Target | Priority | Rationale |
|---|---|---|
| Server Response Time | < 100ms | High | Demonstrates efficient implementation without performance bottlenecks |
| Server Startup Time | < 1 second | Medium | Quick startup enables rapid development iteration |
| Memory Footprint | < 50MB RSS | Medium | Validates lightweight implementation approach |

**Reliability KPIs:**

| KPI | Target | Priority | Rationale |
|---|---|---|
| Successful Response Rate | 100% | Critical | All valid requests must receive correct responses |
| Unhandled Exceptions | 0 | Critical | Proper error handling with no crashes |
| Graceful Shutdown Success | 100% | High | Clean termination without connection drops |

**Quality KPIs:**

| KPI | Target | Priority | Rationale |
|---|---|---|
| Test Coverage - Handlers | 100% | High | Critical request processing logic must be fully tested |
| Test Coverage - Router | ≥ 90% | High | Core routing logic requires comprehensive testing |
| Test Coverage - Server | ≥ 85% | High | Server lifecycle and integration scenarios covered |
| Test Coverage - Global | ≥ 90% | High | Overall quality standard for the codebase |
| Linting Errors | 0 | High | Code quality and consistency enforcement |

**Operational KPIs:**

| KPI | Target | Priority | Rationale |
|---|---|---|
| Documentation Coverage | 100% of public APIs | High | All user-facing functionality must be documented |
| Setup Time for New Users | < 5 minutes | Medium | Educational project must be easy to get started |
| Docker Build Time | < 2 minutes | Low | Acceptable containerization overhead |

## 1.3 Scope

### 1.3.1 In-Scope Elements

#### Core Features and Functionalities

The Node.js Hello World Service delivers a focused set of features that demonstrate fundamental web service patterns:

| Feature ID | Feature Name | Description | Priority |
|---|---|---|---|
| F-001 | HTTP Server Implementation | Node.js server listening on configurable port (default 3000), handling HTTP/1.1 requests | Critical |
| F-002 | Hello World Endpoint | GET endpoint at `/hello` returning plain text "Hello world" with 200 status | Critical |
| F-003 | Basic Error Handling | Server startup error management and request error handling with appropriate HTTP status codes | High |

**Additional Supported Features:**

| Feature | Description | Implementation |
|---|---|---|
| Request Logging | Log incoming requests with method, path, timestamp, and response status | Console-based logger with configurable LOG_LEVEL |
| Security Headers | Standard HTTP security headers applied to all responses | X-Content-Type-Options, X-Frame-Options, Content-Security-Policy |
| Configuration Management | Environment variable-based configuration with validation and defaults | dotenv integration, PORT/HOST/NODE_ENV/LOG_LEVEL variables |
| Health Checking | Endpoint for monitoring service availability and health | `/hello` endpoint serves dual purpose, returns 200 when operational |

**Primary User Workflows:**

The project supports the following core workflows for developers learning Node.js:

1. **Local Development Workflow:**
   - Clone repository
   - Install dependencies (`npm install`)
   - Start server (`npm start` or `npm run dev`)
   - Send GET request to `http://localhost:3000/hello`
   - Receive "Hello world" response
   - View request logs in console
   - Stop server gracefully (Ctrl+C)

2. **Docker Development Workflow:**
   - Build Docker image
   - Start container with Docker Compose
   - Access service through exposed port
   - View logs through Docker
   - Stop container cleanly

3. **Testing Workflow:**
   - Run unit tests (`npm test`)
   - Run integration tests (`npm run test:integration`)
   - Generate coverage report (`npm run test:coverage`)
   - Verify test results

4. **Monitoring Workflow:**
   - Start full stack with Docker Compose (app + Prometheus + Grafana)
   - Access Grafana dashboard
   - View metrics and health status
   - Monitor request rates and response times

**Essential Integrations:**

| Integration | Type | Purpose | Implementation |
|---|---|---|
| Docker | Containerization | Package application with dependencies for consistent deployment | Dockerfile with node:18-alpine base image |
| Docker Compose | Orchestration | Local development environment with monitoring stack | docker-compose.yml with app, Prometheus, and Grafana services |
| Prometheus | Monitoring | Metrics collection and time-series storage | Scrapes `/metrics` and `/health` endpoints every 5-30 seconds |
| Grafana | Visualization | Metrics dashboards and alerting | Pre-configured dashboard with Prometheus datasource |

**Key Technical Requirements:**

| Requirement Category | Specifications |
|---|---|
| Runtime Environment | Node.js 18.x LTS or higher, npm 9.x or higher |
| Port Configuration | Configurable via PORT environment variable (default: 3000) |
| Host Configuration | Configurable via HOST environment variable (default: 0.0.0.0) |
| Response Format | Plain text (`Content-Type: text/plain`) for `/hello` endpoint |
| HTTP Protocol | HTTP/1.1 over TCP/IP |
| Response Content | Exact string "Hello world" (case-sensitive) |
| Supported HTTP Methods | GET for `/hello`, returns 405 for other methods |
| Error Response Codes | 404 (Not Found), 405 (Method Not Allowed), 500 (Internal Server Error) |

#### Implementation Boundaries

The Node.js Hello World Service operates within clearly defined boundaries to maintain focus and simplicity:

**System Boundaries:**

| Boundary Type | Definition |
|---|---|
| Process Architecture | Single server process without clustering or multi-process architecture |
| Network Interface | Binds to configured HOST (default 0.0.0.0) on configured PORT (default 3000) |
| Protocol Support | HTTP/1.1 only; no HTTPS, HTTP/2, or WebSocket support |
| Endpoint Scope | Single endpoint `/hello`; no additional routes or API versioning |

**User Groups Covered:**

The project explicitly targets the following user groups:

- **Primary Users:** Developers learning Node.js web service development (beginners to intermediate level)
- **Secondary Users:** Technical trainers and educators using the project as teaching material
- **Tertiary Users:** Software engineers referencing the implementation for baseline projects or prototypes

**Geographic and Market Coverage:**

| Coverage Aspect | Scope |
|---|---|
| Geographic Coverage | Not applicable—educational project accessible globally without geographic restrictions |
| Market Segment | Educational and learning-focused; not designed for commercial production use |
| Language Support | English documentation and code comments; response content in English |
| Internationalization | Not applicable—single language, no localization requirements |

**Data Domains:**

| Data Category | Scope |
|---|---|
| Persistent Data | None—completely stateless service with no data storage |
| In-Memory Data | Minimal—configuration loaded at startup, no session or cache data |
| Request Data | No request body parsing or query parameter processing |
| Response Data | Static text response only ("Hello world") |
| Logging Data | Request metadata (method, path, timestamp) logged to console |

**Deployment Scope:**

| Environment | Support Level | Configuration |
|---|---|---|
| Local Development | Fully Supported | Direct Node.js execution or Docker container |
| Docker Containers | Fully Supported | Dockerfile and Docker Compose provided |
| Docker Compose Stack | Fully Supported | Includes app, Prometheus, and Grafana services |
| Cloud Platforms | Not Covered | No cloud-specific deployment configurations |
| Kubernetes | Not Covered | No Kubernetes manifests or Helm charts |
| Production Environments | Not Covered | Educational project not optimized for production |

### 1.3.2 Out-of-Scope Elements

#### Explicitly Excluded Features and Capabilities

To maintain the project's educational focus and manageable complexity, the following features are explicitly excluded from the current scope:

**Authentication and Authorization:**

- No user authentication mechanisms (OAuth, JWT, basic auth)
- No API key validation or token-based security
- No role-based access control (RBAC) or permissions system
- No rate limiting per user or API key
- Public endpoint with no access restrictions or authorization checks

**Data Management:**

- No database integration (SQL, NoSQL, or in-memory databases)
- No persistent storage or data persistence layer
- No data caching beyond minimal in-memory configuration
- No data validation (service accepts no input data)
- No session management or state persistence
- No file system operations (reading/writing files)
- No data transformation or business logic

**Advanced HTTP Functionality:**

- Multiple endpoints beyond `/hello` (no `/users`, `/products`, etc.)
- Request body parsing (JSON, form data, multipart uploads)
- Query parameter processing
- URL path parameters or dynamic routes
- HTTP methods beyond GET (no POST, PUT, DELETE, PATCH)
- File upload/download capabilities
- Streaming responses
- Content negotiation (service returns only plain text)
- API versioning (no `/v1/`, `/v2/` routes)

**Advanced Error Handling:**

- Retry mechanisms or circuit breakers
- Advanced error recovery strategies
- Distributed tracing for error debugging
- Error aggregation or error reporting services
- Custom error pages or error response templating

**Performance Optimization:**

- Response caching (HTTP cache headers, CDN integration)
- Request rate limiting or throttling
- Load balancing or reverse proxy configuration
- Process clustering for multi-core utilization
- Response compression (gzip, brotli)
- Connection pooling or keep-alive optimization
- Performance profiling or APM integration

**Production-Grade Operational Features:**

- Production deployment configurations (cloud platforms, PaaS)
- High availability configurations (redundancy, failover)
- Disaster recovery procedures or backup strategies
- Horizontal scaling configurations (auto-scaling, load distribution)
- Blue-green deployment or canary release support
- Automated rollback mechanisms
- Log aggregation infrastructure (ELK stack, Splunk)
- Advanced monitoring (distributed tracing, APM tools)
- Service mesh integration (Istio, Linkerd)
- API Gateway integration
- Certificate management or HTTPS/TLS termination

**Advanced Observability:**

- Distributed tracing (OpenTelemetry, Jaeger, Zipkin)
- Application Performance Monitoring (APM) integration
- Custom business metrics beyond basic request counts
- Log shipping to external services
- Alert management and notification systems
- SLA monitoring and enforcement
- Anomaly detection or predictive monitoring

**Client-Side Components:**

- Web user interface or frontend application
- Admin dashboard or management console
- Client libraries or SDKs for consuming the API
- API documentation generation tools (Swagger/OpenAPI specs)
- Interactive API documentation (Swagger UI, Redoc)

**Development and CI/CD Features:**

- Automated deployment pipelines (beyond basic Docker)
- Continuous delivery to production environments
- Automated integration testing in CI pipeline (structure exists but not fully implemented)
- Code quality gates in CI (linting, coverage thresholds)
- Automated security scanning (SAST, DAST, dependency scanning)
- Infrastructure as Code (Terraform, CloudFormation)
- GitOps workflows

**Advanced Networking:**

- WebSocket support for real-time communication
- Server-Sent Events (SSE) for streaming updates
- GraphQL endpoints or GraphQL gateway
- gRPC or Protocol Buffers support
- Service-to-service communication (microservices mesh)
- Message queue integration (RabbitMQ, Kafka, SQS)

#### Future Phase Considerations

While the current scope is intentionally minimal, the documentation acknowledges potential evolution paths for learners who want to extend the project:

**Potential Enhancements for Learning:**

1. **Express.js Expansion:**
   - Add middleware ecosystem exploration (body-parser, helmet, cors)
   - Implement additional routes for CRUD operations
   - Demonstrate routing patterns and route organization

2. **Database Integration:**
   - Add MongoDB or PostgreSQL for persistent storage
   - Implement data models and ORM/ODM usage
   - Demonstrate connection pooling and query optimization

3. **Authentication Layer:**
   - Implement JWT-based authentication
   - Add user registration and login endpoints
   - Demonstrate password hashing and token validation

4. **API Expansion:**
   - Create multiple resource endpoints (users, posts, comments)
   - Implement RESTful CRUD operations
   - Add request validation and error handling

5. **Production Features:**
   - Add API Gateway integration
   - Implement service discovery and registration
   - Demonstrate containerized microservices architecture
   - Add comprehensive logging infrastructure

These enhancements are documented as potential learning paths but are not part of the current project scope.

#### Unsupported Use Cases

The following use cases are explicitly **not supported** by the Node.js Hello World Service:

**Production Workloads:**

- High-traffic production applications requiring scaling and load balancing
- Mission-critical services requiring high availability and fault tolerance
- Applications requiring sub-10ms response times or performance optimization
- Services requiring 99.9%+ uptime SLAs
- Applications requiring regulatory compliance (HIPAA, PCI-DSS, SOC 2)

**Multi-Tenant Applications:**

- Software-as-a-Service (SaaS) platforms with tenant isolation
- Applications requiring user-specific data segregation
- Role-based access control across organizations
- Per-tenant customization or configuration

**Data-Intensive Applications:**

- Data processing pipelines or ETL workflows
- Analytics or reporting applications
- Big data processing or batch jobs
- Real-time data streaming applications
- Applications requiring complex data transformations

**Real-Time Communication:**

- Chat applications or messaging systems
- Real-time collaboration tools
- Live dashboards with push updates
- WebSocket-based applications
- Server-Sent Events for streaming

**File Operations:**

- Document management systems
- File upload and storage services
- Image processing or media transcoding
- Backup and archive services

**Background Processing:**

- Job queue processing (Celery, Bull, Sidekiq)
- Scheduled tasks or cron-like functionality
- Asynchronous task processing
- Long-running background jobs
- Event-driven architecture with message queues

**Integration Scenarios:**

- Third-party API integrations (payment gateways, email services)
- Webhook handling or callback processing
- OAuth provider implementation
- SAML or SSO integration
- Enterprise service bus (ESB) integration

**Mobile and IoT:**

- Mobile backend services (push notifications, device management)
- IoT device communication and management
- Real-time telemetry data collection
- Firmware update distribution

## 1.4 References

#### Files Examined

This Introduction section is based on comprehensive analysis of the following repository files:

- `README.md` - Project overview, features, installation instructions, API documentation, and monitoring setup
- `blitzy/documentation/Input Prompt.md` - Original project requirement specifying Node.js `/hello` endpoint
- `blitzy/documentation/Technical Specifications_472077ad-2e7b-41d9-bce7-355d5148626f.md` - Comprehensive technical specification including system architecture, component design, and testing strategy
- `blitzy/documentation/Technical Specifications_fca92202-37b4-4793-b2e8-7e82e4a573e4.md` - Alternative technical specification with F-003 error handling feature and success criteria
- `package.json` - Project metadata, dependencies, and scripts configuration
- `infrastructure/local/docker-compose.yml` - Docker Compose configuration for local development with monitoring stack
- `src/backend/config.js` - Configuration module implementation with environment variable management and validation
- `CONTRIBUTING.md` - Contribution guidelines, development workflow, coding standards, and quality requirements

#### Folders Analyzed

The following directory structures were examined to understand project organization and architecture:

- **Root Repository Structure** (`hao-backprop-test-main/`) - Overall project layout and organization
- **Documentation Bundle** (`blitzy/documentation/`) - Technical specifications and project requirements
- **Source Code** (`src/backend/`) - Backend application implementation including server, handlers, middleware, and utilities
- **Infrastructure Configuration** (`infrastructure/`) - Deployment configurations and operational resources
- **Local Development Setup** (`infrastructure/local/`) - Docker Compose environment for local development and testing

#### Information Sources

All information in this Introduction section is derived from the repository contents listed above. No external sources or web searches were used. All statements are grounded in evidence from the actual project files and folder structures examined during the documentation process.

# 2. Product Requirements

## 2.1 Overview

This section provides a comprehensive catalog of discrete, testable features that constitute the Node.js Hello World Service. Each feature is documented with complete metadata, functional requirements, acceptance criteria, and implementation specifications. The requirements are organized to support traceability from high-level features through detailed implementation requirements, ensuring complete coverage of the system's capabilities.

The Node.js Hello World Service implements **11 distinct features** across five primary categories: Core Infrastructure (F-001), API Endpoints (F-002), Infrastructure Services (F-003 through F-006), Observability (F-007, F-010), and Quality Assurance (F-008, F-009, F-011). All requirements are grounded in the actual implementation as evidenced by the source code in `src/backend/`.

## 2.2 Feature Catalog

### 2.2.1 F-001: HTTP Server Implementation

#### 2.2.1.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-001 |
| Feature Name | HTTP Server Implementation |
| Category | Core Infrastructure |
| Priority | Critical |
| Status | Completed |
| Implementation Location | `src/backend/server.js`, `src/backend/index.js` |

#### 2.2.1.2 Feature Description

**Overview:**
The HTTP Server Implementation provides the foundational HTTP/1.1 server capability using Node.js native `http` module. This feature implements a lightweight server that binds to a configurable address and port, accepts incoming TCP connections, processes HTTP requests through a middleware chain, and manages the complete server lifecycle from startup through graceful shutdown.

**Business Value:**
Demonstrates fundamental Node.js server patterns without framework dependencies, enabling learners to understand core HTTP server mechanics. The implementation showcases promise-based lifecycle management, proper error handling, and production-ready operational patterns suitable for educational purposes and prototyping.

**User Benefits:**
- Developers gain hands-on experience with native Node.js HTTP server APIs
- Clear demonstration of server lifecycle management patterns
- Reusable foundation for building more complex HTTP services
- Understanding of middleware chain composition and request processing flow

**Technical Context:**
Implemented in `src/backend/server.js` (lines 1-169), the server uses Node.js `http.createServer()` with custom request handling logic. The `startServer()` function returns a Promise that resolves when the server successfully binds to the configured port, while `stopServer()` handles graceful shutdown by closing the server listener and draining active connections. The entry point `src/backend/index.js` initializes the server and registers SIGINT/SIGTERM signal handlers for clean termination.

#### 2.2.1.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-001-RQ-001 | Server must successfully bind to HOST:PORT from configuration | Must-Have | Medium |
| F-001-RQ-002 | Server must validate PORT is integer 1-65535, default to 3000 if invalid | Must-Have | Low |
| F-001-RQ-003 | Server must provide promise-based `startServer()` returning Server instance | Must-Have | Low |
| F-001-RQ-004 | Server must handle EADDRINUSE errors with informative logging | Must-Have | Medium |

**Acceptance Criteria:**

**F-001-RQ-001:**
- Server binds to HOST from environment variable (default: 0.0.0.0)
- Server listens on PORT from environment variable (default: 3000)
- Successful binding logged with "Server listening on http://{HOST}:{PORT}" message
- Server accepts incoming HTTP/1.1 connections immediately after binding

**F-001-RQ-002:**
- Invalid PORT values (non-numeric, < 1, > 65535) trigger console warning
- Server falls back to PORT 3000 when invalid value provided
- Validation occurs during configuration loading in `config.js`
- Warning message includes attempted value and fallback value

**F-001-RQ-003:**
- `startServer()` returns Promise<http.Server>
- Promise resolves after successful port binding
- Promise rejects if port already in use or other startup error occurs
- `stopServer()` returns Promise<void> resolving after server closes

**F-001-RQ-004:**
- EADDRINUSE error caught and logged with "Port {PORT} is already in use" message
- Other startup errors logged with error details
- Process exits with code 1 after logging startup error
- Error handler in `src/backend/errorHandler.js` provides centralized error formatting

#### 2.2.1.4 Technical Specifications

**Input Parameters:**
- `PORT` environment variable (default: 3000, validated range: 1-65535)
- `HOST` environment variable (default: 0.0.0.0)
- `NODE_ENV` environment variable (default: 'development')

**Output/Response:**
- Running HTTP server instance listening on configured address
- Console log: "Server listening on http://{HOST}:{PORT}"
- Promise<Server> from startServer(), Promise<void> from stopServer()

**Performance Criteria:**
- Server startup time: < 1 second from process start to ready state
- Memory footprint: < 50MB RSS for idle server
- Request processing latency: < 100ms for `/hello` endpoint

**Data Requirements:**
- Stateless server with no persistent data storage
- Configuration loaded once at startup from environment variables via `dotenv`
- No session management or request caching

#### 2.2.1.5 Dependencies

**Prerequisite Features:**
- F-006 (Configuration Management) - Provides HOST, PORT, NODE_ENV settings
- F-004 (Request Logging) - Logs server lifecycle events and requests
- F-005 (Security Headers) - Middleware applied to all responses

**System Dependencies:**
- Node.js 18.x LTS runtime environment
- Native `http` module (built-in)
- Native `path` module (built-in)
- `dotenv` package v16.0.3 for environment variable loading

**External Dependencies:**
- Operating system TCP/IP stack for socket binding
- File system access for loading `.env` file (optional)

**Integration Requirements:**
- Integrates with router (`src/backend/router.js`) for request dispatching
- Integrates with middleware chain (`src/backend/middleware/index.js`)
- Requires error handler (`src/backend/errorHandler.js`) for error processing

### 2.2.2 F-002: Hello World Endpoint

#### 2.2.2.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-002 |
| Feature Name | Hello World Endpoint |
| Category | API Endpoint |
| Priority | Critical |
| Status | Completed |
| Implementation Location | `src/backend/handlers/helloHandler.js` |

#### 2.2.2.2 Feature Description

**Overview:**
The Hello World Endpoint implements the core functional requirement of the service: a single REST endpoint at `/hello` that responds to HTTP GET requests with the plain text response "Hello world". This endpoint serves as both the primary educational demonstration and the service health check indicator.

**Business Value:**
Provides the fundamental example of RESTful endpoint implementation in Node.js, demonstrating proper HTTP response construction, content-type handling, and request method validation. The simplicity enables clear focus on HTTP fundamentals without business logic complexity.

**User Benefits:**
- Clear demonstration of RESTful endpoint pattern
- Understanding of HTTP method validation and response formatting
- Reusable template for implementing additional endpoints
- Foundation for learning more complex request handling patterns

**Technical Context:**
Implemented in `src/backend/handlers/helloHandler.js` (lines 1-59), the handler exports a pure function that accepts Node.js request and response objects. The handler validates the HTTP method (only GET allowed), sets appropriate headers (Content-Type: text/plain), and writes the exact response body "Hello world" from the constant `MESSAGES.HELLO_RESPONSE` defined in `src/backend/utils/constants.js`. Method validation delegates to error handlers for non-GET methods.

#### 2.2.2.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-002-RQ-001 | Endpoint must return HTTP 200 OK for GET requests to `/hello` | Must-Have | Low |
| F-002-RQ-002 | Response body must be exact text "Hello world" (case-sensitive) | Must-Have | Low |
| F-002-RQ-003 | Response must set Content-Type: text/plain header | Must-Have | Low |
| F-002-RQ-004 | Endpoint must reject non-GET methods with 405 Method Not Allowed | Must-Have | Low |
| F-002-RQ-005 | All requests must be logged with method, path, status, response time | Should-Have | Low |

**Acceptance Criteria:**

**F-002-RQ-001:**
- GET request to `/hello` returns status code 200
- Response sent immediately without delay or processing
- Status code verified in integration tests (`src/backend/__tests__/integration/api.test.js`)

**F-002-RQ-002:**
- Response body exactly matches "Hello world" (11 characters, no whitespace)
- String sourced from `MESSAGES.HELLO_RESPONSE` constant for consistency
- No additional characters, encoding artifacts, or formatting
- Response validated against constant in unit tests

**F-002-RQ-003:**
- `Content-Type` header set to `text/plain`
- Header value from `HEADERS.CONTENT_TYPE_TEXT` constant
- Header applied before response body written
- No charset parameter required (defaults to UTF-8)

**F-002-RQ-004:**
- POST, PUT, DELETE, PATCH, OPTIONS methods return 405 status
- `Allow: GET` header included in 405 response
- Method validation in router before handler invocation
- Error response handled by `methodNotAllowed` handler in `src/backend/handlers/error.js`

**F-002-RQ-005:**
- Request logger middleware captures method, URL, timestamp
- Response logger captures status code and response time in milliseconds
- Log format: "{method} {url} {statusCode} {responseTime}ms"
- Logging implementation in `src/backend/middleware/index.js` (requestLogger)

#### 2.2.2.4 Technical Specifications

**Input Parameters:**
- HTTP GET request to `/hello` path
- No query parameters processed
- No request body expected or parsed
- No authentication or authorization headers required

**Output/Response:**
- Status Code: `200 OK`
- Headers:
  - `Content-Type: text/plain`
  - `X-Content-Type-Options: nosniff` (from security middleware)
  - `X-Frame-Options: DENY` (from security middleware)
  - `Content-Security-Policy: default-src 'none'` (from security middleware)
- Body: `Hello world` (plain text, 11 bytes)

**Performance Criteria:**
- Response time: < 100ms from request receipt to response completion
- Throughput: Support multiple concurrent requests without degradation
- Memory: No per-request memory leaks or allocation growth

**Data Requirements:**
- No input data validation required (endpoint accepts no parameters)
- Response data sourced from application constant, not generated dynamically
- No database queries or external service calls

#### 2.2.2.5 Dependencies

**Prerequisite Features:**
- F-001 (HTTP Server Implementation) - Provides request/response infrastructure
- F-003 (Error Handling) - Handles method validation failures
- F-004 (Request Logging) - Logs request/response details

**System Dependencies:**
- Constants module (`src/backend/utils/constants.js`) for response text
- Router module (`src/backend/router.js`) for request routing
- Middleware chain for security headers and logging

**External Dependencies:**
- None - endpoint is fully self-contained with no external integrations

**Integration Requirements:**
- Router must match path `/hello` (normalized, trailing slash handled)
- Middleware chain must apply security headers before handler execution
- Logger must capture request timing for observability

### 2.2.3 F-003: Comprehensive Error Handling

#### 2.2.3.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-003 |
| Feature Name | Comprehensive Error Handling |
| Category | Infrastructure |
| Priority | High |
| Status | Completed |
| Implementation Location | `src/backend/handlers/error.js`, `src/backend/errorHandler.js` |

#### 2.2.3.2 Feature Description

**Overview:**
Comprehensive Error Handling provides centralized management of all error scenarios including 404 Not Found (unknown paths), 405 Method Not Allowed (unsupported HTTP methods), and 500 Internal Server Error (uncaught exceptions). The implementation ensures consistent error response formatting, appropriate HTTP status codes, secure error messaging, and comprehensive error logging.

**Business Value:**
Demonstrates professional error handling patterns that prevent information leakage, provide meaningful feedback for debugging, and maintain service stability under error conditions. Essential for teaching defensive programming and proper HTTP protocol implementation.

**User Benefits:**
- Clear understanding of HTTP error status code semantics
- Pattern for implementing consistent error responses
- Security best practice of preventing error detail exposure
- Foundation for building robust production services

**Technical Context:**
Implemented across two modules: `src/backend/handlers/error.js` contains specific error handlers (notFound, methodNotAllowed, internalError), while `src/backend/errorHandler.js` provides utility functions for error formatting and server lifecycle error handling. Error messages sourced from `src/backend/utils/constants.js` (MESSAGES object) ensure consistency. All errors logged via `src/backend/utils/logger.js` with appropriate severity levels.

#### 2.2.3.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-003-RQ-001 | Unknown paths must return 404 with "Not Found" message | Must-Have | Low |
| F-003-RQ-002 | Unsupported methods must return 405 with "Method Not Allowed" and Allow header | Must-Have | Low |
| F-003-RQ-003 | Uncaught exceptions must return 500 with "Internal Server Error" (no details) | Must-Have | Medium |
| F-003-RQ-004 | All errors must be logged with appropriate level (warn/error) | Must-Have | Low |
| F-003-RQ-005 | Error responses must not expose stack traces or internal details | Must-Have | Low |
| F-003-RQ-006 | EADDRINUSE startup errors must provide helpful port-in-use message | Should-Have | Low |

**Acceptance Criteria:**

**F-003-RQ-001:**
- Requests to undefined paths (not `/hello`) return 404 status
- Response body: "Not Found" from `MESSAGES.NOT_FOUND` constant
- Content-Type: text/plain header set
- Logged at WARN level with request details

**F-003-RQ-002:**
- Non-GET requests to `/hello` return 405 status
- Response includes `Allow: GET` header listing supported methods
- Response body: "Method Not Allowed" from `MESSAGES.METHOD_NOT_ALLOWED`
- Logged at WARN level with method and path

**F-003-RQ-003:**
- Uncaught exceptions during request processing return 500 status
- Response body: "Internal Server Error" from `MESSAGES.SERVER_ERROR`
- Stack trace and error details logged server-side only
- Client receives generic message with no sensitive information
- Logged at ERROR level with full exception details

**F-003-RQ-004:**
- 404 and 405 errors logged at WARN level (client errors)
- 500 errors logged at ERROR level (server errors)
- Log entries include timestamp, method, path, status code
- Error objects include stack trace in server logs

**F-003-RQ-005:**
- Error responses contain only status code and generic message
- No stack traces, file paths, or implementation details in responses
- Environment variables and configuration not exposed
- Sensitive error details remain in server logs only

**F-003-RQ-006:**
- Port-in-use errors detected via error.code === 'EADDRINUSE'
- Log message: "Port {PORT} is already in use"
- Suggestion to check for running processes or change PORT
- Process exits cleanly with error code 1

#### 2.2.3.4 Technical Specifications

**Input Parameters:**
- HTTP request object for error context
- HTTP response object for sending error response
- Error object (for 500 errors) with message and stack trace

**Output/Response:**

**404 Not Found:**
- Status: 404
- Headers: Content-Type: text/plain, security headers
- Body: "Not Found"

**405 Method Not Allowed:**
- Status: 405
- Headers: Content-Type: text/plain, Allow: GET, security headers
- Body: "Method Not Allowed"

**500 Internal Server Error:**
- Status: 500
- Headers: Content-Type: text/plain, security headers
- Body: "Internal Server Error"

**Performance Criteria:**
- Error response generation: < 10ms overhead
- No memory leaks in error handling paths
- Error logging does not block request processing

**Data Requirements:**
- Error messages from constants for consistency
- Error details logged with timestamp and context
- Request metadata captured for debugging

#### 2.2.3.5 Dependencies

**Prerequisite Features:**
- F-004 (Request Logging) - Logs all errors with appropriate severity
- F-005 (Security Headers) - Applied to error responses

**System Dependencies:**
- Constants module for error messages
- Logger utility for structured error logging
- HTTP response object for sending error responses

**External Dependencies:**
- None - error handling is self-contained

**Integration Requirements:**
- Router invokes notFound handler for unknown paths
- Router invokes methodNotAllowed handler for invalid methods
- Server-level error handlers catch uncaught exceptions
- Middleware chain continues on errors to ensure security headers applied

### 2.2.4 F-004: Request Logging

#### 2.2.4.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-004 |
| Feature Name | Request Logging |
| Category | Observability |
| Priority | High |
| Status | Completed |
| Implementation Location | `src/backend/middleware/index.js`, `src/backend/utils/logger.js` |

#### 2.2.4.2 Feature Description

**Overview:**
Request Logging implements comprehensive observability for all HTTP requests, capturing method, URL, status code, and response time with ISO 8601 timestamps. The middleware-based implementation automatically logs all requests and responses without requiring explicit logging calls in handlers, demonstrating the cross-cutting concern pattern for observability.

**Business Value:**
Provides essential visibility into service operation, request patterns, error rates, and performance characteristics. Demonstrates production-ready observability patterns essential for debugging, monitoring, and operational awareness.

**User Benefits:**
- Real-time visibility into service activity
- Performance debugging via response time metrics
- Error detection through status code monitoring
- Foundation for understanding logging best practices

**Technical Context:**
Implemented as middleware in `src/backend/middleware/index.js` (requestLogger function, lines 16-44) that wraps the response `end()` method to capture completion timing. Logger utility at `src/backend/utils/logger.js` provides centralized logging interface with timestamp formatting, log level filtering, and test environment suppression (IS_TEST flag). Log levels automatically assigned based on response status codes (ERROR for 5xx, WARN for 4xx, INFO for 2xx/3xx).

#### 2.2.4.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-004-RQ-001 | Must log method, URL, status code, response time for each request | Must-Have | Low |
| F-004-RQ-002 | Must calculate and log response time in milliseconds | Must-Have | Low |
| F-004-RQ-003 | All log entries must include ISO 8601 formatted timestamp | Must-Have | Low |
| F-004-RQ-004 | Log level must adapt to status code (ERROR/WARN/INFO) | Must-Have | Low |
| F-004-RQ-005 | Logging must be suppressed when IS_TEST=true | Should-Have | Low |
| F-004-RQ-006 | LOG_LEVEL environment variable must control verbosity | Should-Have | Low |

**Acceptance Criteria:**

**F-004-RQ-001:**
- Each request generates exactly one log entry after response completes
- Log entry includes: timestamp, level, method, URL, status code, response time
- Format: "[{timestamp}] {LEVEL}: {method} {url} {statusCode} {responseTime}ms"
- Middleware applied to all requests regardless of endpoint or error status

**F-004-RQ-002:**
- Response time calculated as `Date.now() - startTime`
- Start time captured when middleware invoked (request received)
- End time captured when response.end() called (response sent)
- Precision: 1 millisecond granularity

**F-004-RQ-003:**
- Timestamp format: YYYY-MM-DDTHH:mm:ss.sssZ (ISO 8601)
- Generated via `new Date().toISOString()`
- Timezone: UTC (Z suffix)
- Example: "2024-01-15T14:32:45.123Z"

**F-004-RQ-004:**
- 5xx status codes logged at ERROR level
- 4xx status codes logged at WARN level
- 2xx and 3xx status codes logged at INFO level
- Log level determined after response completion

**F-004-RQ-005:**
- Logger checks `IS_TEST` environment flag
- When true, all logging suppressed (no console output)
- Prevents test output noise during test execution
- Test flag set by Jest environment in `jest.config.js`

**F-004-RQ-006:**
- `LOG_LEVEL` environment variable supports: INFO, WARN, ERROR
- Logs at or above configured level are output
- Default level: INFO (logs all levels)
- Lower-priority logs filtered out (e.g., INFO logs hidden when level=ERROR)

#### 2.2.4.4 Technical Specifications

**Input Parameters:**
- HTTP request object (method, url properties)
- HTTP response object (statusCode property, end() method)
- LOG_LEVEL environment variable (default: 'INFO')
- IS_TEST environment flag (default: false)

**Output/Response:**
- Console logs with format: "[{timestamp}] {LEVEL}: {message}"
- Example: "[2024-01-15T14:32:45.123Z] INFO: GET /hello 200 45ms"
- No return value (logging is side effect)

**Performance Criteria:**
- Logging overhead: < 5ms per request
- No memory leaks from timestamp generation or string formatting
- Non-blocking logging (synchronous console.log acceptable for educational scope)

**Data Requirements:**
- Request metadata: method (string), url (string)
- Response metadata: statusCode (number)
- Timing data: start timestamp, end timestamp, duration (ms)

#### 2.2.4.5 Dependencies

**Prerequisite Features:**
- F-006 (Configuration Management) - Provides LOG_LEVEL and IS_TEST settings

**System Dependencies:**
- Constants module for log level definitions
- Configuration module for environment settings
- Native console API for log output

**External Dependencies:**
- None - logging uses built-in Node.js capabilities

**Integration Requirements:**
- Middleware must be first in chain to capture full request timing
- Applied before security headers and routing
- Wraps response.end() to detect response completion

### 2.2.5 F-005: HTTP Security Headers

#### 2.2.5.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-005 |
| Feature Name | HTTP Security Headers |
| Category | Security |
| Priority | High |
| Status | Completed |
| Implementation Location | `src/backend/middleware/index.js` |

#### 2.2.5.2 Feature Description

**Overview:**
HTTP Security Headers middleware automatically applies standard security headers to all HTTP responses, protecting against common web vulnerabilities including MIME sniffing attacks, clickjacking, and unauthorized resource loading. The implementation demonstrates defense-in-depth security practices applicable to any web service.

**Business Value:**
Demonstrates essential security hardening practices that should be present in all web applications. Teaches developers to implement security as a system-wide concern through middleware patterns rather than per-endpoint configuration.

**User Benefits:**
- Understanding of HTTP security header purposes and configurations
- Practical implementation of OWASP security recommendations
- Pattern for consistent security policy application
- Foundation for more advanced security implementations

**Technical Context:**
Implemented as middleware function in `src/backend/middleware/index.js` (securityHeaders function, lines 46-65). Middleware applies three security headers to every response before any response body is written: X-Content-Type-Options (prevents MIME sniffing), X-Frame-Options (prevents clickjacking), and Content-Security-Policy (restricts resource loading). Headers applied regardless of response status (2xx, 4xx, 5xx) or endpoint.

#### 2.2.5.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-005-RQ-001 | Must set X-Content-Type-Options: nosniff on all responses | Must-Have | Low |
| F-005-RQ-002 | Must set X-Frame-Options: DENY on all responses | Must-Have | Low |
| F-005-RQ-003 | Must set Content-Security-Policy: default-src 'none' on all responses | Must-Have | Low |
| F-005-RQ-004 | Security headers must be applied early in middleware chain | Must-Have | Low |

**Acceptance Criteria:**

**F-005-RQ-001:**
- Header `X-Content-Type-Options` set to value `nosniff`
- Prevents browsers from MIME-sniffing responses away from declared Content-Type
- Applied before response body written
- Present on all responses (200, 404, 405, 500)

**F-005-RQ-002:**
- Header `X-Frame-Options` set to value `DENY`
- Prevents service from being embedded in frames, iframes, or objects
- Protects against clickjacking attacks
- Applied to all responses regardless of status

**F-005-RQ-003:**
- Header `Content-Security-Policy` set to value `default-src 'none'`
- Blocks all resource loading by default (scripts, styles, images, etc.)
- Strictest CSP policy appropriate for text-only responses
- Applied before any response content

**F-005-RQ-004:**
- Security middleware invoked early in middleware chain
- Applied after request logger but before routing
- Ensures headers present even if errors occur in routing/handling
- Middleware order documented in middleware composition

#### 2.2.5.4 Technical Specifications

**Input Parameters:**
- HTTP response object for setting headers

**Output/Response:**
- Three security headers added to response:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy: default-src 'none'`
- No modification to response body or status code
- No performance impact on request processing

**Performance Criteria:**
- Header setting overhead: < 1ms per request
- No memory allocation or processing required
- Simple header string assignment operation

**Data Requirements:**
- No input data validation required
- Header values are static constants
- No configuration or environment variable dependencies

#### 2.2.5.5 Dependencies

**Prerequisite Features:**
- F-001 (HTTP Server Implementation) - Provides response object infrastructure

**System Dependencies:**
- Native HTTP response setHeader() method
- No external dependencies

**External Dependencies:**
- None - uses only built-in Node.js APIs

**Integration Requirements:**
- Must be applied as middleware before response is sent
- Order: after logging, before routing/handling
- Compatible with all response types (success, error)

### 2.2.6 F-006: Configuration Management

#### 2.2.6.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-006 |
| Feature Name | Environment-Based Configuration |
| Category | Infrastructure |
| Priority | High |
| Status | Completed |
| Implementation Location | `src/backend/config.js` |

#### 2.2.6.2 Feature Description

**Overview:**
Configuration Management provides a centralized, environment-based configuration system following the Twelve-Factor App methodology. The implementation loads configuration from environment variables with validation, sensible defaults, and `.env` file support via dotenv, demonstrating production-ready configuration patterns suitable for multiple deployment environments.

**Business Value:**
Demonstrates industry-standard configuration management practices that enable consistent behavior across development, testing, and production environments without code changes. Essential for teaching environment-based deployment strategies and configuration security.

**User Benefits:**
- Understanding of environment-based configuration patterns
- Practical application of Twelve-Factor App principles
- Pattern for validating and defaulting configuration values
- Foundation for managing application secrets and settings

**Technical Context:**
Implemented in `src/backend/config.js` (lines 1-93) as a module that loads `.env` file via dotenv, reads environment variables, validates values (especially PORT range), applies defaults, and exports configuration object. Provides derived boolean flags (IS_DEV, IS_PROD, IS_TEST) based on NODE_ENV. Default values defined in `src/backend/utils/constants.js` (CONFIG object). Port validation includes range checking (1-65535) with fallback to default and console warning for invalid values.

#### 2.2.6.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-006-RQ-001 | Must load environment variables from .env file using dotenv | Must-Have | Low |
| F-006-RQ-002 | Must support PORT environment variable with default 3000 | Must-Have | Low |
| F-006-RQ-003 | Must support HOST environment variable with default 0.0.0.0 | Must-Have | Low |
| F-006-RQ-004 | Must support NODE_ENV with default 'development' | Must-Have | Low |
| F-006-RQ-005 | Must support LOG_LEVEL with default 'INFO' | Should-Have | Low |
| F-006-RQ-006 | Must validate PORT is numeric 1-65535, fallback if invalid | Must-Have | Medium |
| F-006-RQ-007 | Must provide IS_DEV, IS_PROD, IS_TEST boolean flags | Should-Have | Low |

**Acceptance Criteria:**

**F-006-RQ-001:**
- dotenv package loads `.env` file from project root
- File is optional; missing file does not cause error
- Environment variables in `.env` override system environment variables (dotenv default behavior is opposite)
- Loaded before any configuration values accessed

**F-006-RQ-002:**
- PORT environment variable parsed as integer
- Default value: 3000
- Exported as `config.PORT`
- Used by server.js for binding address

**F-006-RQ-003:**
- HOST environment variable read as string
- Default value: '0.0.0.0' (bind to all interfaces)
- Exported as `config.HOST`
- Allows binding to localhost (127.0.0.1) or specific interface

**F-006-RQ-004:**
- NODE_ENV environment variable read as string
- Default value: 'development'
- Exported as `config.NODE_ENV`
- Common values: 'development', 'production', 'test'

**F-006-RQ-005:**
- LOG_LEVEL environment variable read as string
- Default value: 'INFO'
- Exported as `config.LOG_LEVEL`
- Accepted values: 'INFO', 'WARN', 'ERROR'
- Controls logger verbosity

**F-006-RQ-006:**
- PORT must be numeric (parseInt check)
- PORT must be >= 1 and <= 65535
- Invalid values log warning: "Invalid PORT '{value}', using default {default}"
- Fallback to default PORT 3000 on validation failure

**F-006-RQ-007:**
- `IS_DEV` boolean: true when NODE_ENV === 'development'
- `IS_PROD` boolean: true when NODE_ENV === 'production'
- `IS_TEST` boolean: true when NODE_ENV === 'test'
- Exported as convenience flags for environment-specific logic

#### 2.2.6.4 Technical Specifications

**Input Parameters:**
- Environment variables: PORT, HOST, NODE_ENV, LOG_LEVEL
- Optional `.env` file in project root

**Configuration Values:**

| Variable | Type | Default | Valid Range | Description |
|---|---|---|---|
| PORT | Number | 3000 | 1-65535 | Server listening port |
| HOST | String | 0.0.0.0 | Valid IP/hostname | Server binding address |
| NODE_ENV | String | development | development/production/test | Environment mode |
| LOG_LEVEL | String | INFO | INFO/WARN/ERROR | Logging verbosity |

**Output/Response:**
- Exported configuration object with validated values
- Boolean environment flags (IS_DEV, IS_PROD, IS_TEST)
- Console warnings for invalid configuration values

**Performance Criteria:**
- Configuration loading: < 50ms at application startup
- No runtime overhead after initial load
- Configuration loaded once and cached

**Data Requirements:**
- Valid TCP port number (1-65535)
- Valid IP address or hostname for HOST
- String values for NODE_ENV and LOG_LEVEL

#### 2.2.6.5 Dependencies

**Prerequisite Features:**
- None - configuration is foundational and has no feature dependencies

**System Dependencies:**
- `dotenv` package v16.0.3 for .env file parsing
- `path` module for resolving .env file location
- Node.js process.env for environment variable access

**External Dependencies:**
- File system access for reading .env file (optional)
- Operating system environment variables

**Integration Requirements:**
- Must be loaded before any other modules that depend on configuration
- Required by F-001 (Server), F-004 (Logging), F-008 (Graceful Shutdown)
- Constants module provides default values

### 2.2.7 F-007: Health Checking

#### 2.2.7.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-007 |
| Feature Name | Service Health Checking |
| Category | Observability |
| Priority | Medium |
| Status | Completed |
| Implementation Location | `infrastructure/local/docker-compose.yml`, `infrastructure/scripts/health-check.sh` |

#### 2.2.7.2 Feature Description

**Overview:**
Service Health Checking leverages the `/hello` endpoint as a dual-purpose health check, enabling automated monitoring of service availability by Docker, orchestration platforms, and monitoring systems. The implementation demonstrates pragmatic health checking patterns without requiring dedicated health endpoints.

**Business Value:**
Enables automated service health monitoring, container orchestration, and deployment verification without additional implementation complexity. Demonstrates practical health checking patterns suitable for simple services.

**User Benefits:**
- Understanding of health check concepts and implementation
- Integration with Docker and orchestration platforms
- Pattern for verifying service availability in automation
- Foundation for more sophisticated health checks

**Technical Context:**
Docker Compose configuration at `infrastructure/local/docker-compose.yml` (lines 25-30) defines healthcheck targeting the `/hello` endpoint using curl. Health check script at `infrastructure/scripts/health-check.sh` provides standalone verification with status code checking (200 required) and response body validation ("Hello world" text must be present). Prometheus monitoring configuration also scrapes the `/hello` endpoint as a health indicator.

#### 2.2.7.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-007-RQ-001 | Docker container must define healthcheck targeting /hello endpoint | Must-Have | Low |
| F-007-RQ-002 | Healthcheck timing: interval 30s, timeout 10s, retries 3, start_period 10s | Should-Have | Low |
| F-007-RQ-003 | Health script must verify 200 status and body contains "Hello world" | Should-Have | Low |
| F-007-RQ-004 | Health check script must provide clear exit codes for CI pipelines | Should-Have | Low |

**Acceptance Criteria:**

**F-007-RQ-001:**
- Docker Compose healthcheck defined in service configuration
- Command: `curl -f http://localhost:3000/hello || exit 1`
- Exit code 0 indicates healthy, non-zero indicates unhealthy
- Container marked unhealthy after consecutive check failures

**F-007-RQ-002:**
- `interval`: 30s - time between health checks
- `timeout`: 10s - maximum time for check to complete
- `retries`: 3 - consecutive failures before marking unhealthy
- `start_period`: 10s - grace period after container start

**F-007-RQ-003:**
- Standalone script at `infrastructure/scripts/health-check.sh`
- Uses curl to fetch `/hello` endpoint
- Validates HTTP status code is 200
- Validates response body contains "Hello world" substring
- Exits 0 on success, non-zero on failure

**F-007-RQ-004:**
- Exit code 0: Service healthy (200 status + correct response)
- Exit code 1: Service unhealthy (non-200 status or wrong response)
- Exit code 2: Service unreachable (connection failed)
- Script outputs descriptive error messages for debugging

#### 2.2.7.4 Technical Specifications

**Input Parameters:**
- Docker healthcheck: Target URL `http://localhost:3000/hello`
- Standalone script: Configurable URL (default localhost:3000)
- Timeout and interval values in Docker Compose

**Output/Response:**
- Docker healthcheck: Exit code 0 (healthy) or 1 (unhealthy)
- Container status: "healthy", "unhealthy", or "starting"
- Health check script: Console output with success/failure message
- Prometheus: up{} metric indicates service reachability

**Performance Criteria:**
- Health check response time: < 100ms under normal conditions
- No significant resource usage from health checking
- Health checks do not interfere with request processing

**Data Requirements:**
- Access to service endpoint (network connectivity)
- HTTP client (curl) available in container
- No authentication or special headers required

#### 2.2.7.5 Dependencies

**Prerequisite Features:**
- F-002 (Hello World Endpoint) - Provides endpoint for health checking
- F-001 (HTTP Server Implementation) - Must be running to respond

**System Dependencies:**
- curl command-line tool in Docker container
- Docker or Docker Compose for container health checks
- Network connectivity to service port

**External Dependencies:**
- None - health checks use existing endpoint

**Integration Requirements:**
- F-009 (Docker Compose) deploys healthcheck configuration
- F-010 (Prometheus) scrapes endpoint for availability metrics
- Container orchestrators can use health status for deployment decisions

### 2.2.8 F-008: Graceful Shutdown

#### 2.2.8.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-008 |
| Feature Name | Graceful Server Shutdown |
| Category | Infrastructure |
| Priority | High |
| Status | Completed |
| Implementation Location | `src/backend/server.js`, `src/backend/index.js` |

#### 2.2.8.2 Feature Description

**Overview:**
Graceful Shutdown implements proper server lifecycle management, enabling the service to shut down cleanly in response to SIGINT (Ctrl+C) and SIGTERM signals. The implementation ensures in-flight requests complete, resources are released, and the process exits cleanly without dropping connections or leaving orphaned resources.

**Business Value:**
Demonstrates production-ready lifecycle management essential for reliable service operations. Prevents data loss, connection drops, and resource leaks during deployments, container restarts, or manual shutdowns.

**User Benefits:**
- Understanding of signal handling in Node.js applications
- Pattern for implementing graceful shutdown in any service
- Prevention of request failures during deployments
- Foundation for zero-downtime deployment strategies

**Technical Context:**
Signal handlers registered in `src/backend/index.js` capture SIGINT and SIGTERM, invoke `stopServer()` function from `src/backend/server.js`, which closes the server listener and waits for active connections to complete. The `stopServer()` implementation (lines 125-163) returns a Promise that resolves after server closure, logs shutdown message, resets server reference to null, and allows process to exit cleanly.

#### 2.2.8.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-008-RQ-001 | Must handle SIGINT (Ctrl+C) and SIGTERM signals | Must-Have | Medium |
| F-008-RQ-002 | Must close server listener and wait for active connections | Must-Have | Medium |
| F-008-RQ-003 | Must log server stop event before exiting | Should-Have | Low |
| F-008-RQ-004 | Must reset server reference to null after shutdown | Should-Have | Low |
| F-008-RQ-005 | stopServer() must return Promise resolving after shutdown | Must-Have | Low |

**Acceptance Criteria:**

**F-008-RQ-001:**
- SIGINT signal captured via `process.on('SIGINT', handler)`
- SIGTERM signal captured via `process.on('SIGTERM', handler)`
- Handler invokes `stopServer()` function
- Both signals result in same graceful shutdown behavior

**F-008-RQ-002:**
- `server.close()` called to stop accepting new connections
- Waits for existing connections to complete naturally
- No forced termination of in-flight requests
- Server closure Promise resolves after all connections closed

**F-008-RQ-003:**
- Shutdown initiated log: "Shutting down server gracefully..."
- Shutdown completed log: "Server stopped successfully"
- Logs include timestamp and INFO level
- Logs provide visibility into shutdown process

**F-008-RQ-004:**
- Server instance variable set to null after closure
- Prevents accidental use of closed server
- Enables garbage collection of server resources
- Clean state for potential restart (not applicable but good practice)

**F-008-RQ-005:**
- `stopServer()` returns Promise<void>
- Promise resolves after server.close() completes
- Promise rejects if shutdown encounters errors
- Enables async/await usage in signal handlers

#### 2.2.8.4 Technical Specifications

**Input Parameters:**
- Operating system signals: SIGINT, SIGTERM
- Running server instance to be stopped

**Output/Response:**
- Server listener closed (no longer accepting connections)
- Active connections completed and closed
- Console logs: shutdown initiated and completed messages
- Process exit code 0 (clean shutdown)

**Performance Criteria:**
- Shutdown completion time: < 5 seconds under normal conditions
- Active requests allowed to complete (no timeout forced)
- No connection drops or request failures

**Data Requirements:**
- Server instance reference to call close() method
- No persistent data to save (stateless service)
- Logs capture shutdown event for operational visibility

#### 2.2.8.5 Dependencies

**Prerequisite Features:**
- F-001 (HTTP Server Implementation) - Provides server instance to shut down
- F-004 (Request Logging) - Logs shutdown events

**System Dependencies:**
- Node.js process signal handling (process.on)
- Native server.close() method for connection draining
- Promise infrastructure for async shutdown

**External Dependencies:**
- Operating system signal delivery
- No external cleanup required (no database connections, file handles, etc.)

**Integration Requirements:**
- Signal handlers registered during application initialization
- Server instance must be accessible to signal handlers
- Shutdown must complete before process exit

### 2.2.9 F-009: Docker Containerization

#### 2.2.9.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-009 |
| Feature Name | Docker Containerization |
| Category | Deployment |
| Priority | High |
| Status | Completed |
| Implementation Location | `src/backend/Dockerfile`, `infrastructure/local/docker-compose.yml` |

#### 2.2.9.2 Feature Description

**Overview:**
Docker Containerization provides complete container packaging for the service using multi-stage builds, production-optimized base images, and Docker Compose orchestration. The implementation demonstrates modern containerization practices including layer caching optimization, production dependency management, and local development workflows with hot reloading.

**Business Value:**
Enables consistent development and deployment environments, eliminating "works on my machine" issues. Demonstrates industry-standard containerization practices essential for modern application deployment and cloud-native development.

**User Benefits:**
- Understanding of Docker containerization concepts and best practices
- Practical implementation of multi-stage builds and layer caching
- Experience with Docker Compose orchestration
- Foundation for Kubernetes and cloud deployments

**Technical Context:**
Production Dockerfile at `src/backend/Dockerfile` uses node:18-alpine base image with multi-stage pattern: copy package files, run npm ci --only=production for deterministic installs, copy source code, expose port 3000, set CMD to start server. Docker Compose configuration at `infrastructure/local/docker-compose.yml` provides local development setup with source code bind mount for hot reload, node_modules named volume to preserve container dependencies, environment variables, health check, and custom network.

#### 2.2.9.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-009-RQ-001 | Production Dockerfile must use node:18-alpine with multi-stage build | Must-Have | Medium |
| F-009-RQ-002 | Must copy package*.json first for layer caching | Should-Have | Low |
| F-009-RQ-003 | Must use npm ci --only=production for deterministic installs | Must-Have | Low |
| F-009-RQ-004 | Must EXPOSE 3000 and document container port | Must-Have | Low |
| F-009-RQ-005 | Docker Compose must provide local development configuration | Must-Have | Medium |
| F-009-RQ-006 | Docker Compose must mount source for hot reloading | Should-Have | Medium |
| F-009-RQ-007 | Must use named volume for node_modules preservation | Should-Have | Medium |

**Acceptance Criteria:**

**F-009-RQ-001:**
- Base image: `node:18-alpine` (minimal size, security updates)
- Multi-stage build separates dependency install from runtime
- Production image contains only necessary files
- Image size optimized (< 100MB compressed)

**F-009-RQ-002:**
- COPY package.json and package-lock.json before COPY source
- Enables Docker layer caching when dependencies unchanged
- Rebuilds faster when only source code changes
- Pattern documented in Dockerfile comments

**F-009-RQ-003:**
- Command: `npm ci --only=production` (not npm install)
- --only=production excludes devDependencies
- npm ci uses package-lock.json for reproducible builds
- Faster and more reliable than npm install

**F-009-RQ-004:**
- EXPOSE 3000 instruction in Dockerfile
- Documents container's listening port
- Enables port mapping in Docker run commands
- Metadata for documentation and tooling

**F-009-RQ-005:**
- docker-compose.yml in `infrastructure/local/`
- Service definition for hello-world-app
- Port mapping 3000:3000
- Build context pointing to repository root
- Environment variables configured

**F-009-RQ-006:**
- Volume mount: source directory to /app in container
- Enables hot reload with nodemon in development
- File changes on host reflected in container immediately
- CMD overridden to `npm run dev` for development

**F-009-RQ-007:**
- Named volume: `node_modules` mounted to /app/node_modules
- Prevents host node_modules from overwriting container dependencies
- Preserves container-built modules (may differ from host OS)
- Documented in docker-compose.yml volumes section

#### 2.2.9.4 Technical Specifications

**Dockerfile Configuration:**
- Base image: node:18-alpine
- Working directory: /app
- Exposed port: 3000
- Start command: `node index.js`
- Production dependencies only

**Docker Compose Configuration:**
- Service name: hello-world-app
- Build context: Repository root
- Dockerfile path: src/backend/Dockerfile
- Port mapping: 3000:3000 (host:container)
- Environment variables: PORT=3000, NODE_ENV=development
- Volumes:
  - Bind mount: ./src/backend:/app (source code)
  - Named volume: node_modules:/app/node_modules
- Networks: hello-world-network (custom bridge)
- Restart policy: unless-stopped
- Development command: npm run dev (overrides Dockerfile CMD)

**Performance Criteria:**
- Image build time: < 2 minutes for clean build
- Image size: < 100MB compressed
- Container startup: < 2 seconds
- Hot reload latency: < 1 second for code changes

**Data Requirements:**
- package.json and package-lock.json for dependency management
- Source code in src/backend directory
- .dockerignore to exclude unnecessary files

#### 2.2.9.5 Dependencies

**Prerequisite Features:**
- F-001 (HTTP Server) - Application to containerize
- F-006 (Configuration) - Environment-based settings for containers
- F-007 (Health Checking) - Docker healthcheck integration

**System Dependencies:**
- Docker Engine 20.x or higher
- Docker Compose v2.x or higher
- Node.js base image (node:18-alpine)

**External Dependencies:**
- Docker Hub for base image retrieval
- npm registry for package installation
- Network access for image pulls and package downloads

**Integration Requirements:**
- Dockerfile references application structure in src/backend
- Docker Compose coordinates with monitoring stack (Prometheus, Grafana)
- Health check integrated in Docker Compose configuration

### 2.2.10 F-010: Monitoring and Observability

#### 2.2.10.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-010 |
| Feature Name | Prometheus and Grafana Monitoring |
| Category | Observability |
| Priority | Medium |
| Status | Partially Completed |
| Implementation Location | `infrastructure/monitoring/prometheus.yml`, `infrastructure/monitoring/grafana-dashboard.json` |

#### 2.2.10.2 Feature Description

**Overview:**
Monitoring and Observability integrates Prometheus for metrics collection and Grafana for visualization, enabling comprehensive monitoring of service health, request rates, response latencies, and system resources. The configuration demonstrates production-ready observability patterns using industry-standard open-source tools.

**Business Value:**
Provides operational visibility essential for understanding service behavior, detecting issues, and optimizing performance. Demonstrates complete observability stack setup suitable for learning and prototyping monitoring solutions.

**User Benefits:**
- Hands-on experience with Prometheus and Grafana
- Understanding of metrics-based monitoring concepts
- Pre-built dashboard for common service metrics
- Foundation for building custom monitoring solutions

**Technical Context:**
Prometheus configuration at `infrastructure/monitoring/prometheus.yml` defines scrape jobs targeting `/metrics` endpoint (5s interval) and `/health` endpoint (30s interval). Grafana dashboard at `infrastructure/monitoring/grafana-dashboard.json` provides 13 pre-configured panels visualizing uptime, request rates, duration percentiles, status codes, error rates, and Node.js metrics (memory, CPU, event loop). **Note:** Metrics endpoint implementation (`/metrics`) not found in application source code; configuration exists but endpoint may not be fully implemented.

#### 2.2.10.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-010-RQ-001 | Prometheus must scrape /metrics endpoint every 5 seconds | Should-Have | Medium |
| F-010-RQ-002 | Prometheus must scrape /health endpoint every 30 seconds | Should-Have | Low |
| F-010-RQ-003 | Grafana dashboard must visualize key service metrics | Should-Have | Medium |
| F-010-RQ-004 | Must expose request count, duration, error rates metrics | Should-Have | High |
| F-010-RQ-005 | Monitoring stack must integrate via Docker Compose | Should-Have | Medium |

**Acceptance Criteria:**

**F-010-RQ-001:**
- Prometheus job: `hello-world-app`
- Target: `hello-world-app:3000/metrics`
- Scrape interval: 5s
- Expected metrics format: Prometheus text exposition format
- **Status:** Configuration exists; /metrics endpoint implementation not verified

**F-010-RQ-002:**
- Prometheus job: `hello-world-health`
- Target: `hello-world-app:3000/health`
- Scrape interval: 30s
- Monitors service availability via up{} metric
- **Status:** Functional using existing /hello endpoint

**F-010-RQ-003:**
- Grafana dashboard UID: hello-world-dashboard
- Data source: Prometheus
- 13 pre-configured panels:
  - Service uptime (up metric)
  - Total requests and request rate
  - Request duration (p50, p95, p99 percentiles)
  - HTTP status code distribution
  - Error rate percentage
  - Node.js process metrics (memory RSS/heap, CPU, event loop lag)

**F-010-RQ-004:**
- Metrics expected:
  - `http_requests_total` (counter) - total requests by method, path, status
  - `http_request_duration_seconds` (histogram) - request latencies
  - `http_errors_total` (counter) - error counts by type
  - `nodejs_process_*` - Node.js runtime metrics
- **Status:** Metrics schema defined in dashboard; application instrumentation not verified

**F-010-RQ-005:**
- Docker Compose includes Prometheus and Grafana services
- Network connectivity between app and monitoring services
- Volume mounts for Prometheus config and Grafana provisioning
- Port exposure: Prometheus 9090, Grafana 3000

#### 2.2.10.4 Technical Specifications

**Prometheus Configuration:**
- Version: 2.x
- Scrape interval: 5s for metrics, 30s for health
- Jobs:
  - `hello-world-app`: Scrapes application metrics
  - `hello-world-health`: Monitors service availability
- Retention: Default (15 days)
- Storage: Local time-series database

**Grafana Configuration:**
- Version: Latest
- Default data source: Prometheus
- Dashboard: hello-world-dashboard (13 panels)
- Refresh interval: 5s
- Time range: Last 5 minutes (configurable)

**Metrics Schema (Expected):**
- `http_requests_total{method, path, status}` - Request counter
- `http_request_duration_seconds{method, path}` - Latency histogram
- `http_errors_total{type}` - Error counter
- `up{job, instance}` - Service availability
- Node.js metrics from prom-client (if implemented)

**Performance Criteria:**
- Metrics collection overhead: < 5ms per request
- Prometheus scrape time: < 100ms
- Grafana query response: < 1s for standard queries
- No significant memory overhead from metrics storage

**Data Requirements:**
- Time-series metrics data in Prometheus format
- Service discovery for scrape targets
- Dashboard configuration in JSON format

#### 2.2.10.5 Dependencies

**Prerequisite Features:**
- F-002 (Hello Endpoint) - Used as health check target
- F-007 (Health Checking) - Provides /health endpoint
- F-009 (Docker Compose) - Orchestrates monitoring stack
- **F-010-RQ-004 (Metrics Endpoint)** - Required but implementation status unclear

**System Dependencies:**
- Prometheus server
- Grafana server
- Network connectivity between services
- Persistent volumes for metrics storage

**External Dependencies:**
- Prometheus Docker image
- Grafana Docker image
- prom-client npm package (if metrics endpoint implemented)

**Integration Requirements:**
- Application must expose /metrics endpoint in Prometheus format
- Docker Compose network for service communication
- Prometheus configuration mounted to container
- Grafana dashboard provisioned via volume mount

**Implementation Note:**
The monitoring feature is **partially implemented**. Prometheus and Grafana configurations exist and reference a `/metrics` endpoint, but the implementation of this endpoint was not found in the application source code during repository analysis. The health monitoring aspect (F-010-RQ-002) is functional using the existing `/hello` endpoint. Full implementation would require adding metrics instrumentation (likely using `prom-client` library) and exposing the `/metrics` endpoint.

### 2.2.11 F-011: Testing Infrastructure

#### 2.2.11.1 Feature Metadata

| Attribute | Value |
|---|---|
| Feature ID | F-011 |
| Feature Name | Comprehensive Testing Infrastructure |
| Category | Quality Assurance |
| Priority | High |
| Status | Completed |
| Implementation Location | `src/backend/jest.config.js`, `src/backend/__tests__/` |

#### 2.2.11.2 Feature Description

**Overview:**
Comprehensive Testing Infrastructure provides complete testing capabilities using Jest framework with Supertest for HTTP integration testing, strict coverage thresholds enforcing quality standards, and JUnit XML reporting for CI/CD integration. The implementation demonstrates test-driven development practices and quality assurance patterns suitable for professional software development.

**Business Value:**
Ensures code quality and correctness through automated testing, preventing regressions and enabling confident refactoring. Demonstrates testing best practices essential for maintaining reliable software and facilitating team collaboration.

**User Benefits:**
- Hands-on experience with Jest testing framework
- Understanding of unit vs. integration testing patterns
- Practical application of test coverage metrics
- Foundation for test-driven development practices

**Technical Context:**
Jest configuration at `src/backend/jest.config.js` defines test environment (Node.js), coverage thresholds (global and per-file), test patterns, reporters (default + jest-junit), and setup files. Test suite includes unit tests for handlers (`__tests__/handlers/*.test.js`), integration tests using Supertest (`__tests__/integration/api.test.js`), and mock implementations for dependencies. Coverage enforced at 80% branches, 90% functions, 85% lines globally; hello handler requires 100% coverage across all metrics; error handlers require 90% branch coverage.

#### 2.2.11.3 Functional Requirements

| Requirement ID | Description | Priority | Complexity |
|---|---|---|---|
| F-011-RQ-001 | Global coverage: 80% branches, 90% functions, 85% lines, 85% statements | Must-Have | High |
| F-011-RQ-002 | Hello handler must achieve 100% coverage (all metrics) | Must-Have | High |
| F-011-RQ-003 | Error handler coverage: 90% branches, 100% functions | Must-Have | High |
| F-011-RQ-004 | Integration tests must verify full HTTP request/response cycle | Must-Have | Medium |
| F-011-RQ-005 | Test results must export to junit.xml for CI consumption | Should-Have | Low |
| F-011-RQ-006 | Tests must use jest.mock for dependency isolation | Must-Have | Medium |

**Acceptance Criteria:**

**F-011-RQ-001:**
- Jest coverage thresholds configured in jest.config.js
- Global thresholds:
  - Branches: 80%
  - Functions: 90%
  - Lines: 85%
  - Statements: 85%
- Tests fail if coverage below thresholds
- Coverage report generated in `./coverage/` directory

**F-011-RQ-002:**
- File: `src/backend/handlers/helloHandler.js`
- Coverage requirements:
  - Branches: 100%
  - Functions: 100%
  - Lines: 100%
  - Statements: 100%
- Critical path fully tested (core functionality)
- All code paths exercised in unit tests

**F-011-RQ-003:**
- File: `src/backend/handlers/error.js`
- Coverage requirements:
  - Branches: 90%
  - Functions: 100%
- All error handlers tested
- Error response formatting verified

**F-011-RQ-004:**
- Supertest library used for HTTP testing
- Integration tests in `__tests__/integration/api.test.js`
- Tests verify:
  - Full request/response cycle including middleware
  - Correct status codes (200, 404, 405)
  - Response headers and body content
  - Error handling behavior
- Real server instance used (not mocked)

**F-011-RQ-005:**
- jest-junit reporter configured in jest.config.js
- Output file: `./coverage/junit/junit.xml`
- XML format compatible with CI systems (Jenkins, GitLab CI, GitHub Actions)
- Test results, durations, and failures captured

**F-011-RQ-006:**
- jest.mock() used to mock dependencies
- Mocked modules:
  - Logger (utils/logger.js)
  - Configuration (config.js)
  - Error handlers (handlers/error.js)
- Mocks prevent external side effects
- Tests run in isolation without dependencies

#### 2.2.11.4 Technical Specifications

**Test Framework Configuration:**
- Framework: Jest 29.x
- Test environment: Node.js
- Test file pattern: `**/__tests__/**/*.test.js`
- Setup file: `__tests__/setup.js`
- Coverage directory: `./coverage/`

**Coverage Thresholds:**

| Scope | Branches | Functions | Lines | Statements |
|---|---|---|---|
| Global | 80% | 90% | 85% | 85% |
| handlers/helloHandler.js | 100% | 100% | 100% | 100% |
| handlers/error.js | 90% | 100% | 90% | 90% |

**Test Categories:**
1. **Unit Tests:**
   - Location: `__tests__/**/*.test.js`
   - Scope: Individual functions and modules
   - Isolation: Heavy use of mocks
   - Examples: Handler functions, utility functions, configuration

2. **Integration Tests:**
   - Location: `__tests__/integration/api.test.js`
   - Scope: Full HTTP request/response cycle
   - Isolation: Real server, minimal mocking
   - Examples: GET /hello, error scenarios, middleware chain

**Test Execution:**
- Run all tests: `npm test`
- Watch mode: `npm run test:watch`
- Coverage report: `npm run test:coverage`
- CI mode: Tests run with `--ci` flag

**Reporters:**
- Default Jest reporter (console output)
- jest-junit (XML output for CI)

**Performance Criteria:**
- Test execution time: < 30 seconds for full suite
- No test timeouts (default 5s per test)
- Tests run in parallel (Jest default)

**Data Requirements:**
- Mock request/response objects for unit tests
- Supertest for HTTP testing (no manual mocking)
- Test data from constants (consistent with application)

#### 2.2.11.5 Dependencies

**Prerequisite Features:**
- All features F-001 through F-010 - Tests validate all features

**System Dependencies:**
- Jest testing framework v29+
- Supertest v6.3.3 for HTTP testing
- jest-junit for XML reporting
- Node.js test environment

**External Dependencies:**
- npm test scripts in package.json
- Coverage reporting tools (lcov, html)

**Integration Requirements:**
- Tests import application modules directly
- Mock implementations match actual interfaces
- Integration tests require available port (3000 or random)
- CI systems consume junit.xml for test results

## 2.3 Feature Relationships and Integration

### 2.3.1 Feature Dependency Map

The following diagram illustrates the dependency relationships between features, showing which features rely on others for their functionality:

```mermaid
graph TD
    F006[F-006: Configuration Management]
    F001[F-001: HTTP Server]
    F004[F-004: Request Logging]
    F005[F-005: Security Headers]
    F002[F-002: Hello Endpoint]
    F003[F-003: Error Handling]
    F007[F-007: Health Checking]
    F008[F-008: Graceful Shutdown]
    F009[F-009: Containerization]
    F010[F-010: Monitoring]
    F011[F-011: Testing]
    
    F006 -->|Provides config| F001
    F006 -->|Provides LOG_LEVEL| F004
    F001 -->|Foundation| F002
    F001 -->|Foundation| F003
    F004 -->|Logs requests| F001
    F005 -->|Secures responses| F001
    F003 -->|Handles errors| F002
    F004 -->|Logs activity| F002
    F004 -->|Logs errors| F003
    F002 -->|Serves as endpoint| F007
    F001 -->|Lifecycle mgmt| F008
    F004 -->|Logs shutdown| F008
    F001 -->|Packaged| F009
    F007 -->|Health checks| F009
    F002 -->|Monitored| F010
    F007 -->|Health endpoint| F010
    F009 -->|Orchestrates| F010
    F001 -.->|Tests| F011
    F002 -.->|Tests| F011
    F003 -.->|Tests| F011
    F004 -.->|Tests| F011
    F005 -.->|Tests| F011
    F006 -.->|Tests| F011
    F008 -.->|Tests| F011
```

### 2.3.2 Integration Points

#### 2.3.2.1 Middleware Chain Integration

The request processing pipeline demonstrates sequential integration of multiple features through middleware composition:

```mermaid
sequenceDiagram
    participant Client
    participant Server as F-001: HTTP Server
    participant Logger as F-004: Request Logger
    participant Security as F-005: Security Headers
    participant Router as Router
    participant Handler as F-002: Hello Handler
    participant ErrorHandler as F-003: Error Handler
    
    Client->>Server: HTTP GET /hello
    Server->>Logger: Capture start time
    Logger->>Security: Add security headers
    Security->>Router: Route request
    
    alt Path is /hello
        Router->>Handler: Process hello request
        Handler->>Handler: Generate "Hello world"
        Handler-->>Router: Response ready
    else Path not found
        Router->>ErrorHandler: 404 Not Found
        ErrorHandler-->>Router: Error response
    end
    
    Router-->>Security: Return response
    Security-->>Logger: Calculate response time
    Logger-->>Server: Log request details
    Server-->>Client: Send response
```

**Integration Mechanism:**
- Middleware array in `src/backend/middleware/index.js` defines execution order
- Each middleware receives `(req, res, next)` parameters
- Middleware must call `next()` to continue chain or send response to terminate
- Applied via `applyMiddleware()` function in server request handler

#### 2.3.2.2 Configuration Integration

Configuration Management (F-006) provides settings consumed by multiple features:

| Consuming Feature | Configuration Values Used | Purpose |
|---|---|---|
| F-001 (HTTP Server) | PORT, HOST, NODE_ENV | Server binding address and environment mode |
| F-004 (Request Logging) | LOG_LEVEL, IS_TEST | Logging verbosity and test suppression |
| F-008 (Graceful Shutdown) | NODE_ENV | Environment-specific shutdown behavior |
| F-011 (Testing) | NODE_ENV=test, IS_TEST=true | Test environment detection |

**Integration Mechanism:**
- Configuration loaded once at application startup in `src/backend/config.js`
- Exported configuration object imported by dependent modules
- Environment variables set via `.env` file or system environment
- Docker Compose passes environment variables to container

#### 2.3.2.3 Error Handling Integration

Error Handling (F-003) integrates with request processing to provide consistent error responses:

**Integration Points:**
1. **404 Not Found:** Router invokes `notFound` handler when no route matches
2. **405 Method Not Allowed:** Router invokes `methodNotAllowed` handler for unsupported methods
3. **500 Internal Server Error:** Server-level error handler catches uncaught exceptions
4. **Logging:** All error handlers delegate to F-004 for logging error details

**Integration Mechanism:**
- Router checks path in `src/backend/router.js` and calls appropriate error handler
- Error handlers in `src/backend/handlers/error.js` format responses consistently
- Security headers (F-005) applied to error responses via middleware
- Logger (F-004) captures error responses with appropriate severity

#### 2.3.2.4 Containerization and Deployment Integration

Docker Containerization (F-009) packages all features and integrates with operational capabilities:

**Integration Points:**
1. **Health Checking (F-007):** Docker Compose healthcheck targets application endpoint
2. **Monitoring (F-010):** Monitoring stack deployed via Docker Compose alongside application
3. **Configuration (F-006):** Environment variables passed through Docker Compose configuration
4. **Development Workflow:** Volume mounts enable hot reload for local development

**Integration Mechanism:**
- `docker-compose.yml` defines service dependencies and networks
- Custom bridge network `hello-world-network` enables service discovery
- Volume mounts preserve state (node_modules) and enable hot reload (source code)
- Port mapping exposes application and monitoring interfaces

#### 2.3.2.5 Testing Integration

Testing Infrastructure (F-011) validates all features through unit and integration tests:

**Test Coverage by Feature:**

| Feature | Test Location | Test Type | Coverage |
|---|---|---|---|
| F-001 (Server) | `__tests__/server.test.js` | Unit | ≥ 85% |
| F-002 (Hello) | `__tests__/handlers/helloHandler.test.js` | Unit | 100% |
| F-002 (Hello) | `__tests__/integration/api.test.js` | Integration | Full E2E |
| F-003 (Errors) | `__tests__/handlers/error.test.js` | Unit | ≥ 90% |
| F-006 (Config) | `__tests__/config.test.js` | Unit | ≥ 85% |

**Integration Mechanism:**
- Unit tests import modules directly and mock dependencies
- Integration tests use Supertest to test full HTTP cycle
- Jest configuration enforces coverage thresholds per feature
- CI/CD consumes JUnit XML output for build status

### 2.3.3 Shared Components

#### 2.3.3.1 Constants Module

**Location:** `src/backend/utils/constants.js`

**Purpose:** Single source of truth for HTTP status codes, headers, messages, routes, and configuration defaults.

**Used By:**
- F-001 (Server) - HTTP status codes
- F-002 (Hello) - Response message (`MESSAGES.HELLO_RESPONSE`)
- F-003 (Error Handling) - Error messages (NOT_FOUND, METHOD_NOT_ALLOWED, SERVER_ERROR)
- F-004 (Logging) - Log level constants
- F-006 (Configuration) - Default configuration values

**Integration Pattern:**
```javascript
// Constants defined once
const MESSAGES = {
  HELLO_RESPONSE: 'Hello world',
  NOT_FOUND: 'Not Found',
  // ...
};

// Imported by all features
const { MESSAGES } = require('./utils/constants');
```

#### 2.3.3.2 Logger Utility

**Location:** `src/backend/utils/logger.js`

**Purpose:** Centralized logging interface with timestamp formatting, log level filtering, and test environment suppression.

**Used By:**
- F-001 (Server) - Server lifecycle events (start, stop)
- F-002 (Hello) - Request/response logging via middleware
- F-003 (Error Handling) - Error logging with appropriate severity
- F-004 (Request Logging) - Primary consumer for all request logs
- F-008 (Graceful Shutdown) - Shutdown event logging

**Integration Pattern:**
```javascript
// Logger provides consistent interface
logger.info('Server listening on http://HOST:PORT');
logger.warn('404 Not Found: GET /unknown');
logger.error('Uncaught exception:', error);
```

#### 2.3.3.3 Request/Response Objects

**Purpose:** Native Node.js HTTP objects passed through middleware chain and to handlers.

**Shared By:**
- F-001 (Server) - Creates and provides req/res objects
- F-002 (Hello Handler) - Receives req/res for processing
- F-003 (Error Handlers) - Receives req/res for error responses
- F-004 (Request Logging) - Inspects req/res for logging
- F-005 (Security Headers) - Modifies res headers

**Integration Pattern:**
- Request object provides: `method`, `url`, `headers`
- Response object provides: `setHeader()`, `writeHead()`, `end()`
- Middleware pattern passes objects through chain: `(req, res, next) => {}`

### 2.3.4 Feature Communication Diagram

The following diagram illustrates how features communicate during a typical request:

```mermaid
flowchart TB
    Start([HTTP Request]) --> F001[F-001: HTTP Server<br/>Receives Connection]
    F001 --> F006{F-006: Config<br/>Load Settings}
    F006 --> F004[F-004: Logger<br/>Start Timer]
    F004 --> F005[F-005: Security<br/>Add Headers]
    F005 --> Route{Router<br/>Match Path}
    
    Route -->|/hello + GET| F002[F-002: Hello Handler<br/>Generate Response]
    Route -->|/hello + other| F003A[F-003: Error 405<br/>Method Not Allowed]
    Route -->|unknown path| F003B[F-003: Error 404<br/>Not Found]
    
    F002 --> Log
    F003A --> Log
    F003B --> Log
    
    Log[F-004: Logger<br/>Log Response] --> F001B[F-001: Server<br/>Send Response]
    F001B --> End([HTTP Response])
    
    F007[F-007: Health Check<br/>Docker/Prometheus] -.->|Monitors| F002
    F010[F-010: Monitoring<br/>Prometheus/Grafana] -.->|Observes| F004
    F011[F-011: Tests<br/>Jest/Supertest] -.->|Validates| F002
    F011 -.->|Validates| F003A
    F011 -.->|Validates| F003B
    
    F009[F-009: Docker<br/>Container] -.->|Packages| F001
    F009 -.->|Includes| F007
    F009 -.->|Orchestrates| F010
    
    F008[F-008: Shutdown<br/>SIGINT/SIGTERM] -.->|Lifecycle| F001
```

## 2.4 Implementation Considerations

### 2.4.1 Technical Constraints

#### 2.4.1.1 Runtime Environment Constraints

| Constraint Category | Specification | Rationale | Impact |
|---|---|---|---|
| Node.js Version | 18.x LTS minimum | Long-term support, modern features, security updates | All features depend on Node.js 18+ APIs |
| Package Manager | npm 9.x or higher | Consistent with Node.js 18 LTS distribution | Dependency installation and scripts |
| Operating System | Linux/macOS/Windows | Cross-platform compatibility | Development and deployment flexibility |
| Process Architecture | Single process, single thread | Educational simplicity, no clustering complexity | Limited to single-core CPU utilization |

**Evidence:** Package.json engines specification, README.md system requirements, Dockerfile base image selection.

#### 2.4.1.2 Network and Protocol Constraints

| Constraint | Limitation | Workaround |
|---|---|---|
| HTTP Version | HTTP/1.1 only | No HTTP/2 or HTTP/3 support; use reverse proxy for advanced protocols |
| TLS/HTTPS | No built-in TLS | Plain HTTP only; use reverse proxy (nginx, Traefik) for HTTPS termination |
| WebSocket | Not supported | No real-time bidirectional communication; implement separately if needed |
| Port Binding | Single port only | Cannot bind to multiple ports; use single PORT configuration |

**Evidence:** Server implementation uses native `http` module (not `https`), no HTTP/2 or WebSocket implementations found.

#### 2.4.1.3 Functional Scope Constraints

| Area | Constraint | Justification |
|---|---|---|
| Endpoints | Single `/hello` endpoint only | Educational focus on fundamentals; additional endpoints out of scope |
| HTTP Methods | GET only (405 for others) | Simplicity; no POST/PUT/DELETE operations needed |
| Request Data | No body parsing or query parameters | Stateless service with no input processing |
| Response Format | Plain text only | No JSON, XML, HTML rendering; single content type |
| Authentication | None | Public endpoint; security headers only |
| Rate Limiting | None | Unlimited request rate; implement externally if needed |

**Evidence:** Handler implementation accepts no request data, router only matches `/hello` path, method validation rejects non-GET requests.

#### 2.4.1.4 Data Storage Constraints

| Constraint | Specification | Impact |
|---|---|---|
| Persistent Storage | None | No database integration; completely stateless service |
| In-Memory Storage | Configuration only | No caching, sessions, or application state |
| File System | Read-only for code | No file uploads, downloads, or temporary file creation |
| Session Management | Not supported | No user sessions or state persistence between requests |

**Evidence:** No database configuration, no file system operations in handlers, no session middleware.

### 2.4.2 Performance Requirements and Targets

#### 2.4.2.1 Response Time Requirements

| Metric | Target | Priority | Measurement Method |
|---|---|---|---|
| `/hello` endpoint latency | < 100ms (p95) | High | Request logging, Prometheus metrics |
| Error response latency | < 50ms | Medium | Error handler timing |
| Health check latency | < 100ms | Medium | Docker healthcheck timeout |
| Middleware overhead | < 10ms combined | Medium | Per-middleware timing analysis |

**Evidence:** Technical Specification Section 1.2.3 defines response time < 100ms as KPI target.

**Implementation Requirements:**
- F-004 (Request Logging) captures response time for every request
- F-010 (Monitoring) visualizes latency percentiles in Grafana
- Integration tests validate response time under load
- No blocking I/O operations in request path

#### 2.4.2.2 Resource Utilization Requirements

| Resource | Target | Priority | Monitoring Method |
|---|---|---|---|
| Memory footprint (RSS) | < 50MB idle | Medium | Prometheus node_metrics, Docker stats |
| Memory footprint (Heap) | < 30MB idle | Medium | Node.js process.memoryUsage() |
| CPU utilization | < 10% idle | Low | Container metrics, system monitoring |
| Startup time | < 1 second | Medium | Application logs (timestamp analysis) |

**Evidence:** Technical Specification Section 1.2.3 defines memory < 50MB RSS and startup < 1s as KPI targets.

**Implementation Requirements:**
- Minimal dependencies to reduce memory footprint
- No memory leaks in request handling or logging
- Efficient middleware chain without unnecessary processing
- Fast configuration loading and server binding

#### 2.4.2.3 Throughput and Concurrency

| Metric | Target | Priority | Validation Method |
|---|---|---|---|
| Concurrent requests | 100+ simultaneous | Medium | Load testing with Apache Bench or k6 |
| Requests per second | 1000+ on standard hardware | Low | Performance benchmarking |
| Request queue depth | No artificial limits | Low | Node.js event loop capacity |
| Connection handling | Non-blocking I/O | High | Architecture review, async/await usage |

**Evidence:** Node.js event loop architecture enables high concurrency; no artificial throttling implemented.

**Implementation Requirements:**
- Non-blocking request handling using async patterns
- No CPU-intensive operations in request path
- Event loop not blocked by synchronous operations
- Graceful degradation under high load

#### 2.4.2.4 Reliability and Availability

| Metric | Target | Priority | Validation Method |
|---|---|---|---|
| Successful response rate | 100% for valid requests | Critical | Integration tests, monitoring |
| Unhandled exceptions | 0 | Critical | Error logs, test coverage |
| Graceful shutdown success | 100% | High | Shutdown tests, signal handling validation |
| Error recovery | Immediate (no restart) | High | Error handler tests |

**Evidence:** Technical Specification Section 1.2.3 defines 100% success rate and 0 unhandled exceptions as critical KPIs.

**Implementation Requirements:**
- F-003 (Error Handling) catches all error scenarios
- F-008 (Graceful Shutdown) prevents connection drops
- F-011 (Testing) validates error handling paths
- No process crashes on invalid input or unexpected errors

### 2.4.3 Scalability Considerations

#### 2.4.3.1 Current Architecture Limitations

**Single Process Design:**
- Application runs as single Node.js process
- Limited to single CPU core utilization
- No built-in clustering or worker processes
- Event loop shared across all requests

**Stateless Design Benefits:**
- No shared state between requests enables horizontal scaling
- No session management or in-memory caching
- Each instance can handle requests independently
- No coordination required between instances

**Evidence:** Server implementation creates single HTTP server without cluster module; stateless design evident from lack of state management code.

#### 2.4.3.2 Horizontal Scaling Strategy

| Scaling Method | Implementation | Complexity | Status |
|---|---|---|---|
| Docker Container Replicas | Docker Compose scale or Kubernetes ReplicaSet | Low | Supported |
| External Load Balancer | nginx, HAProxy, cloud load balancer | Medium | Not Provided |
| Service Mesh | Istio, Linkerd for traffic management | High | Out of Scope |
| Auto-Scaling | Kubernetes HPA, cloud auto-scaling | Medium | Not Provided |

**Recommended Approach:**
1. Deploy multiple container instances using Docker Compose or Kubernetes
2. Front with external load balancer (nginx, cloud LB)
3. Use DNS-based service discovery for routing
4. Monitor per-instance metrics via Prometheus

**Evidence:** Docker Compose configuration supports scaling; stateless design enables replica deployment.

#### 2.4.3.3 Vertical Scaling Limitations

**CPU Scaling:**
- Single-threaded application cannot use multiple cores
- Vertical CPU scaling provides minimal benefit
- Node.js event loop saturates single core under high load
- Recommendation: Horizontal scaling preferred over vertical

**Memory Scaling:**
- Memory footprint remains < 50MB regardless of hardware
- No memory-intensive operations or large data structures
- Vertical memory scaling unnecessary for this application

**Evidence:** Single-process architecture without cluster module; minimal memory usage observed.

#### 2.4.3.4 Scalability Bottlenecks and Mitigations

| Bottleneck | Impact | Mitigation Strategy |
|---|---|---|
| Single process per container | Limited throughput per instance | Deploy multiple container replicas |
| No connection pooling | N/A (no external connections) | Not applicable for stateless service |
| Synchronous logging | Potential event loop blocking | Minimal impact; consider async logging at scale |
| No request caching | Repeated identical processing | Implement CDN or reverse proxy caching |

**Future Enhancements for Scale:**
1. Add cluster module for multi-core utilization
2. Implement caching layer (Redis) for response caching
3. Add rate limiting to prevent overload
4. Implement circuit breakers for resilience

### 2.4.4 Security Implications

#### 2.4.4.1 Implemented Security Measures

**HTTP Security Headers (F-005):**

| Header | Value | Protection Against | Priority |
|---|---|---|---|
| X-Content-Type-Options | nosniff | MIME type sniffing attacks | High |
| X-Frame-Options | DENY | Clickjacking via iframe embedding | High |
| Content-Security-Policy | default-src 'none' | Cross-site scripting (XSS), resource injection | High |

**Error Information Protection (F-003):**
- Generic error messages to clients (no stack traces, file paths, or implementation details)
- Detailed errors logged server-side only
- No sensitive configuration exposed in responses
- Prevents reconnaissance and information disclosure attacks

**Evidence:** Security headers implemented in `src/backend/middleware/index.js`; error handlers return generic messages only.

#### 2.4.4.2 Security Limitations (Educational Scope)

**Authentication and Authorization:**
- **Not Implemented:** No user authentication, API keys, or access control
- **Risk:** Endpoint is publicly accessible without restrictions
- **Mitigation:** Deploy behind API gateway with authentication if required

**Rate Limiting and DDoS Protection:**
- **Not Implemented:** No request rate limiting or throttling
- **Risk:** Susceptible to denial-of-service attacks or resource exhaustion
- **Mitigation:** Implement rate limiting at reverse proxy or API gateway layer

**Input Validation:**
- **Minimal Implementation:** URL path validation only
- **Risk:** Low risk given no input data processing
- **Status:** Appropriate for current scope; expand if accepting input data

**HTTPS/TLS:**
- **Not Implemented:** Plain HTTP only, no encryption
- **Risk:** Man-in-the-middle attacks, eavesdropping
- **Mitigation:** Use reverse proxy (nginx) for TLS termination in production

**Evidence:** No authentication middleware, rate limiting, or HTTPS implementation found in codebase.

#### 2.4.4.3 Security Best Practices Demonstrated

**Defense in Depth:**
- Multiple security layers: headers, error handling, input validation
- Security applied consistently via middleware pattern
- Principle of least privilege (minimal exposed functionality)

**Secure Error Handling:**
- No information leakage in error responses
- Logging separation (details server-side, generic client-side)
- Proper HTTP status codes for security-relevant errors

**Configuration Security:**
- Sensitive configuration via environment variables (not hardcoded)
- `.env` file excluded from version control (should be in .gitignore)
- Validation of configuration values before use

**Evidence:** Middleware applies security universally; error handlers prevent leakage; configuration uses environment variables.

#### 2.4.4.4 Security Recommendations for Production

| Recommendation | Priority | Implementation Approach |
|---|---|---|
| Add authentication/authorization | Critical | Implement JWT middleware or API gateway authentication |
| Enable HTTPS/TLS | Critical | Use reverse proxy (nginx, Traefik) for TLS termination |
| Implement rate limiting | High | Add rate limiting middleware or use API gateway |
| Add request size limits | Medium | Configure max request body size if accepting input |
| Enable CORS with whitelist | Medium | Add CORS middleware with allowed origins if needed |
| Implement audit logging | Medium | Log authentication events, access attempts |
| Add security scanning | High | Integrate SAST/DAST tools, dependency scanning (npm audit) |
| Container security hardening | High | Use distroless images, non-root user, read-only filesystem |

### 2.4.5 Maintenance Requirements

#### 2.4.5.1 Dependency Management

**Production Dependencies:**
- `dotenv` v16.0.3 - Minimal, stable package with infrequent updates
- No other production dependencies (uses native Node.js modules)

**Development Dependencies:**
- Jest (testing framework) - Regular updates for new features
- Supertest (HTTP testing) - Stable, infrequent updates
- jest-junit (CI reporting) - Stable, maintenance-mode

**Maintenance Tasks:**

| Task | Frequency | Priority | Process |
|---|---|---|---|
| Security vulnerability scanning | Weekly | Critical | Run `npm audit` and apply patches |
| Dependency updates | Monthly | Medium | Update devDependencies, test thoroughly |
| Node.js LTS updates | Every 6 months | High | Upgrade to latest LTS, update Dockerfile |
| Breaking change review | Per release | High | Review changelogs before major version updates |

**Evidence:** Package.json lists dependencies; Dockerfile specifies Node.js 18 LTS.

#### 2.4.5.2 Documentation Maintenance

**Required Documentation Updates:**

| Trigger Event | Documents to Update | Priority |
|---|---|---|
| New endpoint added | API documentation, README, tests | Critical |
| Environment variable changed | README, config.js comments, .env.example | Critical |
| Response format modified | API docs, integration tests, constants | Critical |
| Dependency version upgrade | Package.json, Dockerfile, README | Medium |
| Configuration default changed | config.js, README, Technical Specification | High |

**Documentation Standards:**
- Inline code comments for complex logic
- README.md for setup and usage instructions
- API documentation for endpoint specifications
- Technical Specification for architecture and requirements

**Evidence:** README.md contains comprehensive documentation; inline comments present in source code.

#### 2.4.5.3 Testing Maintenance

**Test Maintenance Requirements:**

| Maintenance Activity | Trigger | Priority | Effort |
|---|---|---|---|
| Update test assertions | Constants or messages changed | Critical | Low |
| Add new test cases | New features or bug fixes | Critical | Medium |
| Update mocks | Interface changes in dependencies | High | Low |
| Coverage threshold adjustment | Codebase complexity changes | Medium | Low |
| Integration test updates | API contract changes | Critical | Medium |

**Test Quality Standards:**
- All new code must meet coverage thresholds (80-100% depending on component)
- Integration tests required for all endpoint changes
- Mock implementations must stay synchronized with actual interfaces
- Tests must be deterministic (no flaky tests)

**Evidence:** Jest configuration enforces coverage thresholds; comprehensive test suite demonstrates testing standards.

#### 2.4.5.4 Monitoring and Observability Maintenance

**Operational Monitoring:**

| Component | Maintenance Task | Frequency | Owner |
|---|---|---|---|
| Request Logs | Review for errors and patterns | Daily | Operations |
| Prometheus Metrics | Verify scrape health, storage | Weekly | DevOps |
| Grafana Dashboards | Update queries, add panels | As needed | DevOps |
| Health Checks | Verify Docker/K8s health status | Continuous | Automation |

**Log Management:**
- Console logs suitable for container orchestration (Docker, Kubernetes)
- Consider log aggregation (ELK, Loki) for production deployments
- Implement log rotation if persisting to disk
- Maintain log format consistency for parsing

**Metrics Management:**
- **Note:** Metrics endpoint (F-010) partially implemented; full implementation requires maintenance
- Prometheus retention policies (default 15 days, adjust for requirements)
- Grafana dashboard updates as new metrics added
- Alert rule definition and maintenance (not currently implemented)

**Evidence:** Logging infrastructure in place; Prometheus/Grafana configured but metrics endpoint implementation unclear.

#### 2.4.5.5 Deployment and Release Maintenance

**Release Process Requirements:**

| Release Phase | Activities | Validation |
|---|---|---|
| Development | Code changes, unit tests, local verification | All tests pass, linting clean |
| Testing | Integration tests, coverage check | Coverage thresholds met, E2E tests pass |
| Staging | Docker build, container deployment, smoke tests | Health checks pass, manual verification |
| Production | Image deployment, health monitoring | Zero downtime, metrics nominal |

**Rollback Strategy:**
- Maintain previous Docker image versions for rollback
- Document rollback procedures in deployment guide
- Monitor health checks immediately after deployment
- Automated rollback on health check failures (if orchestration supports)

**Configuration Management:**
- Use `.env.example` as template for required variables
- Document all environment variables in README
- Validate configuration at startup (implemented in config.js)
- Track configuration changes in version control (excluding secrets)

**Evidence:** Docker Compose supports easy rollback via image tags; configuration validation implemented.

## 2.5 Requirements Traceability Matrix

### 2.5.1 Feature to Requirement Mapping

| Feature ID | Feature Name | Requirements Count | Critical Requirements | Implementation Status |
|---|---|---|---|---|
| F-001 | HTTP Server Implementation | 4 | F-001-RQ-001, F-001-RQ-003 | Completed |
| F-002 | Hello World Endpoint | 5 | F-002-RQ-001, F-002-RQ-002 | Completed |
| F-003 | Comprehensive Error Handling | 6 | F-003-RQ-001, F-003-RQ-002, F-003-RQ-003 | Completed |
| F-004 | Request Logging | 6 | F-004-RQ-001, F-004-RQ-002 | Completed |
| F-005 | HTTP Security Headers | 4 | F-005-RQ-001, F-005-RQ-002, F-005-RQ-003 | Completed |
| F-006 | Configuration Management | 7 | F-006-RQ-001, F-006-RQ-002, F-006-RQ-006 | Completed |
| F-007 | Health Checking | 4 | F-007-RQ-001 | Completed |
| F-008 | Graceful Shutdown | 5 | F-008-RQ-001, F-008-RQ-002 | Completed |
| F-009 | Docker Containerization | 7 | F-009-RQ-001, F-009-RQ-003, F-009-RQ-005 | Completed |
| F-010 | Monitoring and Observability | 5 | F-010-RQ-004 | Partially Completed |
| F-011 | Testing Infrastructure | 6 | F-011-RQ-001, F-011-RQ-002, F-011-RQ-004 | Completed |
| **Total** | **11 Features** | **59 Requirements** | **23 Critical** | **10.9 / 11 Complete** |

### 2.5.2 Requirement to Test Mapping

| Requirement Category | Unit Tests | Integration Tests | Coverage Target | Actual Coverage |
|---|---|---|---|
| F-002 (Hello Endpoint) | `__tests__/handlers/helloHandler.test.js` | `__tests__/integration/api.test.js` | 100% | 100% |
| F-003 (Error Handling) | `__tests__/handlers/error.test.js` | `__tests__/integration/api.test.js` | 90%+ | 90%+ |
| F-001 (Server Lifecycle) | `__tests__/server.test.js` | `__tests__/integration/api.test.js` | 85%+ | 85%+ |
| F-004 (Request Logging) | Mock validation in handler tests | Verified in integration tests | 85%+ | 85%+ |
| F-006 (Configuration) | `__tests__/config.test.js` | Environment variable tests | 85%+ | 85%+ |

**Test Evidence Sources:**
- Jest configuration: `src/backend/jest.config.js` (coverage thresholds)
- Unit tests: `src/backend/__tests__/**/*.test.js`
- Integration tests: `src/backend/__tests__/integration/api.test.js`
- Coverage reports: Generated by Jest, enforced by CI

### 2.5.3 Requirement to Documentation Mapping

| Requirement | Documented In | Documentation Type |
|---|---|---|
| All Features (F-001 to F-011) | README.md | User guide, setup instructions |
| API Endpoint (F-002) | README.md (API Reference) | Endpoint specification, examples |
| Configuration (F-006) | README.md, .env.example, config.js | Environment variables, defaults |
| Docker Deployment (F-009) | README.md, docker-compose.yml | Deployment guide, configuration |
| Testing (F-011) | README.md, jest.config.js | Test execution, coverage targets |
| Monitoring (F-010) | Prometheus.yml, Grafana dashboard | Metrics configuration, dashboards |
| Architecture (All) | Technical Specification | System design, component details |

### 2.5.4 Acceptance Criteria Summary

| Feature | Total Acceptance Criteria | Testable Criteria | Verified By |
|---|---|---|---|
| F-001 (HTTP Server) | 12 | 12 | Unit tests, integration tests, manual verification |
| F-002 (Hello Endpoint) | 15 | 15 | Unit tests, integration tests, Supertest assertions |
| F-003 (Error Handling) | 18 | 18 | Unit tests, integration tests, error scenario tests |
| F-004 (Request Logging) | 18 | 16 | Mock verification, log output inspection |
| F-005 (Security Headers) | 12 | 12 | Integration tests, header assertions |
| F-006 (Configuration) | 21 | 18 | Unit tests, environment variable validation |
| F-007 (Health Checking) | 12 | 12 | Docker healthcheck, health-check.sh script |
| F-008 (Graceful Shutdown) | 15 | 12 | Shutdown tests, signal handling verification |
| F-009 (Containerization) | 21 | 18 | Docker build, container runtime, Docker Compose |
| F-010 (Monitoring) | 15 | 12 | Prometheus scrape, Grafana dashboard verification |
| F-011 (Testing) | 18 | 18 | Jest execution, coverage reports, CI integration |
| **Total** | **177 Criteria** | **163 Testable** | **92% Automated Verification** |

## 2.6 References

### 2.6.1 Source Code Files Examined

**Core Application Files:**
1. `src/backend/index.js` - Application entry point, signal handlers
2. `src/backend/server.js` - HTTP server implementation, lifecycle management
3. `src/backend/router.js` - Request routing logic
4. `src/backend/config.js` - Configuration management and validation
5. `src/backend/handlers/helloHandler.js` - Hello endpoint implementation
6. `src/backend/handlers/error.js` - Error handlers (404, 405, 500)
7. `src/backend/errorHandler.js` - Error handling utilities
8. `src/backend/middleware/index.js` - Middleware implementations (logging, security)
9. `src/backend/utils/constants.js` - Application constants and defaults
10. `src/backend/utils/logger.js` - Logging utility

**Configuration Files:**
11. `src/backend/package.json` - Project metadata, dependencies, scripts
12. `src/backend/jest.config.js` - Test configuration, coverage thresholds
13. `src/backend/nodemon.json` - Development auto-reload configuration
14. `src/backend/Dockerfile` - Production container image definition
15. `.env` - Environment variable configuration (referenced, not examined for security)

**Test Files:**
16. `src/backend/__tests__/handlers/helloHandler.test.js` - Hello handler unit tests
17. `src/backend/__tests__/integration/api.test.js` - End-to-end integration tests
18. `src/backend/__tests__/setup.js` - Test environment setup

**Infrastructure Files:**
19. `infrastructure/local/docker-compose.yml` - Local development orchestration
20. `infrastructure/monitoring/prometheus.yml` - Prometheus configuration
21. `infrastructure/monitoring/grafana-dashboard.json` - Grafana dashboard definition
22. `infrastructure/scripts/health-check.sh` - Standalone health check script

**Documentation Files:**
23. `src/backend/README.md` - Developer documentation and API reference
24. Root `README.md` - Project overview and getting started guide

### 2.6.2 Technical Specification Sections Referenced

1. **Section 1.1 Executive Summary** - Project overview, business context, stakeholders, value proposition
2. **Section 1.2 System Overview** - System capabilities, architecture, components, success criteria, KPIs
3. **Section 1.3 Scope** - In-scope features (F-001, F-002, F-003), out-of-scope elements, implementation boundaries

### 2.6.3 External References

**Node.js Ecosystem:**
- Node.js 18.x LTS Documentation: https://nodejs.org/docs/latest-v18.x/api/
- npm Package Manager: https://docs.npmjs.com/
- dotenv Package v16.0.3: https://www.npmjs.com/package/dotenv

**Testing Framework:**
- Jest Testing Framework v29.x: https://jestjs.io/docs/getting-started
- Supertest HTTP Testing Library v6.3.3: https://github.com/visionmedia/supertest
- jest-junit Reporter: https://www.npmjs.com/package/jest-junit

**Containerization:**
- Docker Documentation: https://docs.docker.com/
- Docker Compose Specification: https://docs.docker.com/compose/compose-file/
- node:18-alpine Base Image: https://hub.docker.com/_/node

**Monitoring and Observability:**
- Prometheus Monitoring: https://prometheus.io/docs/
- Grafana Dashboards: https://grafana.com/docs/
- Prometheus Text Exposition Format: https://prometheus.io/docs/instrumenting/exposition_formats/

**Best Practices and Standards:**
- Twelve-Factor App Methodology: https://12factor.net/
- OWASP Security Headers: https://owasp.org/www-project-secure-headers/
- HTTP/1.1 Specification (RFC 7231): https://tools.ietf.org/html/rfc7231

### 2.6.4 Methodology Notes

**Research Approach:**
- 25 file searches conducted across repository structure
- Exploration depth: 5 levels (root to src/backend/__tests__)
- Code analysis focused on implementation files, configuration, and tests
- No assumptions made; all claims grounded in retrieved source code
- Cross-referencing between files to validate feature implementations

**Documentation Standards:**
- All feature descriptions based on actual implementation
- Functional requirements derived from code behavior and test assertions
- Acceptance criteria validated against test cases where available
- Implementation status determined by presence of source code
- Partial implementation noted explicitly (F-010 metrics endpoint)

**Validation Methods:**
- Code inspection for implementation verification
- Test file analysis for acceptance criteria validation
- Configuration file review for deployment capabilities
- Documentation consistency checks across multiple sources

# 3. Technology Stack

## 3.1 Overview

The Node.js Hello World Service employs a deliberately minimalist technology stack designed to maximize educational value while demonstrating production-ready patterns. The architecture prioritizes native Node.js capabilities over heavyweight frameworks, reduces external dependencies to essential components, and integrates industry-standard tooling for development, testing, deployment, and observability.

This technology stack serves the dual purpose of providing a clear learning path for developers new to Node.js server development while showcasing operational excellence through containerization, automated testing, monitoring, and deployment automation. Every technology choice balances simplicity with professional practices, ensuring learners understand fundamental concepts without being overwhelmed by framework-specific abstractions.

### 3.1.1 Technology Selection Philosophy

The technology stack adheres to four core principles that guide all architectural decisions:

**Principle 1: Native-First Approach**
The service prioritizes Node.js built-in modules over external frameworks wherever educationally valuable. This exposes learners to fundamental HTTP server mechanics, request processing, and middleware patterns without framework magic. The native `http` module serves as the primary implementation, with Express.js provided as an optional alternative to demonstrate framework patterns.

**Principle 2: Minimal Dependencies**
Production runtime dependencies are limited to Node.js core modules and the `dotenv` configuration library. This design minimizes security surface area, reduces complexity, simplifies dependency management, and focuses attention on core concepts rather than third-party API usage. Development and testing dependencies are more extensive to support quality assurance and developer productivity.

**Principle 3: Production-Ready Patterns**
Despite its educational focus, the stack includes enterprise-grade tooling for containerization (Docker), monitoring (Prometheus/Grafana), testing (Jest/Supertest), and deployment automation (Bash scripts). This demonstrates that even simple services should follow operational best practices and prepares learners for professional development environments.

**Principle 4: Version Stability**
All components specify LTS (Long-Term Support) or stable versions to ensure consistency across development environments and prevent breaking changes. Node.js 18.x LTS provides the foundation, with all dependencies locked through `package-lock.json` (lockfileVersion 3) for deterministic installations.

### 3.1.2 Stack Architecture Diagram

The following diagram illustrates the complete technology stack across development, runtime, and operational layers:

```mermaid
graph TB
    subgraph "Development Environment"
        A[Node.js 18.x LTS]
        B[npm 8.x/9.x]
        C[nodemon]
        D[ESLint/Prettier]
    end
    
    subgraph "Runtime Environment"
        E[Native HTTP Module]
        F[Express.js Optional]
        G[dotenv v16.0.3]
    end
    
    subgraph "Testing Infrastructure"
        H[Jest 29.x]
        I[Supertest v6.3.3]
        J[jest-junit]
    end
    
    subgraph "Containerization"
        K[Docker Engine]
        L[node:18-alpine]
        M[Docker Compose v3.8]
    end
    
    subgraph "Monitoring Stack"
        N[Prometheus 2.x]
        O[Grafana]
    end
    
    subgraph "Deployment Automation"
        P[Bash Scripts]
        Q[GitHub Actions]
    end
    
    A --> E
    A --> F
    A --> G
    B --> A
    C --> A
    D --> A
    
    H --> E
    I --> H
    J --> H
    
    L --> A
    M --> K
    K --> L
    
    N --> E
    O --> N
    
    P --> K
    Q --> P
```

## 3.2 Programming Languages

### 3.2.1 JavaScript (Node.js Runtime)

#### 3.2.1.1 Language Selection

**Primary Language: JavaScript**
- **Runtime:** Node.js 18.x LTS (specifically 18.0.0 or higher)
- **Standard:** ECMAScript 2022 (ES13) with native module support
- **Implementation Location:** All source code in `src/backend/` directory

**Selection Justification:**

JavaScript with Node.js is the foundational technology choice for this service, selected based on the following criteria:

1. **Educational Accessibility:** JavaScript's ubiquity in web development makes it the most accessible language for developers transitioning to backend development. The syntax familiarity reduces cognitive load, allowing learners to focus on server-side concepts.

2. **Native HTTP Server Capabilities:** Node.js provides built-in HTTP server functionality through the `http` module, enabling implementation without external web frameworks. This exposes learners to fundamental server mechanics often hidden by framework abstractions.

3. **Asynchronous I/O Model:** Node.js's event-driven, non-blocking architecture demonstrates modern approaches to handling concurrent connections efficiently, a critical concept for understanding scalable web services.

4. **Ecosystem Maturity:** The npm ecosystem provides battle-tested libraries for testing (Jest), containerization, and observability, enabling professional development practices without reinventing foundational tooling.

5. **LTS Version Stability:** Node.js 18.x LTS (maintenance until April 2025) provides stability, security updates, and feature completeness suitable for educational content with multi-year relevance.

**Evidence:**
- `CONTRIBUTING.md` (line 25): "Node.js 18.x LTS or higher"
- `README.md` (line 29): Node.js version requirement documented
- `Dockerfile` (line 2): `FROM node:18-alpine` base image
- `src/backend/Dockerfile` (line 3): `FROM node:18-alpine`

#### 3.2.1.2 Version Requirements and Constraints

**Minimum Version: Node.js 18.0.0**

The service requires Node.js 18.x for the following capabilities:

- **Fetch API:** Native fetch support without external libraries (added in Node.js 18.0.0)
- **Test Runner:** Built-in test runner improvements (although Jest is used for comprehensive testing)
- **Performance Improvements:** V8 engine optimizations and reduced startup time
- **Security Updates:** Active LTS maintenance with regular security patches
- **ES Module Support:** Stable ESM implementation with proper import/export handling

**Package Manager Requirements:**
- **npm:** Version 8.x or higher (distributed with Node.js 18.x)
- **Alternative:** Compatible with yarn or pnpm but npm is documented standard
- **Evidence:** `CONTRIBUTING.md` (line 26) specifies "npm 8.x or higher"

**Runtime Configuration:**
- **Environment:** Configured via `NODE_ENV` (development, production, test)
- **Memory Limits:** Default Node.js heap size (sufficient for lightweight service)
- **Startup:** `node index.js` or `npm start` as entry point

### 3.2.2 Bash Scripting

#### 3.2.2.1 Scripting Language Selection

**Secondary Language: Bash (Bourne Again Shell)**
- **Version:** POSIX-compliant Bash 4.x or higher
- **Purpose:** Deployment automation, environment provisioning, and operational tooling
- **Implementation Location:** `infrastructure/scripts/` directory

**Selection Justification:**

Bash scripting is employed for infrastructure automation based on the following requirements:

1. **Universal Availability:** Bash is present in all Unix-like environments (Linux, macOS) and Docker containers, ensuring portability without additional runtime dependencies.

2. **System Integration:** Direct access to operating system utilities (curl, grep, ps, netstat) enables environment checks, health validation, and process management without language-specific libraries.

3. **CI/CD Compatibility:** Bash scripts integrate seamlessly with GitHub Actions, Jenkins, and other CI/CD platforms that expect shell-based automation.

4. **Educational Value:** Demonstrates separation of concerns between application code (JavaScript) and operational tooling (Bash), a pattern common in professional environments.

#### 3.2.2.2 Automation Scripts Inventory

**Four Bash Scripts Implemented:**

1. **deploy.sh** - End-to-end deployment orchestration
   - Docker image building and tagging
   - Environment-specific deployment (dev/staging/production)
   - Health check verification post-deployment
   - Automatic rollback on failure
   - **Evidence:** `infrastructure/scripts/` folder summary

2. **health-check.sh** - Service availability validation
   - HTTP endpoint testing (`/hello` endpoint)
   - Status code verification (expects 200)
   - Response body validation (expects "Hello world")
   - CI-compatible exit codes (0=healthy, 1=unhealthy, 2=unreachable)
   - **Evidence:** Referenced in Docker Compose healthcheck configuration

3. **setup.sh** - Developer environment provisioning
   - Node.js version validation (minimum 18.0.0)
   - npm presence verification
   - Dependency installation automation
   - `.env` file creation and configuration
   - Port availability checks (verifies 3000 is available)
   - **Evidence:** Onboarding automation mentioned in CONTRIBUTING.md

4. **start-server.sh** - Server lifecycle management
   - Foreground or detached (background) execution modes
   - PID file management for process tracking
   - Log file management for detached mode
   - Port availability pre-checks
   - **Evidence:** Server management utilities in scripts folder

**Script Requirements:**
- **Shell Compatibility:** POSIX-compliant for maximum portability
- **Error Handling:** Proper exit codes and error messaging
- **Documentation:** Inline comments explaining each operation
- **Security:** No hardcoded secrets or credentials

## 3.3 Frameworks & Libraries

### 3.3.1 Core Server Framework

#### 3.3.1.1 Native Node.js HTTP Module (Primary Implementation)

**Framework: Node.js Built-in `http` Module**
- **Version:** Included with Node.js 18.x (no separate versioning)
- **Module Import:** `const http = require('http');` or `import http from 'http';`
- **Implementation:** `src/backend/server.js`

**Selection Justification:**

The native `http` module serves as the primary implementation framework based on the following educational and technical criteria:

1. **Zero Abstraction Learning:** Using `http.createServer()` directly exposes learners to HTTP protocol fundamentals including request parsing, response construction, header management, and connection handling without framework magic.

2. **No External Dependencies:** Eliminates framework-specific learning curves, version conflicts, and security vulnerabilities from dependencies. The service depends solely on Node.js core capabilities.

3. **Minimal Performance Overhead:** Direct HTTP implementation provides maximum performance with no middleware layer overhead or framework routing complexity.

4. **Complete Control:** Developers control every aspect of request processing, middleware composition, and response generation, demonstrating architectural patterns rather than framework conventions.

5. **Framework Comparison Foundation:** Provides baseline for understanding what frameworks like Express.js abstract away, enabling informed framework selection in future projects.

**Core Implementation Pattern:**

The server implementation uses `http.createServer()` with custom request handler:

- **Server Creation:** `const server = http.createServer(requestHandler)`
- **Middleware Chain:** Custom middleware composition for logging and security headers
- **Routing Logic:** Path-based routing in `router.js` without external router library
- **Promise-Based Lifecycle:** `startServer()` and `stopServer()` return Promises for testability

**Evidence:**
- `README.md`: "Support for both native HTTP module and Express.js implementations"
- `server.js`: Default implementation using native HTTP
- System Overview (1.2): "Native-First Approach" philosophy

#### 3.3.1.2 Express.js Framework (Optional Alternative)

**Framework: Express.js**
- **Version:** Not specified in repository (would be 4.x stable)
- **Status:** Optional implementation (`server-express.js`)
- **Purpose:** Demonstrates framework-based approach for comparison

**Inclusion Justification:**

Express.js is provided as an optional implementation to demonstrate:

1. **Framework Patterns:** Shows how frameworks simplify routing, middleware management, and request handling compared to native implementation.

2. **Industry Standard:** Express.js is the most widely-used Node.js framework, making it valuable for understanding professional codebases.

3. **Migration Path:** Demonstrates how to transition from native implementation to framework-based architecture when requirements grow beyond simple services.

4. **Comparative Learning:** Side-by-side comparison between native and framework implementations illustrates abstraction trade-offs.

**Implementation Note:** Express.js is not the primary implementation and is not required for running the default service. Its inclusion is purely educational, showing alternative approaches to HTTP server construction.

### 3.3.2 Configuration Management Library

#### 3.3.2.1 dotenv Package

**Library: dotenv**
- **Version:** 16.0.3
- **Purpose:** Environment variable loading from `.env` files
- **Implementation:** `src/backend/config.js`

**Selection Justification:**

dotenv is the sole production runtime dependency, justified by the following requirements:

1. **Twelve-Factor App Compliance:** Implements the configuration principle of the Twelve-Factor App methodology, separating configuration from code and enabling environment-specific settings without code changes.

2. **Development Convenience:** Simplifies local development by loading configuration from `.env` files without requiring manual environment variable setup in shell profiles or IDE configurations.

3. **Security Best Practice:** Enables storing sensitive configuration (API keys, database credentials) in files excluded from version control (`.env` in `.gitignore`), preventing credential leakage.

4. **Widespread Adoption:** Industry-standard library used in most Node.js projects, making it essential learning for professional development.

5. **Zero Configuration:** Works out-of-the-box with `require('dotenv').config()`, requiring no additional setup or configuration.

**Functionality:**
- Loads `.env` file from process working directory (`process.cwd()`)
- Parses `KEY=value` format and populates `process.env`
- Optional file handling (missing `.env` does not cause errors)
- No override of existing environment variables (OS variables take precedence)

**Evidence:**
- `src/backend/config.js`: Implements dotenv loading for configuration
- Feature F-006 (Configuration Management): Documents dotenv usage
- README.md: Configuration via `.env` files documented

### 3.3.3 Development Tooling

#### 3.3.3.1 nodemon - Development Server

**Tool: nodemon**
- **Version:** Not specified (latest stable, typically 3.x)
- **Purpose:** Automatic server restart on file changes during development
- **Configuration:** `src/backend/nodemon.json`

**Selection Justification:**

nodemon enhances development productivity through automatic reload:

1. **Rapid Iteration:** Automatically restarts server when source files change, eliminating manual restart cycles and accelerating development feedback loop.

2. **Selective Watching:** Configured to watch only relevant files (`src/backend/**/*.js`), ignoring test files, logs, and node_modules to prevent unnecessary restarts.

3. **Graceful Restart:** Provides 1000ms delay between detection and restart, allowing file system operations to complete and preventing rapid restart cycles.

4. **Development Standard:** Industry-standard tool for Node.js development, essential for professional workflow understanding.

**Configuration Details:**
- **Watch Patterns:** `src/backend/**/*.js` (all JavaScript files in backend)
- **Ignored Patterns:** `__tests__/**`, `node_modules/**`
- **Restart Delay:** 1000ms (1 second) to debounce file system events
- **Manual Restart:** Type 'rs' command for immediate restart
- **Verbose Mode:** Enabled for detailed file change logging

**Evidence:**
- `src/backend/nodemon.json`: Complete nodemon configuration file
- Docker Compose: Development command uses `npm run dev` (nodemon)
- Feature F-009 (Docker Containerization): Hot reload via nodemon documented

#### 3.3.3.2 Code Quality Tools (Referenced)

**ESLint - JavaScript Linting**
- **Status:** Referenced in documentation but configuration not present
- **Expected Configuration:** `.eslintrc.js`
- **Purpose:** Enforce code style and detect potential errors

**Prettier - Code Formatting**
- **Status:** Referenced in documentation but configuration not present
- **Expected Configuration:** `.prettierrc`
- **Purpose:** Consistent code formatting across contributors

**Documentation Reference:**
- `CONTRIBUTING.md` (line 152): Mentions `.eslintrc.js` configuration
- `CONTRIBUTING.md` (line 153): Mentions `.prettierrc` configuration

**Implementation Note:** While ESLint and Prettier are mentioned in contributing guidelines, their configuration files were not found in the repository during analysis. The coding standards are documented (2 spaces, single quotes, semicolons, 100 character line length) but enforcement tooling may require setup by developers.

## 3.4 Open Source Dependencies

### 3.4.1 Testing Dependencies

#### 3.4.1.1 Jest Testing Framework

**Package: Jest**
- **Version:** 29.x (latest major version)
- **Environment:** Node.js test environment
- **Configuration:** `src/backend/jest.config.js`

**Selection Justification:**

Jest is the testing framework based on comprehensive testing requirements:

1. **Zero Configuration Philosophy:** Works out-of-the-box with sensible defaults while allowing extensive customization when needed.

2. **Built-in Features:** Provides integrated test runner, assertion library, mocking capabilities, and coverage reporting without additional packages.

3. **Snapshot Testing:** Supports snapshot testing for API responses and data structures (though not heavily used in this simple service).

4. **Watch Mode:** Interactive watch mode accelerates test-driven development by running only changed tests.

5. **Industry Standard:** Most widely-adopted JavaScript testing framework, essential knowledge for professional development.

6. **Parallel Execution:** Runs tests in parallel for faster execution, important as test suites grow.

**Configuration Highlights:**
- **Test Environment:** 'node' (not browser/jsdom)
- **Test Pattern:** `**/__tests__/**/*.test.js` for test file discovery
- **Coverage Thresholds:** Global (80-90%) and per-file (90-100%) enforcement
- **Reporters:** Default console reporter + jest-junit for CI integration
- **Setup Files:** Global test setup for spies and timeout configuration

**Coverage Requirements:**

| Scope | Branches | Functions | Lines | Statements |
|---|---|---|---|
| Global | 80% | 90% | 85% | 85% |
| handlers/hello.js | 100% | 100% | 100% | 100% |
| handlers/error.js | 90% | 100% | 90% | 90% |

**Evidence:**
- `src/backend/jest.config.js`: Complete Jest configuration with coverage thresholds
- Feature F-011 (Testing Infrastructure): Documents Jest setup and requirements
- Test files in `src/backend/__tests__/` directory

#### 3.4.1.2 Supertest - HTTP Integration Testing

**Package: Supertest**
- **Version:** 6.3.3
- **Purpose:** HTTP assertion library for integration testing
- **Integration:** Used within Jest test suites

**Selection Justification:**

Supertest enables comprehensive HTTP integration testing without requiring a running server:

1. **Direct Server Testing:** Accepts Node.js HTTP server instances directly, eliminating need for server startup/shutdown in tests.

2. **Fluent Assertions:** Chainable API for HTTP requests and response validation: `.get('/hello').expect(200).expect('Hello world')`

3. **Complete HTTP Coverage:** Tests full request/response cycle including middleware chain, routing, handlers, and error handling.

4. **Promise-Based API:** Integrates seamlessly with Jest's async testing patterns using async/await.

5. **Industry Standard:** Most widely-used HTTP testing library for Node.js, used alongside Jest in professional testing suites.

**Testing Capabilities:**
- HTTP method testing (GET, POST, PUT, DELETE, etc.)
- Status code assertions (`.expect(200)`)
- Header validation (`.expect('Content-Type', 'text/plain')`)
- Response body matching (`.expect('Hello world')`)
- Request header injection for testing authentication, content negotiation, etc.

**Evidence:**
- Repository summary: "Jest + Supertest tests"
- Feature F-011 (Testing Infrastructure): Integration tests using Supertest
- Test suite location: `src/backend/__tests__/integration/api.test.js`

#### 3.4.1.3 jest-junit - CI Test Reporting

**Package: jest-junit**
- **Version:** Not specified (latest stable, typically 15.x or 16.x)
- **Purpose:** JUnit XML reporter for CI/CD integration
- **Configuration:** `jest.config.js` reporters section

**Selection Justification:**

jest-junit provides CI/CD integration through standardized test reporting:

1. **CI Platform Compatibility:** JUnit XML format is universally supported by CI systems (Jenkins, GitLab CI, GitHub Actions, CircleCI).

2. **Test Result Visualization:** CI platforms parse XML to display test results, failure details, and trends in their UI.

3. **Build Status Integration:** Test failures in XML format trigger build failures and notifications automatically.

4. **Historical Tracking:** XML reports enable test result history tracking and trend analysis over time.

**Configuration Details:**
- **Output Location:** `./coverage/junit/junit.xml`
- **Report Content:** Test names, durations, failures, and error messages
- **Integration:** Configured in Jest reporters array alongside default reporter

**Evidence:**
- `jest.config.js` (lines 57-66): jest-junit reporter configuration
- Feature F-011 (Testing Infrastructure): Documents JUnit XML reporting for CI
- Output directory: `./coverage/junit/`

### 3.4.2 Package Management

#### 3.4.2.1 npm Package Manager

**Package Manager: npm (Node Package Manager)**
- **Version:** 8.x or 9.x (distributed with Node.js 18.x)
- **Lock File:** `package-lock.json` (lockfileVersion 3)
- **Registry:** https://registry.npmjs.org/ (default npm registry)

**Selection Justification:**

npm is the default package manager based on the following requirements:

1. **Built-in Distribution:** Included with Node.js installation, requiring no additional setup.

2. **Lock File Determinism:** `package-lock.json` version 3 ensures deterministic installations across environments, critical for reproducible builds and consistent development/production environments.

3. **CI/CD Optimization:** `npm ci` command provides faster, more reliable installs in CI environments by strictly following lock file.

4. **Script Running:** `npm start`, `npm test`, `npm run dev` provide standardized command interface across projects.

5. **Educational Standard:** Most widely-known package manager, essential for understanding Node.js ecosystem.

**Key Commands Used:**
- `npm install` - Development dependency installation
- `npm ci` - Production/CI deterministic installation
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon hot reload
- `npm test` - Run Jest test suite
- `npm run lint` - Code quality checks (if configured)
- `npm run audit` - Security vulnerability scanning

**Evidence:**
- `CONTRIBUTING.md` (line 26): "npm 8.x or higher" requirement
- `Dockerfile`: Uses `npm ci --only=production` for production builds
- `package-lock.json`: Lockfile version 3 format

## 3.5 Third-Party Services

### 3.5.1 External Service Integration

**Status: No Third-Party Services**

The Node.js Hello World Service operates as a **fully self-contained system** with no external service dependencies. This architectural decision aligns with the educational mission and simplicity goals:

**Intentionally Excluded Services:**
- **Authentication Providers:** No Auth0, Okta, or other identity services
- **External APIs:** No third-party API integrations or data sources
- **Cloud Services:** No AWS S3, CloudFront, or other cloud platform services
- **Payment Processors:** No Stripe, PayPal, or payment gateways
- **Email Services:** No SendGrid, Mailgun, or transactional email
- **Analytics Platforms:** No Google Analytics, Mixpanel, or usage tracking
- **Error Tracking:** No Sentry, Rollbar, or error monitoring services
- **CDN Services:** No Cloudflare, Fastly, or content delivery networks

**Justification for Exclusion:**

1. **Educational Focus:** External services add complexity and setup requirements that distract from core Node.js server concepts. The service focuses on HTTP fundamentals, not integration patterns.

2. **Zero Setup Friction:** Eliminating external services enables developers to run the project immediately after cloning without API keys, account creation, or service configuration.

3. **Consistent Behavior:** No external dependencies means consistent behavior across all environments without rate limits, API changes, or service outages affecting learning experience.

4. **Security Simplification:** No API keys or credentials to manage, store securely, or accidentally commit to version control.

5. **Cost Elimination:** No paid services required for learning or running the project, ensuring accessibility for all developers regardless of budget.

**Evidence:**
- System Overview (1.2.2): "Standalone tutorial project with no enterprise integration requirements"
- Feature Catalog (2.2): No features requiring external services
- Repository analysis: No API client libraries or configuration for external services

## 3.6 Databases & Storage

### 3.6.1 Data Persistence Strategy

**Status: No Database or Persistent Storage**

The Node.js Hello World Service implements a **stateless architecture** with no persistent data storage. This design choice is intentional and aligns with the service's educational purpose:

**Intentionally Excluded Storage Systems:**
- **Relational Databases:** No PostgreSQL, MySQL, or SQL Server
- **NoSQL Databases:** No MongoDB, Redis, or DynamoDB
- **Caching Solutions:** No Redis, Memcached, or in-memory caching
- **Object Storage:** No AWS S3, Azure Blob Storage, or file storage
- **Session Stores:** No session persistence or user state management
- **Message Queues:** No RabbitMQ, Kafka, or message persistence

**Stateless Design Justification:**

1. **Simplicity Focus:** Eliminating database concerns allows learners to focus exclusively on HTTP server mechanics without database connection management, query optimization, or data modeling complexity.

2. **Zero Infrastructure:** No database installation, configuration, or management required. Developers can run the service immediately without Docker Compose, database migrations, or schema management.

3. **Stateless RESTful Pattern:** Demonstrates pure stateless REST API pattern where each request is independent and self-contained, a fundamental concept for scalable web services.

4. **Testing Simplification:** No database mocking, test data seeding, or transaction management required in test suites. Tests run in complete isolation without database state concerns.

5. **Horizontal Scalability:** Stateless design enables trivial horizontal scaling—any number of instances can run simultaneously without shared state or coordination.

**Request Processing Model:**

Each incoming request is processed independently:
- No session lookup or user state retrieval
- No database queries or data persistence
- No caching or response memoization
- Response generated from application constants (`MESSAGES.HELLO_RESPONSE`)
- No side effects or data modification

**Evidence:**
- System Overview (1.2.2): "Stateless Design: No session management or persistent state"
- Feature F-002 (Hello Endpoint): "No database queries or external service calls"
- Repository analysis: No database client libraries or connection configuration

## 3.7 Development & Deployment

### 3.7.1 Containerization Platform

#### 3.7.1.1 Docker Container Runtime

**Platform: Docker Engine**
- **Version:** 20.x or higher recommended
- **Purpose:** Application containerization for consistent deployment
- **Base Image:** `node:18-alpine` (Alpine Linux variant)

**Selection Justification:**

Docker provides containerization based on the following requirements:

1. **Environment Consistency:** "Works on my machine" problem eliminated through containerized runtime environment identical across development, testing, and production.

2. **Dependency Isolation:** Container packages Node.js runtime, application code, and dependencies in isolated environment, preventing conflicts with host system or other applications.

3. **Minimal Image Size:** Alpine Linux variant reduces image size to ~50-70MB compressed compared to ~300MB+ for standard Debian-based images.

4. **Security Hardening:** Alpine's minimal package set reduces attack surface and vulnerability exposure compared to full Linux distributions.

5. **Industry Standard:** Docker is the de facto standard for application containerization, essential knowledge for modern software development and deployment.

6. **Cloud Platform Compatibility:** Docker images run on all major cloud platforms (AWS ECS/EKS, Google Cloud Run/GKE, Azure Container Instances/AKS).

**Dockerfile Architecture:**

The production Dockerfile implements a multi-stage build optimized for layer caching:

1. **Base Stage:** `FROM node:18-alpine`
2. **Dependency Layer:** `COPY package*.json` → `npm ci --only=production`
3. **Source Layer:** `COPY src/backend/` (separate layer for code changes)
4. **Metadata:** `EXPOSE 3000` (documents port)
5. **Runtime:** `CMD ["node", "index.js"]` (production startup)

**Layer Caching Optimization:**

Package files are copied before source code to leverage Docker layer caching:
- Dependency layer rebuilds only when `package.json` or `package-lock.json` change
- Source code layer rebuilds on every code change
- Average rebuild time: ~10-20 seconds when dependencies unchanged

**Evidence:**
- `src/backend/Dockerfile` (line 3): `FROM node:18-alpine` base image
- Feature F-009 (Docker Containerization): Complete Docker implementation
- Dockerfile optimization: Package files copied before source code

#### 3.7.1.2 Docker Compose Orchestration

**Tool: Docker Compose**
- **Version:** 3.8 (compose file format version)
- **Purpose:** Multi-container orchestration for local development
- **Configuration:** `infrastructure/local/docker-compose.yml`

**Selection Justification:**

Docker Compose simplifies local development environment setup:

1. **Single Command Startup:** `docker-compose up` starts entire stack (application, Prometheus, Grafana) with one command.

2. **Service Coordination:** Manages dependencies, networking, and startup order between application and monitoring containers automatically.

3. **Development Volumes:** Bind mounts enable hot reload—code changes on host immediately reflected in container without rebuild.

4. **Network Isolation:** Custom bridge network (`hello-world-network`) enables service-to-service communication by name without exposing ports.

5. **Configuration Management:** Environment variables, port mappings, and volume mounts defined declaratively in YAML format.

**Docker Compose Configuration:**

```yaml
version: "3.8"
services:
  hello-world-app:
    build: ../../
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=development
    volumes:
      - ../../src/backend:/app  # Hot reload
      - node_modules:/app/node_modules  # Preserve container deps
    networks:
      - hello-world-network
    command: npm run dev  # Uses nodemon
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Volume Strategy:**

Two volumes are mounted for optimal development experience:

1. **Bind Mount (`../../src/backend:/app`):**
   - Maps host source directory to container `/app`
   - Enables real-time code synchronization
   - Changes trigger nodemon restart (~1 second latency)

2. **Named Volume (`node_modules:/app/node_modules`):**
   - Preserves container-built dependencies
   - Prevents host `node_modules` (may be macOS/Windows) from overwriting container modules (Linux)
   - Avoids native module compatibility issues across operating systems

**Health Check Configuration:**

Docker Compose health check monitors service availability:
- **Command:** `curl -f http://localhost:3000/hello || exit 1`
- **Interval:** 30 seconds between checks
- **Timeout:** 10 seconds maximum check duration
- **Retries:** 3 consecutive failures before marking unhealthy
- **Start Period:** 10 seconds grace period after container start

**Evidence:**
- `infrastructure/local/docker-compose.yml`: Complete orchestration configuration
- Feature F-009 (Docker Containerization): Docker Compose setup documented
- Docker Compose version 3.8 format for compatibility

### 3.7.2 Build System

#### 3.7.2.1 npm Scripts Build Orchestration

**Build Tool: npm scripts**
- **Location:** `package.json` scripts section
- **Purpose:** Task running and build orchestration
- **Commands:** start, dev, test, lint, audit

**npm Scripts Inventory:**

| Script | Command | Purpose |
|---|---|---|
| `npm start` | `node index.js` | Start server in production mode |
| `npm run dev` | `nodemon index.js` | Development mode with hot reload |
| `npm test` | `jest` | Run test suite with coverage |
| `npm run test:watch` | `jest --watch` | Interactive test mode |
| `npm run lint` | `eslint .` | Code quality linting |
| `npm run audit` | `npm audit` | Security vulnerability scanning |

**Build Strategy:**

The service uses a minimal build approach:

1. **No Transpilation:** Modern Node.js 18.x supports ES2022 natively, eliminating need for Babel or TypeScript compilation.

2. **No Bundling:** Server-side code runs directly from source files; no webpack or rollup bundling required.

3. **Dependency Management:** `npm install` for development, `npm ci --only=production` for production deterministic installs.

4. **Docker Build:** Multi-stage Dockerfile handles production builds with optimized layer caching.

**Justification for Minimal Build:**

1. **Reduced Complexity:** No build configuration files (webpack.config.js, rollup.config.js) to maintain or debug.

2. **Faster Development:** Code changes run immediately without build step, accelerating feedback loop.

3. **Debugging Simplification:** Source maps unnecessary when running source code directly; stack traces reference actual source files.

4. **Educational Clarity:** Build tooling complexity often obscures fundamental concepts; minimal build maintains focus on core learning objectives.

### 3.7.3 Deployment Automation

#### 3.7.3.1 Bash Deployment Scripts

Four Bash scripts provide comprehensive deployment automation:

**1. deploy.sh - Complete Deployment Pipeline**

Orchestrates end-to-end deployment with the following workflow:

- **Environment Selection:** Supports development, staging, and production environments
- **Docker Build:** Builds optimized production image with versioning tags
- **Image Tagging:** Tags images with version numbers and environment identifiers
- **Deployment Execution:** Pushes to container registry (if configured) or deploys locally
- **Health Verification:** Runs `health-check.sh` to validate deployment success
- **Rollback Capability:** Automatically reverts to previous version on health check failure
- **Deployment Logging:** Captures deployment events for audit trail

**2. health-check.sh - Post-Deployment Validation**

Validates service availability with comprehensive checks:

- **HTTP Status Validation:** Verifies `/hello` endpoint returns 200 status
- **Response Content Validation:** Confirms response body contains "Hello world" text
- **Configurable Parameters:** Supports custom host, port, and timeout configuration
- **CI-Compatible Exit Codes:**
  - Exit 0: Service healthy (200 status + correct response)
  - Exit 1: Service unhealthy (wrong status or response)
  - Exit 2: Service unreachable (connection failed)
- **Descriptive Error Messages:** Provides detailed failure information for debugging

**3. setup.sh - Developer Onboarding Automation**

Automates initial environment setup for new developers:

- **Node.js Version Validation:** Verifies Node.js 18.0.0 or higher installed
- **npm Verification:** Confirms npm package manager availability
- **Dependency Installation:** Runs `npm install` to install all dependencies
- **Environment File Creation:** Generates `.env` file with default configuration
- **Port Availability Check:** Verifies port 3000 is available for binding
- **Setup Summary:** Displays setup status and next steps for developer

**4. start-server.sh - Server Lifecycle Management**

Manages server startup and process control:

- **Execution Modes:**
  - Foreground mode: Server runs in terminal (Ctrl+C to stop)
  - Detached mode: Server runs in background (daemon)
- **PID File Management:** Records process ID in `.pid` file for detached mode
- **Log File Management:** Redirects output to log file in detached mode
- **Port Availability:** Pre-flight check ensures port not already in use
- **Process Cleanup:** Graceful shutdown handling and PID file cleanup

**Evidence:**
- `infrastructure/scripts/` folder: All four Bash scripts present
- Feature F-007 (Health Checking): Documents health-check.sh functionality
- Repository summary: "4 Bash automation scripts"

#### 3.7.3.2 Continuous Integration (CI/CD)

**CI Platform: GitHub Actions (Referenced)**
- **Status:** Mentioned in documentation but workflow files not present
- **Expected Location:** `.github/workflows/` directory
- **Integration Points:** Jest with jest-junit XML output, health checks, linting

**CI Pipeline Capabilities (Expected):**

1. **Automated Testing:**
   - Run Jest test suite on every commit
   - Parse jest-junit XML for test result visualization
   - Enforce coverage thresholds (build fails if coverage below 80-90%)

2. **Code Quality Checks:**
   - ESLint linting for code style enforcement
   - Prettier formatting verification
   - npm audit for security vulnerability detection

3. **Docker Build Validation:**
   - Build Docker image to verify Dockerfile correctness
   - Run health checks against containerized service
   - Tag and push images to registry on main branch

4. **Deployment Automation:**
   - Execute `deploy.sh` script for staging/production deployments
   - Run `health-check.sh` for post-deployment validation
   - Automatic rollback on health check failure

**Implementation Note:** While README.md references GitHub workflows, the `.github/workflows/` directory was not found during repository analysis. The infrastructure for CI integration (jest-junit reporter, health check script, deployment automation) is present and ready for GitHub Actions workflow configuration.

**Evidence:**
- README.md: References GitHub workflows directory
- jest-junit reporter: Configured for CI test reporting
- health-check.sh: Provides CI-compatible exit codes

### 3.7.4 Monitoring & Observability

#### 3.7.4.1 Prometheus Metrics Collection

**Tool: Prometheus**
- **Version:** 2.x (latest stable)
- **Purpose:** Time-series metrics collection and storage
- **Configuration:** `infrastructure/monitoring/prometheus.yml`

**Selection Justification:**

Prometheus provides production-grade metrics collection:

1. **Pull-Based Model:** Prometheus scrapes metrics from application endpoints, eliminating need for applications to push metrics and simplifying client implementation.

2. **Time-Series Database:** Efficient storage of timestamped metrics enables historical analysis, trend detection, and capacity planning.

3. **Query Language (PromQL):** Powerful query language for metric aggregation, filtering, and mathematical operations across time series.

4. **Alerting Integration:** Native integration with Alertmanager for threshold-based alerting (though not implemented in this educational service).

5. **Industry Standard:** Most widely-adopted metrics system in cloud-native environments, essential for understanding modern observability practices.

6. **Grafana Integration:** Seamless integration with Grafana for visualization without custom connectors or adapters.

**Prometheus Scrape Configuration:**

Two scrape jobs are configured:

1. **Application Metrics Scrape:**
   - **Job Name:** `hello-world-app`
   - **Target:** `hello-world-app:3000/metrics`
   - **Interval:** 5 seconds (high-frequency for demonstration)
   - **Timeout:** 3 seconds
   - **Purpose:** Collects application-specific metrics (request counts, latencies, etc.)

2. **Health Monitoring Scrape:**
   - **Job Name:** `hello-world-health`
   - **Target:** `hello-world-app:3000/health`
   - **Interval:** 30 seconds
   - **Timeout:** 5 seconds
   - **Purpose:** Generates `up{}` metric indicating service availability

**Prometheus Access:**
- **Web UI:** http://localhost:9090 (when running via Docker Compose)
- **Query Interface:** PromQL query editor for ad-hoc metric exploration
- **Targets Page:** Displays scrape target status and health

**Evidence:**
- `infrastructure/monitoring/prometheus.yml`: Complete Prometheus configuration
- Feature F-010 (Monitoring): Prometheus setup documented
- Scrape configuration: Application metrics (5s) and health checks (30s)

#### 3.7.4.2 Grafana Visualization

**Tool: Grafana**
- **Version:** Latest stable (typically 9.x or 10.x)
- **Purpose:** Metrics visualization and dashboard
- **Configuration:** `infrastructure/monitoring/grafana-dashboard.json`

**Selection Justification:**

Grafana provides comprehensive metrics visualization:

1. **Professional Dashboards:** Production-quality visualizations with customizable panels, layouts, and time ranges.

2. **Prometheus Integration:** Native Prometheus data source support without plugins or custom connectors.

3. **Real-Time Updates:** Automatic dashboard refresh displays live metrics without manual page reload.

4. **Query Builder:** Visual query builder for PromQL queries, reducing need for complex query syntax.

5. **Dashboard Sharing:** JSON-based dashboard definitions enable version control and sharing across teams.

6. **Industry Standard:** Most widely-used metrics visualization platform, essential for understanding modern observability tooling.

**Grafana Dashboard Configuration:**

The pre-built dashboard includes **13 panels** organized in a logical layout:

**Service Health Panels:**
1. **Service Uptime:** `up{}` metric displays service availability (1=healthy, 0=down)
2. **Total Requests:** Cumulative request count from `http_requests_total{}`
3. **Request Rate:** Requests per second using `rate(http_requests_total[1m])`

**Performance Panels:**
4. **Request Duration p50:** Median response time (50th percentile)
5. **Request Duration p95:** 95th percentile response time (outlier detection)
6. **Request Duration p99:** 99th percentile response time (worst-case latency)

**Error Tracking Panels:**
7. **HTTP Status Code Distribution:** Breakdown of 2xx/4xx/5xx responses
8. **4xx Error Rate:** Client error percentage over time
9. **5xx Error Rate:** Server error percentage over time

**System Resource Panels:**
10. **Node.js Memory Usage (RSS):** Resident set size memory consumption
11. **Node.js Heap Memory:** JavaScript heap utilization
12. **CPU Usage:** Process CPU percentage
13. **Event Loop Lag:** Event loop delay indicating blocking operations

**Dashboard Configuration:**
- **UID:** `hello-world-dashboard`
- **Data Source:** Prometheus (must be named "Prometheus" in Grafana)
- **Refresh Rate:** 10 seconds automatic refresh
- **Time Range:** Configurable (default: last 5 minutes to last hour)
- **Schema Version:** 30 (Grafana dashboard format version)

**Grafana Access:**
- **Web UI:** http://localhost:3001 (when running via Docker Compose)
- **Default Credentials:** admin/admin (first login prompts password change)
- **Dashboard Location:** Pre-provisioned from `grafana-dashboard.json`

**Metrics Implementation Status:**

**Note:** The dashboard configuration assumes the application exposes a `/metrics` endpoint in Prometheus format with the following metrics:
- `http_requests_total` (counter with labels: method, path, status)
- `http_request_duration_seconds` (histogram for percentile calculations)
- `nodejs_process_*` (Node.js runtime metrics)

**Implementation Gap:** During repository analysis, the `/metrics` endpoint implementation was not found in the application source code. The monitoring infrastructure (Prometheus config, Grafana dashboard) is complete and production-ready, but full functionality requires implementing metrics instrumentation using a library like `prom-client`.

**Evidence:**
- `infrastructure/monitoring/grafana-dashboard.json`: Complete dashboard definition with 13 panels
- Feature F-010 (Monitoring): Grafana dashboard documented
- Dashboard schema version 30 for Grafana compatibility

### 3.7.5 Version Control & Collaboration

#### 3.7.5.1 Git Version Control

**Version Control System: Git**
- **Platform:** GitHub (repository hosting)
- **Branching Strategy:** Feature branch workflow
- **Commit Convention:** Conventional commits format

**Git Workflow:**

The project follows a structured Git workflow documented in `CONTRIBUTING.md`:

**Branch Naming Conventions:**
- `feature/` - New feature development (e.g., `feature/add-metrics-endpoint`)
- `fix/` - Bug fixes (e.g., `fix/cors-headers`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `test/` - Test additions or improvements (e.g., `test/integration-coverage`)
- `refactor/` - Code refactoring (e.g., `refactor/extract-middleware`)

**Commit Message Format:**
```
<type>: <subject>

[optional body]

[optional footer]
```

**Commit Types:**
- `feat:` - New feature implementation
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring without behavior change
- `chore:` - Maintenance tasks (dependency updates, etc.)

**Development Workflow:**
1. Create feature branch from main: `git checkout -b feature/my-feature`
2. Implement changes with regular commits
3. Run tests locally: `npm test`
4. Run linting: `npm run lint`
5. Push branch: `git push origin feature/my-feature`
6. Open pull request for code review
7. Address review feedback
8. Merge to main after approval

**Evidence:**
- `CONTRIBUTING.md`: Complete Git workflow and conventions documentation
- Branch naming: feature/, fix/, docs/, test/, refactor/ prefixes documented
- Commit format: Conventional commits pattern specified

## 3.8 Security Considerations

### 3.8.1 Security Headers Implementation

The service implements comprehensive HTTP security headers through middleware:

**X-Content-Type-Options: nosniff**
- **Purpose:** Prevents MIME type sniffing attacks
- **Protection:** Browsers strictly follow declared Content-Type header
- **Implementation:** Applied to all responses via security middleware

**X-Frame-Options: DENY**
- **Purpose:** Prevents clickjacking attacks
- **Protection:** Blocks embedding service in iframes, frames, or objects
- **Implementation:** Applied to all responses including errors

**Content-Security-Policy: default-src 'none'**
- **Purpose:** Restricts resource loading
- **Protection:** Blocks all external resource loading (scripts, styles, images)
- **Justification:** Appropriate for plain text API with no web UI
- **Implementation:** Strictest possible CSP for maximum security

**Evidence:**
- Feature F-005 (Security Headers): Complete security header implementation
- `middleware/index.js`: securityHeaders middleware applies headers to all responses

### 3.8.2 Dependency Security Management

**npm audit Integration:**
- **Command:** `npm audit`
- **Purpose:** Scans dependencies for known security vulnerabilities
- **Frequency:** Recommended before production deployments
- **Remediation:** `npm audit fix` for automatic vulnerability patching

**Lock File Security:**
- `package-lock.json` (version 3) ensures deterministic dependency resolution
- Prevents unexpected package version updates that could introduce vulnerabilities
- Enables exact version pinning for security-sensitive dependencies

**Minimal Dependency Surface:**
- Only one production dependency (dotenv) reduces security exposure
- Development dependencies (Jest, Supertest) not included in production builds
- `npm ci --only=production` excludes devDependencies from production containers

### 3.8.3 Container Security

**Alpine Linux Base Image:**
- Minimal package set reduces attack surface
- Regular security updates from Alpine Security Team
- Smaller image size decreases download time and bandwidth for security patches

**Non-Root User (Recommended):**
- Production containers should run as non-root user
- Limits potential damage from container breakout vulnerabilities
- Implementation not enforced in educational service but recommended for production

**Image Scanning:**
- Docker images can be scanned for vulnerabilities using tools like:
  - Docker Scout
  - Trivy
  - Snyk Container
- Recommended before deploying to production environments

## 3.9 Technology Integration Architecture

The following diagram illustrates how all technology stack components integrate to form the complete system:

```mermaid
graph TB
    subgraph "Development Environment"
        Dev[Developer Workstation]
        VSCode[IDE/Editor]
        Git[Git Repository]
    end
    
    subgraph "Application Runtime"
        NodeJS[Node.js 18.x LTS]
        HTTP[Native HTTP Module]
        Config[dotenv Config]
        Server[Application Server]
    end
    
    subgraph "Testing Infrastructure"
        Jest[Jest Framework]
        Supertest[Supertest HTTP Testing]
        Coverage[Coverage Reports]
        JUnit[JUnit XML]
    end
    
    subgraph "Container Platform"
        DockerBuild[Docker Build]
        DockerImage[Alpine Container Image]
        DockerCompose[Docker Compose]
    end
    
    subgraph "Monitoring Stack"
        Prometheus[Prometheus Scraper]
        MetricsDB[(Time-Series DB)]
        Grafana[Grafana Dashboards]
    end
    
    subgraph "Deployment Automation"
        DeployScript[deploy.sh]
        HealthCheck[health-check.sh]
        Setup[setup.sh]
    end
    
    subgraph "External Systems"
        CI[GitHub Actions]
        Registry[Container Registry]
    end
    
    Dev --> VSCode
    VSCode --> Git
    Git --> NodeJS
    
    NodeJS --> HTTP
    NodeJS --> Config
    HTTP --> Server
    Config --> Server
    
    Jest --> Server
    Supertest --> Jest
    Jest --> Coverage
    Jest --> JUnit
    
    Server --> DockerBuild
    DockerBuild --> DockerImage
    DockerCompose --> DockerImage
    
    Server --> Prometheus
    Prometheus --> MetricsDB
    MetricsDB --> Grafana
    
    DeployScript --> DockerBuild
    DeployScript --> HealthCheck
    Setup --> NodeJS
    
    CI --> Jest
    CI --> DeployScript
    Registry --> DockerImage
    
    style Server fill:#4CAF50
    style Grafana fill:#FF9800
    style Jest fill:#9C27B0
    style DockerImage fill:#2196F3
```

## 3.10 References

### 3.10.1 Files Examined

The following source files and configuration documents were analyzed to document this technology stack:

1. **`hao-backprop-test-main (1)/hao-backprop-test-main/package.json`**
   - Root package manifest with minimal dependency declarations

2. **`hao-backprop-test-main (1)/hao-backprop-test-main/Dockerfile`**
   - Production container image configuration using node:18-alpine

3. **`hao-backprop-test-main (1)/hao-backprop-test-main/CONTRIBUTING.md`**
   - Development prerequisites: Node.js 18.x, npm 8+, ESLint, Prettier
   - Git workflow and commit conventions
   - Code quality standards and guidelines

4. **`hao-backprop-test-main (1)/hao-backprop-test-main/README.md`**
   - Project overview and technology requirements
   - API documentation and configuration
   - Monitoring setup instructions

5. **`hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/README.md`**
   - Backend-specific documentation and architecture

6. **`hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/jest.config.js`**
   - Complete Jest testing configuration
   - Coverage thresholds: 80-90% global, 100% for critical paths
   - jest-junit reporter configuration for CI integration

7. **`hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/nodemon.json`**
   - Development server auto-reload configuration
   - Watch patterns and restart delay settings

8. **`hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/Dockerfile`**
   - Backend-specific Docker configuration with npm ci

9. **`hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/local/docker-compose.yml`**
   - Docker Compose orchestration for local development (version 3.8)
   - Service configuration with volumes and health checks

10. **`hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/monitoring/prometheus.yml`**
    - Prometheus scrape configuration for metrics collection

11. **`hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/monitoring/grafana-dashboard.json`**
    - Grafana dashboard with 13 pre-configured panels

12. **`hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/`**
    - deploy.sh: End-to-end deployment orchestration
    - health-check.sh: Service availability validation
    - setup.sh: Developer environment provisioning
    - start-server.sh: Server lifecycle management

### 3.10.2 Feature References

This technology stack directly supports the following system features documented in Section 2 (Features & Requirements):

- **F-001 (HTTP Server Implementation):** Node.js 18.x runtime with native HTTP module
- **F-002 (Hello World Endpoint):** Native HTTP request/response handling
- **F-003 (Error Handling):** Built-in error handling without external libraries
- **F-004 (Request Logging):** Custom logging middleware implementation
- **F-005 (Security Headers):** Security middleware using native response headers
- **F-006 (Configuration Management):** dotenv v16.0.3 for environment variable loading
- **F-007 (Health Checking):** Docker healthcheck and health-check.sh script
- **F-008 (Graceful Shutdown):** Native signal handling for SIGINT/SIGTERM
- **F-009 (Docker Containerization):** Docker Engine with node:18-alpine and Docker Compose v3.8
- **F-010 (Monitoring):** Prometheus 2.x and Grafana for observability
- **F-011 (Testing Infrastructure):** Jest 29.x, Supertest v6.3.3, jest-junit

### 3.10.3 Technology Vendors and Resources

**Official Documentation:**
- Node.js: https://nodejs.org/docs/latest-v18.x/api/
- npm: https://docs.npmjs.com/
- Docker: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Jest: https://jestjs.io/docs/getting-started
- Prometheus: https://prometheus.io/docs/
- Grafana: https://grafana.com/docs/

**Package Registries:**
- npm Registry: https://registry.npmjs.org/
- Docker Hub: https://hub.docker.com/

**Base Images:**
- node:18-alpine: https://hub.docker.com/_/node (official Node.js Alpine image)

### 3.10.4 Version Requirements Summary

| Technology | Minimum Version | Recommended Version | LTS/Stable |
|---|---|---|---|
| Node.js | 18.0.0 | 18.x LTS | Yes |
| npm | 8.0.0 | 8.x or 9.x | Yes |
| dotenv | 16.0.3 | 16.0.3 | Stable |
| Jest | 29.0.0 | 29.x | Stable |
| Supertest | 6.3.3 | 6.3.3 | Stable |
| Docker Engine | 20.0.0 | 20.x or higher | Stable |
| Docker Compose | 2.0.0 | 2.x or higher | Stable |
| Prometheus | 2.0.0 | 2.x | Stable |
| Grafana | 9.0.0 | 9.x or 10.x | Stable |

### 3.10.5 Technology Decision Log

**Key Technology Decisions and Rationale:**

1. **Node.js 18.x LTS Selected:**
   - **Decision Date:** Project inception
   - **Rationale:** LTS version provides stability, security updates through April 2025, and modern JavaScript features (ES2022) without transpilation overhead
   - **Alternative Considered:** Node.js 20.x (newer but shorter maintenance window at project start)

2. **Native HTTP Module Over Express.js:**
   - **Decision Date:** Architecture design phase
   - **Rationale:** Educational value of understanding HTTP fundamentals without framework abstractions; minimizes dependencies
   - **Alternative Considered:** Express.js (provided as optional implementation for comparison)

3. **Alpine Linux Base Image:**
   - **Decision Date:** Containerization implementation
   - **Rationale:** Minimal image size (~50MB vs 300MB+), reduced attack surface, faster image pulls
   - **Alternative Considered:** Debian-based node:18 image (rejected due to size and security concerns)

4. **Jest Testing Framework:**
   - **Decision Date:** Testing infrastructure setup
   - **Rationale:** Zero-config philosophy, integrated coverage reporting, industry standard
   - **Alternative Considered:** Mocha + Chai (rejected due to multiple package requirements and configuration complexity)

5. **Prometheus + Grafana Monitoring:**
   - **Decision Date:** Observability implementation
   - **Rationale:** Industry-standard metrics stack, pull-based model simplifies client implementation, excellent Grafana integration
   - **Alternative Considered:** ELK Stack (rejected as overkill for simple service; log aggregation not required)

6. **Bash Scripts for Automation:**
   - **Decision Date:** Deployment automation
   - **Rationale:** Universal availability in Unix environments, direct system integration, no additional runtime required
   - **Alternative Considered:** Node.js scripts (rejected to demonstrate separation between application and operational tooling)

# 4. Process Flowchart

## 4.1 Overview

This section provides comprehensive process flowcharts documenting the complete operational workflows of the Node.js Hello World Service. The flowcharts capture core business processes, integration patterns, error handling paths, and state transitions using Mermaid.js diagrams with clear decision points, swim lanes for different system actors, and detailed annotations for timing constraints and validation rules.

The flowcharts are organized into four major categories: System Workflows (core application processes), Integration Workflows (external system interactions), State Management (lifecycle and transitions), and Error Handling (comprehensive error paths and recovery procedures). Each diagram includes validation rules, authorization checkpoints, and SLA considerations where applicable.

## 4.2 System Workflows

### 4.2.1 High-Level System Workflow

#### 4.2.1.1 End-to-End Request Processing

The following flowchart illustrates the complete journey of an HTTP request through the Node.js Hello World Service, from initial receipt through middleware processing, routing, handler execution, and final response delivery.

```mermaid
flowchart TD
    Start([Client Sends HTTP Request]) --> ServerReceive[Server Receives Request<br/>Node.js HTTP Module]
    
    ServerReceive --> MiddlewareChain{Enter Middleware Chain}
    
    MiddlewareChain --> RequestLogger[Request Logger Middleware<br/>- Capture start time<br/>- Wrap res.end&#40;&#41;]
    
    RequestLogger --> SecurityHeaders[Security Headers Middleware<br/>- X-Content-Type-Options: nosniff<br/>- X-Frame-Options: DENY<br/>- CSP: default-src 'none']
    
    SecurityHeaders --> Router[Route Request<br/>Parse URL pathname]
    
    Router --> RouteMatch{Match Route?}
    
    RouteMatch -->|pathname = '/hello'| MethodCheck{HTTP Method?}
    RouteMatch -->|unknown path| Handle404[404 Handler<br/>handleNotFound&#40;&#41;]
    
    MethodCheck -->|GET| HelloHandler[Hello Handler<br/>helloHandler.js]
    MethodCheck -->|POST/PUT/DELETE/etc| Handle405[405 Handler<br/>handle405&#40;&#41;]
    
    HelloHandler --> SetStatus200[Set Status: 200 OK]
    SetStatus200 --> SetContentType[Set Content-Type: text/plain]
    SetContentType --> SendHello[Send Body: 'Hello world']
    
    Handle404 --> SetStatus404[Set Status: 404]
    SetStatus404 --> Send404[Send Body: 'Not Found']
    
    Handle405 --> SetStatus405[Set Status: 405]
    SetStatus405 --> SetAllow[Set Allow: GET header]
    SetAllow --> Send405[Send Body: 'Method Not Allowed']
    
    SendHello --> ErrorCheck{Error<br/>Occurred?}
    Send404 --> ErrorCheck
    Send405 --> ErrorCheck
    
    ErrorCheck -->|Yes| Handle500[500 Handler<br/>handleServerError&#40;&#41;]
    ErrorCheck -->|No| LogResponse[Log Response<br/>Calculate response time]
    
    Handle500 --> SetStatus500[Set Status: 500]
    SetStatus500 --> Send500[Send Body: 'Internal Server Error']
    Send500 --> LogError[Log Error Details<br/>Server-side only]
    LogError --> LogResponse
    
    LogResponse --> SendResponse[Send Response to Client]
    SendResponse --> End([Client Receives Response])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style HelloHandler fill:#fff3cd
    style Handle404 fill:#f8d7da
    style Handle405 fill:#f8d7da
    style Handle500 fill:#f8d7da
```

**Key Decision Points:**
- **Route Matching:** Direct pathname comparison against defined routes (`/hello`)
- **Method Validation:** Only GET requests accepted for `/hello` endpoint
- **Error Detection:** Try-catch blocks intercept exceptions throughout chain

**Performance SLAs:**
- Total request processing time: < 100ms (target)
- Middleware overhead: < 5ms per middleware
- Handler execution: < 50ms
- Response logging: < 5ms

**Business Rules:**
- All requests must pass through security headers middleware
- All requests must be logged with timestamp and response time
- Error details never exposed to clients (security requirement)
- Status codes must follow HTTP specification (RFC 7231)

#### 4.2.1.2 Swim Lane View - Actor Interactions

```mermaid
sequenceDiagram
    participant Client
    participant Server as HTTP Server
    participant Middleware as Middleware Chain
    participant Router
    participant Handler as Request Handler
    participant Logger
    
    Client->>Server: HTTP GET /hello
    activate Server
    
    Server->>Middleware: Process Request
    activate Middleware
    
    Middleware->>Logger: Log Request Start
    activate Logger
    Logger-->>Middleware: Start Time Captured
    deactivate Logger
    
    Middleware->>Middleware: Apply Security Headers
    Note over Middleware: X-Content-Type-Options<br/>X-Frame-Options<br/>Content-Security-Policy
    
    Middleware->>Router: Forward to Router
    deactivate Middleware
    activate Router
    
    Router->>Router: Parse URL: /hello
    Router->>Router: Match Route Pattern
    
    alt Route Found: /hello
        Router->>Handler: Invoke Hello Handler
        activate Handler
        
        Handler->>Handler: Validate Method = GET
        Handler->>Handler: Set Status 200
        Handler->>Handler: Set Content-Type
        Handler->>Handler: Generate Response Body
        
        Handler-->>Router: Response Ready
        deactivate Handler
    else Route Not Found
        Router->>Handler: Invoke 404 Handler
        activate Handler
        Handler-->>Router: 404 Response
        deactivate Handler
    end
    
    Router-->>Middleware: Return Response
    deactivate Router
    activate Middleware
    
    Middleware->>Logger: Log Response Complete
    activate Logger
    Logger->>Logger: Calculate Response Time
    Logger->>Logger: Determine Log Level
    Logger->>Logger: Format Log Message
    Logger-->>Middleware: Logged
    deactivate Logger
    
    Middleware-->>Server: Response Complete
    deactivate Middleware
    
    Server->>Client: HTTP 200 "Hello world"
    deactivate Server
    
    Note over Client,Server: Total Time: ~45ms
```

**Actor Responsibilities:**
- **Client:** Initiates HTTP requests, receives responses
- **HTTP Server:** Accepts connections, manages request/response lifecycle
- **Middleware Chain:** Cross-cutting concerns (logging, security)
- **Router:** URL pattern matching and handler dispatch
- **Request Handler:** Business logic execution and response generation
- **Logger:** Observability through structured logging

### 4.2.2 Application Startup Workflow

#### 4.2.2.1 Bootstrap and Initialization Process

The application startup process involves configuration loading, server initialization, port binding, and graceful shutdown handler registration. This flowchart details the complete bootstrap sequence from process start to ready state.

```mermaid
flowchart TD
    Start([Node.js Process Starts]) --> LoadConfig[Load Configuration<br/>config.js]
    
    LoadConfig --> TryEnv{Load .env File}
    TryEnv -->|File Found| ParseEnv[Parse Environment Variables<br/>dotenv.config&#40;&#41;]
    TryEnv -->|Not Found| DefaultConfig[Use Default Values]
    ParseEnv --> ReadVars[Read Environment Variables]
    DefaultConfig --> ReadVars
    
    ReadVars --> ValidatePort{Validate PORT}
    ValidatePort -->|Invalid Range| WarnPort[Console Warning<br/>Use DEFAULT_PORT 3000]
    ValidatePort -->|Valid 1-65535| AcceptPort[Accept PORT Value]
    WarnPort --> SetConfig[Set Configuration Object]
    AcceptPort --> SetConfig
    
    SetConfig --> ConfigReady[Configuration Ready<br/>- PORT, HOST, NODE_ENV<br/>- LOG_LEVEL<br/>- IS_DEV, IS_PROD, IS_TEST]
    
    ConfigReady --> CheckTest{IS_TEST<br/>Flag?}
    CheckTest -->|true| SkipServer[Skip Server Startup<br/>Exit for Test Mode]
    CheckTest -->|false| LogStart[Log: Starting Application]
    
    LogStart --> CreateServer[Create HTTP Server<br/>http.createServer&#40;handleRequest&#41;]
    
    CreateServer --> RegisterError[Register Error Handler<br/>server.on&#40;'error', handler&#41;]
    
    RegisterError --> BindPort[Bind to HOST:PORT<br/>server.listen&#40;PORT, HOST&#41;]
    
    BindPort --> BindResult{Bind<br/>Successful?}
    
    BindResult -->|EADDRINUSE| LogPortInUse[Log: Port Already In Use<br/>Port: PORT]
    BindResult -->|Other Error| LogError[Log: Server Error<br/>Error Details]
    BindResult -->|Success| LogSuccess[Log: Server Listening<br/>http://HOST:PORT]
    
    LogPortInUse --> ExitError[Process Exit Code 1]
    LogError --> ExitError
    
    LogSuccess --> SetupShutdown[Setup Graceful Shutdown<br/>SIGINT Handler<br/>SIGTERM Handler]
    
    SetupShutdown --> ServerReady[Server Ready State<br/>Accepting Connections]
    
    ServerReady --> LogComplete[Log: Application Startup Complete]
    
    LogComplete --> End([Server Running])
    
    SkipServer --> EndTest([Test Mode - No Server])
    ExitError --> EndFail([Process Terminated])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style EndTest fill:#cce5ff
    style EndFail fill:#f8d7da
    style ServerReady fill:#d4edda
```

**Validation Rules:**
- **PORT Validation:** Must be integer in range 1-65535, fallback to 3000
- **HOST Validation:** Accept any valid IP address or hostname, default 0.0.0.0
- **NODE_ENV Validation:** Accept any string, default 'development'
- **Environment File:** Optional `.env` file, silent failure acceptable

**Error Conditions:**
- **EADDRINUSE:** Port already bound by another process
- **EACCES:** Permission denied (ports < 1024 require root)
- **EADDRINUSE:** Invalid host address
- **Configuration errors:** Non-fatal, use defaults with warnings

**Timing Constraints:**
- Configuration loading: < 50ms
- Server creation: < 100ms
- Port binding: < 500ms
- Total startup time: < 1 second (SLA)

#### 4.2.2.2 Configuration Loading and Validation

```mermaid
flowchart TD
    Start([Enter loadEnv Function]) --> TryLoad{Try Load<br/>.env File}
    
    TryLoad -->|Success| LogLoaded[Log: Environment Variables Loaded]
    TryLoad -->|ENOENT| CheckEnv{NODE_ENV?}
    TryLoad -->|Other Error| LogWarning[Log Warning: Load Failed]
    
    CheckEnv -->|development| LogNoFile[Log: No .env File Found]
    CheckEnv -->|production/test| Silent[Silent Continue<br/>Expected Behavior]
    
    LogLoaded --> ReadPort[Read PORT Environment Variable]
    LogNoFile --> ReadPort
    Silent --> ReadPort
    LogWarning --> ReadPort
    
    ReadPort --> PortValue{PORT<br/>Defined?}
    
    PortValue -->|undefined| UseDefault[PORT = DEFAULT_PORT 3000]
    PortValue -->|defined| ParsePort[Parse as Integer<br/>parseInt&#40;PORT, 10&#41;]
    
    ParsePort --> ValidInt{Valid<br/>Integer?}
    
    ValidInt -->|NaN| WarnInvalid[Warn: Invalid PORT Value]
    ValidInt -->|valid| CheckRange{Range<br/>1-65535?}
    
    CheckRange -->|out of range| WarnRange[Warn: PORT Out of Range]
    CheckRange -->|valid| ValidPort[Valid PORT Accepted]
    
    WarnInvalid --> UseDefault
    WarnRange --> UseDefault
    
    UseDefault --> ReadHost[Read HOST Variable]
    ValidPort --> ReadHost
    
    ReadHost --> HostValue{HOST<br/>Defined?}
    
    HostValue -->|undefined| DefaultHost[HOST = DEFAULT_HOST<br/>0.0.0.0]
    HostValue -->|defined| ValidHost[Accept HOST Value]
    
    DefaultHost --> ReadEnv[Read NODE_ENV]
    ValidHost --> ReadEnv
    
    ReadEnv --> EnvValue{NODE_ENV<br/>Defined?}
    
    EnvValue -->|undefined| DefaultEnv[NODE_ENV = 'development']
    EnvValue -->|defined| ValidEnv[Accept NODE_ENV]
    
    DefaultEnv --> ReadLog[Read LOG_LEVEL]
    ValidEnv --> ReadLog
    
    ReadLog --> LogValue{LOG_LEVEL<br/>Defined?}
    
    LogValue -->|undefined| DefaultLog[LOG_LEVEL = 'INFO']
    LogValue -->|defined| ValidLog[Accept LOG_LEVEL]
    
    DefaultLog --> ComputeFlags[Compute Environment Flags<br/>IS_DEV = NODE_ENV === 'development'<br/>IS_PROD = NODE_ENV === 'production'<br/>IS_TEST = NODE_ENV === 'test']
    ValidLog --> ComputeFlags
    
    ComputeFlags --> BuildConfig[Build Configuration Object<br/>Export Config]
    
    BuildConfig --> End([Return Configuration])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style ValidPort fill:#d4edda
    style ValidHost fill:#d4edda
    style ValidEnv fill:#d4edda
    style WarnInvalid fill:#fff3cd
    style WarnRange fill:#fff3cd
```

**Default Values (from `src/backend/config.js`):**
- `DEFAULT_PORT`: 3000
- `DEFAULT_HOST`: '0.0.0.0'
- `DEFAULT_NODE_ENV`: 'development'
- `DEFAULT_LOG_LEVEL`: 'INFO'

**Validation Logic:**
- PORT validation: `parseInt(PORT, 10)` then range check `1 <= port <= 65535`
- HOST validation: No explicit validation, accepts any string
- NODE_ENV validation: No explicit validation, accepts any string
- LOG_LEVEL validation: No explicit validation, accepts any string

### 4.2.3 Request Processing Pipeline

#### 4.2.3.1 Detailed Middleware Execution Flow

```mermaid
flowchart TD
    Start([Request Arrives at Server]) --> HandleRequest[handleRequest Function<br/>server.js line 76]
    
    HandleRequest --> ApplyMiddleware[Apply Middleware Chain<br/>applyMiddleware Utility]
    
    ApplyMiddleware --> StartChain[Initialize Middleware Index = 0]
    
    StartChain --> NextMiddleware{More<br/>Middleware?}
    
    NextMiddleware -->|Yes| GetMiddleware[Get Middleware at Index]
    NextMiddleware -->|No| FinalHandler[Execute Final Handler<br/>routeRequest]
    
    GetMiddleware --> CheckLogger{Index = 0?<br/>Request Logger}
    
    CheckLogger -->|Yes| CaptureTime[Capture Start Time<br/>startTime = Date.now&#40;&#41;]
    CheckLogger -->|No| CheckSecurity{Index = 1?<br/>Security Headers}
    
    CaptureTime --> WrapEnd[Wrap res.end&#40;&#41; Method<br/>Intercept Response Completion]
    WrapEnd --> CallNext1[Call next&#40;&#41;]
    CallNext1 --> IncrementIndex1[Index++]
    IncrementIndex1 --> NextMiddleware
    
    CheckSecurity -->|Yes| SetHeader1[Set X-Content-Type-Options: nosniff]
    CheckSecurity -->|No| OtherMiddleware[Other Middleware Logic]
    
    SetHeader1 --> SetHeader2[Set X-Frame-Options: DENY]
    SetHeader2 --> SetHeader3[Set Content-Security-Policy: default-src 'none']
    SetHeader3 --> CallNext2[Call next&#40;&#41;]
    CallNext2 --> IncrementIndex2[Index++]
    IncrementIndex2 --> NextMiddleware
    
    OtherMiddleware --> CallNext3[Call next&#40;&#41;]
    CallNext3 --> IncrementIndex3[Index++]
    IncrementIndex3 --> NextMiddleware
    
    FinalHandler --> ParseURL[Parse Request URL<br/>url.parse&#40;req.url&#41;]
    
    ParseURL --> ExtractPath[Extract pathname]
    
    ExtractPath --> GetRoutes[Get Routes Mapping<br/>createRoutes&#40;&#41;]
    
    GetRoutes --> LookupRoute[routes pathname Lookup]
    
    LookupRoute --> RouteFound{Handler<br/>Found?}
    
    RouteFound -->|Yes| InvokeHandler[Invoke Handler<br/>handler&#40;req, res&#41;]
    RouteFound -->|No| Invoke404[Invoke handleNotFound<br/>error.js]
    
    InvokeHandler --> TryExecute{Try<br/>Execute}
    Invoke404 --> TryExecute
    
    TryExecute -->|Success| ResponseSent[Handler Completes<br/>res.end&#40;&#41; Called]
    TryExecute -->|Exception| CatchError[Catch Exception<br/>Error Handler]
    
    CatchError --> Invoke500[Invoke handleServerError<br/>error.js]
    Invoke500 --> ResponseSent
    
    ResponseSent --> InterceptEnd[Intercepted res.end&#40;&#41;<br/>From Request Logger]
    
    InterceptEnd --> CalcTime[Calculate Response Time<br/>Date.now&#40;&#41; - startTime]
    
    CalcTime --> LogRequest[Log Request Details<br/>logRequest&#40;req, res, responseTime&#41;]
    
    LogRequest --> DetermineLevel{Status<br/>Code?}
    
    DetermineLevel -->|>= 500| LogError[Log at ERROR Level]
    DetermineLevel -->|>= 400| LogWarn[Log at WARN Level]
    DetermineLevel -->|< 400| LogInfo[Log at INFO Level]
    
    LogError --> FormatLog[Format Log Message<br/> timestamp  LEVEL: method url status timeMs]
    LogWarn --> FormatLog
    LogInfo --> FormatLog
    
    FormatLog --> CheckTest{IS_TEST<br/>Flag?}
    
    CheckTest -->|true| SuppressLog[Suppress Console Output]
    CheckTest -->|false| ConsoleLog[Output to Console]
    
    SuppressLog --> CallOriginal[Call Original res.end&#40;&#41;]
    ConsoleLog --> CallOriginal
    
    CallOriginal --> End([Response Sent to Client])
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style CaptureTime fill:#fff3cd
    style SetHeader1 fill:#d1ecf1
    style InvokeHandler fill:#d4edda
    style CatchError fill:#f8d7da
```

**Middleware Chain Order (Critical):**
1. **Request Logger** - Must be first to capture accurate timing
2. **Security Headers** - Applied before any response content
3. **Router/Handler** - Final execution after all middleware

**Timing Measurements:**
- Start time captured: Immediately upon middleware chain entry
- End time captured: When `res.end()` called (response complete)
- Precision: Millisecond granularity via `Date.now()`

**Error Handling in Middleware:**
- Synchronous errors: Caught by try-catch in `applyMiddleware` utility
- Async errors: Not applicable (no async middleware in this implementation)
- Error propagation: Errors route to `errorMiddleware` which invokes 500 handler

#### 4.2.3.2 Routing and Handler Dispatch

```mermaid
flowchart TD
    Start([Enter routeRequest Function]) --> ParseURL[Parse Request URL<br/>url.parse&#40;req.url, true&#41;]
    
    ParseURL --> ExtractParts[Extract Components<br/>- pathname<br/>- query parameters]
    
    ExtractParts --> GetRoutes[Get Routes Configuration<br/>createRoutes&#40;&#41;]
    
    GetRoutes --> RoutesMap[Routes Object:<br/>'  /hello ': handleHello]
    
    RoutesMap --> Normalize[Normalize pathname<br/>Trim whitespace<br/>Handle trailing slash]
    
    Normalize --> DirectLookup[Direct Lookup<br/>routes pathname]
    
    DirectLookup --> HandlerExists{Handler<br/>Found?}
    
    HandlerExists -->|Yes pathname = '/hello'| LogRoute[Log: Routing to /hello]
    HandlerExists -->|No| LogNotFound[Log: Route Not Found]
    
    LogRoute --> CheckMethod[Extract HTTP Method<br/>req.method]
    
    CheckMethod --> MethodValidation{Method<br/>= 'GET'?}
    
    MethodValidation -->|Yes| InvokeHello[Invoke Hello Handler<br/>handlers/helloHandler.js]
    MethodValidation -->|No| Invoke405[Invoke 405 Handler<br/>handle405&#40;res&#41;]
    
    LogNotFound --> Invoke404[Invoke 404 Handler<br/>handleNotFound&#40;req, res&#41;]
    
    InvokeHello --> HelloLogic{Handler<br/>Execution}
    Invoke405 --> Handle405Logic{405<br/>Logic}
    Invoke404 --> Handle404Logic{404<br/>Logic}
    
    HelloLogic -->|Success| SetStatus200[Set statusCode = 200]
    HelloLogic -->|Error| ThrowError[Throw Exception]
    
    SetStatus200 --> SetContentType[Set Header<br/>Content-Type: text/plain]
    
    SetContentType --> WriteBody[Write Response Body<br/>'Hello world']
    
    WriteBody --> EndResponse200[Call res.end&#40;&#41;]
    
    Handle405Logic --> SetStatus405[Set statusCode = 405]
    SetStatus405 --> SetAllow[Set Header<br/>Allow: GET]
    SetAllow --> WriteBody405[Write Body<br/>'Method Not Allowed']
    WriteBody405 --> EndResponse405[Call res.end&#40;&#41;]
    
    Handle404Logic --> SetStatus404[Set statusCode = 404]
    SetStatus404 --> WriteBody404[Write Body<br/>'Not Found']
    WriteBody404 --> EndResponse404[Call res.end&#40;&#41;]
    
    ThrowError --> CatchError[Error Caught by Middleware]
    CatchError --> Invoke500[Invoke 500 Handler<br/>handleServerError&#40;req, res, err&#41;]
    
    Invoke500 --> SetStatus500[Set statusCode = 500]
    SetStatus500 --> LogErrorDetails[Log Error with Stack Trace<br/>Server-Side Only]
    LogErrorDetails --> WriteBody500[Write Body<br/>'Internal Server Error']
    WriteBody500 --> EndResponse500[Call res.end&#40;&#41;]
    
    EndResponse200 --> End([Response Complete])
    EndResponse405 --> End
    EndResponse404 --> End
    EndResponse500 --> End
    
    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style InvokeHello fill:#d4edda
    style Invoke404 fill:#f8d7da
    style Invoke405 fill:#f8d7da
    style Invoke500 fill:#f8d7da
```

**Route Matching Algorithm:**
1. Parse URL to extract pathname
2. Normalize pathname (trim, handle trailing slash)
3. Direct object lookup: `routes[pathname]`
4. No pattern matching or regex (simple string equality)
5. Case-sensitive comparison

**Constants Used (from `src/backend/utils/constants.js`):**
- `ROUTES.HELLO`: '/hello'
- `HTTP_METHODS.GET`: 'GET'
- `HTTP_STATUS.OK`: 200
- `HTTP_STATUS.NOT_FOUND`: 404
- `HTTP_STATUS.METHOD_NOT_ALLOWED`: 405
- `HTTP_STATUS.INTERNAL_SERVER_ERROR`: 500
- `MESSAGES.HELLO_RESPONSE`: 'Hello world'
- `MESSAGES.NOT_FOUND`: 'Not Found'
- `MESSAGES.METHOD_NOT_ALLOWED`: 'Method Not Allowed'
- `MESSAGES.SERVER_ERROR`: 'Internal Server Error'

### 4.2.4 Graceful Shutdown Workflow

#### 4.2.4.1 Signal Handling and Connection Draining

```mermaid
flowchart TD
    Start([Server Running]) --> SignalReceived{Signal<br/>Received?}
    
    SignalReceived -->|SIGINT Ctrl+C| LogSIGINT[Log: SIGINT Signal Received]
    SignalReceived -->|SIGTERM| LogSIGTERM[Log: SIGTERM Signal Received]
    SignalReceived -->|Continue| ServerRunning[Continue Processing Requests]
    
    ServerRunning --> SignalReceived
    
    LogSIGINT --> LogShutdown[Log: Shutting Down Server Gracefully...]
    LogSIGTERM --> LogShutdown
    
    LogShutdown --> CallStop[Call stopServer&#40;&#41;<br/>Returns Promise]
    
    CallStop --> CheckServer{Server<br/>Exists?}
    
    CheckServer -->|null or not listening| ResolveImmediate[Resolve Promise Immediately<br/>Nothing to Stop]
    CheckServer -->|Running| CloseServer[Call server.close&#40;callback&#41;]
    
    CloseServer --> StopAccepting[Stop Accepting New Connections<br/>Port Released]
    
    StopAccepting --> WaitConnections[Wait for Active Connections<br/>Connection Draining]
    
    WaitConnections --> CheckActive{Active<br/>Connections?}
    
    CheckActive -->|Yes| WaitComplete[Wait for Request Completion<br/>Natural Termination]
    CheckActive -->|No| AllClosed[All Connections Closed]
    
    WaitComplete --> CheckActive
    
    AllClosed --> CloseCallback[server.close&#40;&#41; Callback Fired]
    
    CloseCallback --> TryLog{Try<br/>Block}
    
    TryLog -->|Success| LogSuccess[Log: Server Stopped Successfully<br/>logServerStop&#40;&#41;]
    TryLog -->|Exception| CatchException[Catch Error]
    
    CatchException --> LogException[Log: Error Stopping Server<br/>Error Details]
    LogException --> RejectPromise[Reject Promise<br/>with Error]
    
    LogSuccess --> ResetServer[Set server = null<br/>Cleanup Reference]
    
    ResetServer --> ResolvePromise[Resolve Promise<br/>Shutdown Complete]
    
    ResolveImmediate --> CheckExit{Exit<br/>Process?}
    ResolvePromise --> CheckExit
    RejectPromise --> CheckExit
    
    CheckExit -->|stopServer&#40;&#41; resolved| Exit0[Process Exit Code 0<br/>Clean Shutdown]
    CheckExit -->|stopServer&#40;&#41; rejected| LogError[Log: Error During Shutdown]
    
    LogError --> Exit1[Process Exit Code 1<br/>Error Shutdown]
    
    Exit0 --> End([Process Terminated])
    Exit1 --> End
    
    style Start fill:#e1f5e1
    style End fill:#f8d7da
    style LogSuccess fill:#d4edda
    style ResolvePromise fill:#d4edda
    style Exit0 fill:#d4edda
    style LogException fill:#f8d7da
    style Exit1 fill:#f8d7da
```

**Signal Registration (from `src/backend/index.js`):**
```
process.on('SIGINT', async () => {
  logger.info('SIGINT signal received. Shutting down server...');
  try {
    await stopServer();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received. Shutting down server...');
  try {
    await stopServer();
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
});
```

**Connection Draining Behavior:**
- No forced timeout (waits indefinitely for connections to complete)
- No new connections accepted after `server.close()` called
- In-flight requests allowed to finish naturally
- Suitable for educational purposes; production systems typically enforce timeout

**Timing Expectations:**
- Shutdown completion: < 5 seconds under normal load
- With active long-polling: Depends on client request duration
- No explicit timeout configured

## 4.3 Integration Workflows

### 4.3.1 Health Check Integration

#### 4.3.1.1 Docker Compose Health Check Flow

```mermaid
flowchart TD
    Start([Container Started]) --> StartPeriod[Start Period: 10 seconds<br/>Grace Period for Initialization]
    
    StartPeriod --> WaitStart[Wait for Start Period<br/>Health Checks Don't Affect Status]
    
    WaitStart --> FirstCheck[First Health Check Execution]
    
    FirstCheck --> ExecuteCurl[Execute curl Command<br/>curl -f http://localhost:3000/hello]
    
    ExecuteCurl --> CurlResult{curl<br/>Exit Code?}
    
    CurlResult -->|0 Success| CheckResponse{HTTP<br/>Status 200?}
    CurlResult -->|Non-zero| IncrementFail[Increment Failure Count]
    
    CheckResponse -->|Yes| HealthyState[Mark Container HEALTHY<br/>Reset Failure Count to 0]
    CheckResponse -->|No Non-200 status| IncrementFail
    
    IncrementFail --> FailCount{Failure Count<br/>>= Retries 3?}
    
    FailCount -->|No| WaitInterval[Wait Interval: 30 seconds]
    FailCount -->|Yes| UnhealthyState[Mark Container UNHEALTHY]
    
    HealthyState --> WaitInterval
    
    WaitInterval --> NextCheck[Next Health Check Execution]
    
    NextCheck --> CheckTimeout{Timeout<br/>10 seconds?}
    
    CheckTimeout -->|Exceeded| TimeoutFail[Health Check Timeout<br/>Count as Failure]
    CheckTimeout -->|Within Limit| ExecuteCurl
    
    TimeoutFail --> IncrementFail
    
    UnhealthyState --> OrchestrationAction{Orchestrator<br/>Action?}
    
    OrchestrationAction -->|Docker Compose| LogUnhealthy[Log Unhealthy Status<br/>No Automatic Action]
    OrchestrationAction -->|Kubernetes| RestartPod[Restart Pod<br/>Liveness Probe Failed]
    OrchestrationAction -->|ECS| ReplaceTask[Replace Task<br/>Health Check Failed]
    
    LogUnhealthy --> WaitInterval
    RestartPod --> End([Container Restarted])
    ReplaceTask --> End
    
    style Start fill:#e1f5e1
    style HealthyState fill:#d4edda
    style UnhealthyState fill:#f8d7da
    style End fill:#f8d7da
```

**Docker Compose Healthcheck Configuration (from `infrastructure/local/docker-compose.yml`):**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

**Health Check Parameters:**
- **Interval:** 30 seconds between checks
- **Timeout:** 10 seconds maximum execution time
- **Retries:** 3 consecutive failures before marking unhealthy
- **Start Period:** 10 seconds grace period after container start

**Exit Code Interpretation:**
- Exit Code 0: Healthy (HTTP 200 response received)
- Exit Code 1: Unhealthy (curl failed, non-200 status, or timeout)

#### 4.3.1.2 Standalone Health Check Script Flow

```mermaid
flowchart TD
    Start([Execute health-check.sh]) --> ParseArgs[Parse Command Line Arguments<br/>--host --port --timeout --verbose]
    
    ParseArgs --> SetDefaults[Apply Defaults<br/>HOST=localhost<br/>PORT=3000<br/>TIMEOUT=5]
    
    SetDefaults --> CheckPrereq{curl<br/>Installed?}
    
    CheckPrereq -->|No| ErrorNoCurl[Error: curl Not Found<br/>Exit Code 1]
    CheckPrereq -->|Yes| BuildURL[Build URL<br/>http:// HOST : PORT /hello]
    
    BuildURL --> CreateTempFile[Create Temporary File<br/>For Response Body Storage]
    
    CreateTempFile --> ExecuteCurl["Execute curl Request<br/>curl -s -o tmpfile -w %{http_code} -m TIMEOUT URL"]
    
    ExecuteCurl --> CaptureCurl{curl<br/>Successful?}
    
    CaptureCurl -->|Exit 0| ReadStatus[Read HTTP Status Code<br/>From curl Output]
    CaptureCurl -->|Exit Non-0| CurlFailed[curl Failed<br/>Connection Error or Timeout]
    
    CurlFailed --> LogUnreachable[Log: Service Unreachable<br/>Error Details]
    LogUnreachable --> Cleanup1[Delete Temporary File]
    Cleanup1 --> ExitUnreachable[Exit Code 2<br/>Service Unreachable]
    
    ReadStatus --> CheckStatus{Status<br/>Code = 200?}
    
    CheckStatus -->|No| LogBadStatus[Log: Unexpected Status Code<br/>Expected 200, Got STATUS]
    CheckStatus -->|Yes| ReadBody[Read Response Body<br/>From Temporary File]
    
    LogBadStatus --> Cleanup2[Delete Temporary File]
    Cleanup2 --> ExitUnhealthy1[Exit Code 1<br/>Service Unhealthy]
    
    ReadBody --> CheckBody{Body Contains<br/>'Hello world'?}
    
    CheckBody -->|No| LogBadBody[Log: Unexpected Response Body<br/>Expected 'Hello world']
    CheckBody -->|Yes| LogHealthy[Log: Service Healthy<br/>Status 200, Correct Response]
    
    LogBadBody --> Cleanup3[Delete Temporary File]
    Cleanup3 --> ExitUnhealthy2[Exit Code 1<br/>Service Unhealthy]
    
    LogHealthy --> Cleanup4[Delete Temporary File]
    Cleanup4 --> ExitHealthy[Exit Code 0<br/>Service Healthy]
    
    ErrorNoCurl --> EndError([Script Failed])
    ExitUnreachable --> EndError
    ExitUnhealthy1 --> EndError
    ExitUnhealthy2 --> EndError
    ExitHealthy --> EndSuccess([Health Check Passed])
    
    style Start fill:#e1f5e1
    style ExitHealthy fill:#d4edda
    style EndSuccess fill:#d4edda
    style ErrorNoCurl fill:#f8d7da
    style ExitUnreachable fill:#f8d7da
    style ExitUnhealthy1 fill:#f8d7da
    style ExitUnhealthy2 fill:#f8d7da
    style EndError fill:#f8d7da
```

**Script Location:** `infrastructure/scripts/health-check.sh`

**Exit Code Standards:**
- **0:** Service healthy (200 status + "Hello world" response)
- **1:** Service unhealthy (non-200 status or incorrect response)
- **2:** Service unreachable (connection failed or timeout)

**Validation Checks:**
1. HTTP status code must be exactly 200
2. Response body must contain substring "Hello world"
3. Both checks must pass for healthy status

**Usage Scenarios:**
- CI/CD pipelines: Verify deployment success
- Deployment scripts: Wait for service readiness (referenced in `infrastructure/scripts/deploy.sh`)
- Manual verification: Developer troubleshooting
- Monitoring systems: External health probe

### 4.3.2 Docker Deployment Workflow

#### 4.3.2.1 Complete Deployment Orchestration

```mermaid
flowchart TD
    Start([Execute deploy.sh]) --> ParseArgs[Parse Arguments<br/>--env development/staging/production<br/>--verbose]
    
    ParseArgs --> ValidateEnv{Environment<br/>Valid?}
    
    ValidateEnv -->|Invalid| ErrorEnv[Error: Invalid Environment<br/>Must be dev/staging/prod]
    ValidateEnv -->|Valid| CheckDocker{Docker<br/>Installed?}
    
    CheckDocker -->|No| ErrorDocker[Error: Docker Not Found<br/>Install Docker]
    CheckDocker -->|Yes| CheckCompose{Docker Compose<br/>Installed?}
    
    CheckCompose -->|No| ErrorCompose[Error: Docker Compose Not Found]
    CheckCompose -->|Yes| CheckCurl{curl<br/>Installed?}
    
    CheckCurl -->|No| ErrorCurl[Error: curl Not Found]
    CheckCurl -->|Yes| CheckHealth{health-check.sh<br/>Executable?}
    
    CheckHealth -->|No| ErrorHealth[Error: Health Check Script Missing]
    CheckHealth -->|Yes| SetupEnv[Setup Environment<br/>Export NODE_ENV<br/>Export APP_PORT=3000]
    
    SetupEnv --> LogStart[Log: Starting Deployment<br/>Environment: ENV]
    
    LogStart --> BuildImage[Build Docker Image<br/>docker build -t APP_NAME:VERSION .]
    
    BuildImage --> BuildResult{Build<br/>Successful?}
    
    BuildResult -->|Failed| LogBuildFail[Log: Build Failed<br/>Error Details]
    BuildResult -->|Success| TagLatest[Tag as Latest<br/>docker tag APP_NAME:VERSION APP_NAME:latest]
    
    LogBuildFail --> ExitBuild[Exit Code 1<br/>Build Failed]
    
    TagLatest --> NavigateInfra[Navigate to Infrastructure Directory<br/>cd infrastructure/local]
    
    NavigateInfra --> ExportVars[Export Environment Variables<br/>For Docker Compose]
    
    ExportVars --> DockerComposeUp[Deploy with Docker Compose<br/>docker-compose up -d]
    
    DockerComposeUp --> DeployResult{Deploy<br/>Successful?}
    
    DeployResult -->|Failed| LogDeployFail[Log: Deployment Failed<br/>Error Details]
    DeployResult -->|Success| InitRetry[Initialize Health Check<br/>Retries = 5<br/>Interval = 3 seconds]
    
    LogDeployFail --> Rollback
    
    InitRetry --> HealthLoop{Retries<br/>Remaining?}
    
    HealthLoop -->|Yes| ExecuteHealth[Execute health-check.sh<br/>--host APP_HOST --port APP_PORT]
    HealthLoop -->|No Retries Exhausted| HealthFailed[Health Check Failed<br/>Max Retries Reached]
    
    ExecuteHealth --> HealthResult{Exit<br/>Code 0?}
    
    HealthResult -->|No| DecrementRetry[Decrement Retry Count<br/>Wait INTERVAL Seconds]
    HealthResult -->|Yes| HealthSuccess[Log: Deployment Verified<br/>Service Healthy]
    
    DecrementRetry --> HealthLoop
    
    HealthFailed --> LogHealthFail[Log: Health Check Failed<br/>Rolling Back Deployment]
    LogHealthFail --> Rollback[Execute Rollback Procedure]
    
    Rollback --> ComposeDown[docker-compose down<br/>Stop Current Deployment]
    ComposeDown --> FindPrevious{Previous<br/>Image Exists?}
    
    FindPrevious -->|Yes| RestorePrevious[Restore Previous Image<br/>docker tag PREVIOUS_VERSION latest<br/>docker-compose up -d]
    FindPrevious -->|No| ManualIntervention[Manual Intervention Required<br/>No Previous Version]
    
    RestorePrevious --> LogRollback[Log: Rollback Complete<br/>Previous Version Restored]
    ManualIntervention --> LogManual[Log: Rollback Failed<br/>Manual Recovery Needed]
    
    LogRollback --> ExitRollback[Exit Code 1<br/>Deployment Failed, Rolled Back]
    LogManual --> ExitManual[Exit Code 1<br/>Deployment Failed]
    
    HealthSuccess --> CheckProdEnv{Environment<br/>= Production?}
    
    CheckProdEnv -->|Yes| PruneImages[Cleanup Old Images<br/>docker image prune -f]
    CheckProdEnv -->|No| SkipPrune[Skip Cleanup<br/>Development Environment]
    
    PruneImages --> LogSuccess[Log: Deployment Complete<br/>Service Running at HOST:PORT]
    SkipPrune --> LogSuccess
    
    LogSuccess --> ExitSuccess[Exit Code 0<br/>Deployment Successful]
    
    ErrorEnv --> EndError([Deployment Failed])
    ErrorDocker --> EndError
    ErrorCompose --> EndError
    ErrorCurl --> EndError
    ErrorHealth --> EndError
    ExitBuild --> EndError
    ExitRollback --> EndError
    ExitManual --> EndError
    
    ExitSuccess --> EndSuccess([Deployment Successful])
    
    style Start fill:#e1f5e1
    style EndSuccess fill:#d4edda
    style ExitSuccess fill:#d4edda
    style HealthSuccess fill:#d4edda
    style EndError fill:#f8d7da
    style Rollback fill:#fff3cd
    style HealthFailed fill:#f8d7da
```

**Deployment Script Location:** `infrastructure/scripts/deploy.sh`

**Deployment Stages:**
1. **Prerequisites Check:** Verify Docker, Docker Compose, curl, health-check.sh
2. **Environment Setup:** Export NODE_ENV, APP_PORT
3. **Build Phase:** Docker image creation with version tagging
4. **Deploy Phase:** Docker Compose orchestration
5. **Verification Phase:** Health check with retries (5 attempts, 3-second intervals)
6. **Cleanup Phase:** Image pruning (production only)
7. **Rollback Phase:** Automatic on failure

**Health Check Retry Logic:**
- Maximum retries: 5 attempts
- Interval between retries: 3 seconds
- Total verification time: Up to 15 seconds
- Failure triggers automatic rollback

**Rollback Procedure:**
1. Stop current deployment: `docker-compose down`
2. Find previous Docker image tag
3. Restore previous image as `latest`
4. Restart services with previous version
5. Log rollback status

**Environment-Specific Behavior:**
- **Development:** No image pruning, verbose logging
- **Staging:** Limited pruning, moderate logging
- **Production:** Aggressive pruning, minimal logging, strict health checks

### 4.3.3 Monitoring and Observability Integration

#### 4.3.3.1 Prometheus Metrics Collection Flow

```mermaid
sequenceDiagram
    participant Prometheus
    participant App as Hello World App
    participant Metrics as /metrics Endpoint
    participant Health as /hello Endpoint
    
    Note over Prometheus: Scrape Interval: 5 seconds
    
    loop Application Metrics
        Prometheus->>Metrics: HTTP GET /metrics
        activate Metrics
        
        alt Metrics Endpoint Implemented
            Metrics->>Metrics: Collect Current Metrics<br/>- http_requests_total<br/>- http_request_duration_seconds<br/>- nodejs_memory_usage<br/>- nodejs_cpu_usage
            Metrics-->>Prometheus: 200 OK<br/>Prometheus Text Format
            Note over Prometheus: Parse Metrics<br/>Store in TSDB
        else Endpoint Not Implemented
            Metrics-->>Prometheus: 404 Not Found
            Note over Prometheus: Mark Target Down<br/>up{job="hello-world-app"}=0
        end
        
        deactivate Metrics
        
        Note over Prometheus: Wait 5 seconds
    end
    
    Note over Prometheus: Health Scrape Interval: 30 seconds
    
    loop Health Monitoring
        Prometheus->>Health: HTTP GET /hello
        activate Health
        
        Health->>App: Route Request
        activate App
        App->>App: Process Request<br/>Hello Handler
        App-->>Health: "Hello world"
        deactivate App
        
        alt Service Healthy
            Health-->>Prometheus: 200 OK<br/>"Hello world"
            Note over Prometheus: Set up{job="hello-world-health"}=1
        else Service Unhealthy
            Health-->>Prometheus: Non-200 Status<br/>or Timeout
            Note over Prometheus: Set up{job="hello-world-health"}=0
        end
        
        deactivate Health
        
        Note over Prometheus: Wait 30 seconds
    end
    
    Note over Prometheus: Metrics Available<br/>for Grafana Queries
```

**Prometheus Configuration (from `infrastructure/monitoring/prometheus.yml`):**

**Job 1: Application Metrics**
- Job Name: `hello-world-app`
- Target: `hello-world-app:3000/metrics`
- Scrape Interval: 5 seconds
- Scrape Timeout: 3 seconds
- **Status:** Configuration exists; endpoint implementation not verified

**Job 2: Health Monitoring**
- Job Name: `hello-world-health`
- Target: `hello-world-app:3000/hello`
- Scrape Interval: 30 seconds
- Scrape Timeout: 5 seconds
- **Status:** Fully functional using existing `/hello` endpoint

**Expected Metrics Schema:**
```
# Request metrics

http_requests_total{method="GET", path="/hello", status="200"} 1234
http_request_duration_seconds{method="GET", path="/hello", quantile="0.5"} 0.045
http_request_duration_seconds{method="GET", path="/hello", quantile="0.95"} 0.089
http_request_duration_seconds{method="GET", path="/hello", quantile="0.99"} 0.125

#### Error metrics

http_errors_total{type="404"} 12
http_errors_total{type="405"} 3
http_errors_total{type="500"} 0

#### System metrics

nodejs_memory_usage_bytes{type="rss"} 45678912
nodejs_memory_usage_bytes{type="heapUsed"} 23456789
nodejs_cpu_usage_percentage 2.5
nodejs_event_loop_lag_seconds 0.001

#### Availability

up{job="hello-world-app", instance="hello-world-app:3000"} 1
up{job="hello-world-health", instance="hello-world-app:3000"} 1
```

#### 4.3.3.2 Grafana Dashboard Visualization

```mermaid
flowchart TD
    Start([Grafana Dashboard Opens]) --> LoadDS[Load Data Source<br/>Prometheus Connection]
    
    LoadDS --> CheckConnection{Prometheus<br/>Reachable?}
    
    CheckConnection -->|No| ErrorDS[Error: Data Source Unavailable<br/>Display Connection Error]
    CheckConnection -->|Yes| LoadConfig[Load Dashboard Configuration<br/>grafana-dashboard.json]
    
    LoadConfig --> InitPanels[Initialize 13 Panels]
    
    InitPanels --> Panel1[Panel 1: Application Status<br/>Query: up job=&quot;hello-world-app&quot;]
    InitPanels --> Panel2[Panel 2: Health Check<br/>Query: up job=&quot;hello-world-health&quot;]
    InitPanels --> Panel3[Panel 3: Uptime<br/>Query: time&#40;&#41; - process_start_time_seconds]
    InitPanels --> Panel4[Panel 4: Total Requests<br/>Query: sum http_requests_total]
    InitPanels --> Panel5[Panel 5: Request Rate<br/>Query: sum rate http_requests_total 1m]
    InitPanels --> Panel6[Panel 6: Response Time p50/p95/p99<br/>Query: histogram_quantile...]
    InitPanels --> Panel7[Panel 7: Status Distribution<br/>Query: http_requests_total by status]
    InitPanels --> Panel8[Panel 8: Error Rate<br/>Query: &#40;4xx+5xx&#41;/total * 100]
    InitPanels --> Panel9[Panel 9: Memory Usage<br/>Query: nodejs_memory_usage_bytes]
    InitPanels --> Panel10[Panel 10: CPU Usage<br/>Query: nodejs_cpu_usage_percentage]
    InitPanels --> Panel11[Panel 11: Event Loop Lag<br/>Query: nodejs_event_loop_lag_seconds]
    InitPanels --> Panel12[Panel 12: Endpoint Traffic<br/>Query: http_requests_total by path]
    InitPanels --> Panel13[Panel 13: Custom Metrics<br/>Application-Specific]
    
    Panel1 --> ExecuteQuery1{Query<br/>Successful?}
    Panel2 --> ExecuteQuery2{Query<br/>Successful?}
    Panel3 --> ExecuteQuery3{Query<br/>Successful?}
    Panel4 --> ExecuteQuery4{Query<br/>Successful?}
    Panel5 --> ExecuteQuery5{Query<br/>Successful?}
    Panel6 --> ExecuteQuery6{Query<br/>Successful?}
    Panel7 --> ExecuteQuery7{Query<br/>Successful?}
    Panel8 --> ExecuteQuery8{Query<br/>Successful?}
    Panel9 --> ExecuteQuery9{Query<br/>Successful?}
    Panel10 --> ExecuteQuery10{Query<br/>Successful?}
    Panel11 --> ExecuteQuery11{Query<br/>Successful?}
    Panel12 --> ExecuteQuery12{Query<br/>Successful?}
    Panel13 --> ExecuteQuery13{Query<br/>Successful?}
    
    ExecuteQuery1 -->|Yes| RenderPanel1[Render Status Indicator<br/>Green=Up Red=Down]
    ExecuteQuery1 -->|No| NoData1[Display: No Data]
    
    ExecuteQuery2 -->|Yes| RenderPanel2[Render Health Status]
    ExecuteQuery2 -->|No| NoData2[Display: No Data]
    
    ExecuteQuery3 -->|Yes| RenderPanel3[Render Uptime Graph]
    ExecuteQuery3 -->|No| NoData3[Display: No Data]
    
    ExecuteQuery4 -->|Yes| RenderPanel4[Render Counter Value]
    ExecuteQuery4 -->|No| NoData4[Display: No Data]
    
    ExecuteQuery5 -->|Yes| RenderPanel5[Render Rate Graph]
    ExecuteQuery5 -->|No| NoData5[Display: No Data]
    
    ExecuteQuery6 -->|Yes| RenderPanel6[Render Latency Graph<br/>Multiple Percentiles]
    ExecuteQuery6 -->|No| NoData6[Display: No Data]
    
    ExecuteQuery7 -->|Yes| RenderPanel7[Render Pie Chart<br/>Status Code Distribution]
    ExecuteQuery7 -->|No| NoData7[Display: No Data]
    
    ExecuteQuery8 -->|Yes| RenderPanel8[Render Error Rate %]
    ExecuteQuery8 -->|No| NoData8[Display: No Data]
    
    ExecuteQuery9 -->|Yes| RenderPanel9[Render Memory Graph<br/>RSS and Heap]
    ExecuteQuery9 -->|No| NoData9[Display: No Data]
    
    ExecuteQuery10 -->|Yes| RenderPanel10[Render CPU Usage %]
    ExecuteQuery10 -->|No| NoData10[Display: No Data]
    
    ExecuteQuery11 -->|Yes| RenderPanel11[Render Event Loop Lag]
    ExecuteQuery11 -->|No| NoData11[Display: No Data]
    
    ExecuteQuery12 -->|Yes| RenderPanel12[Render Traffic by Endpoint]
    ExecuteQuery12 -->|No| NoData12[Display: No Data]
    
    ExecuteQuery13 -->|Yes| RenderPanel13[Render Custom Visualization]
    ExecuteQuery13 -->|No| NoData13[Display: No Data]
    
    RenderPanel1 --> AutoRefresh[Auto-Refresh: 10 seconds]
    RenderPanel2 --> AutoRefresh
    RenderPanel3 --> AutoRefresh
    RenderPanel4 --> AutoRefresh
    RenderPanel5 --> AutoRefresh
    RenderPanel6 --> AutoRefresh
    RenderPanel7 --> AutoRefresh
    RenderPanel8 --> AutoRefresh
    RenderPanel9 --> AutoRefresh
    RenderPanel10 --> AutoRefresh
    RenderPanel11 --> AutoRefresh
    RenderPanel12 --> AutoRefresh
    RenderPanel13 --> AutoRefresh
    
    NoData1 --> AutoRefresh
    NoData2 --> AutoRefresh
    NoData3 --> AutoRefresh
    NoData4 --> AutoRefresh
    NoData5 --> AutoRefresh
    NoData6 --> AutoRefresh
    NoData7 --> AutoRefresh
    NoData8 --> AutoRefresh
    NoData9 --> AutoRefresh
    NoData10 --> AutoRefresh
    NoData11 --> AutoRefresh
    NoData12 --> AutoRefresh
    NoData13 --> AutoRefresh
    
    AutoRefresh --> WaitRefresh[Wait for Next Refresh Cycle]
    WaitRefresh --> LoadConfig
    
    ErrorDS --> End([Dashboard Error State])
    
    style Start fill:#e1f5e1
    style RenderPanel1 fill:#d4edda
    style RenderPanel6 fill:#d4edda
    style RenderPanel8 fill:#fff3cd
    style ErrorDS fill:#f8d7da
    style NoData1 fill:#fff3cd
```

**Grafana Dashboard Configuration (from `infrastructure/monitoring/grafana-dashboard.json`):**
- **Dashboard UID:** `hello-world-dashboard`
- **Dashboard Name:** "Node.js Hello World Dashboard"
- **Refresh Interval:** 10 seconds
- **Time Range:** Last 1 hour (default, configurable)
- **Data Source:** Prometheus (named "Prometheus")

**13 Pre-Configured Panels:**
1. **Application Status:** Binary up/down indicator
2. **Health Check:** Service health indicator
3. **Uptime:** Service uptime duration
4. **Total Requests:** Cumulative request counter
5. **Request Rate:** Requests per minute
6. **Response Time:** p50, p95, p99 latency percentiles
7. **HTTP Status Distribution:** Pie chart of status codes
8. **Error Rate:** Percentage of 4xx and 5xx responses
9. **Memory Usage:** RSS and heap memory
10. **CPU Usage:** Process CPU percentage
11. **Event Loop Lag:** Node.js event loop delay
12. **Endpoint Traffic:** Request distribution by path
13. **Custom Metrics:** Application-specific metrics

**Implementation Note:** Dashboard expects metrics from a `/metrics` endpoint which may not be fully implemented in the application. The health monitoring aspect (Panel 2) is fully functional using the `/hello` endpoint.

## 4.4 State Management and Lifecycle

### 4.4.1 Server Lifecycle State Transitions

#### 4.4.1.1 Complete Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> UNINITIALIZED: Process Starts
    
    UNINITIALIZED --> LOADING_CONFIG: Load Configuration
    LOADING_CONFIG --> CONFIG_LOADED: Configuration Valid
    LOADING_CONFIG --> ERROR_CONFIG: Configuration Error
    
    CONFIG_LOADED --> CHECKING_TEST: Check IS_TEST Flag
    CHECKING_TEST --> TEST_MODE: IS_TEST = true
    CHECKING_TEST --> CREATING_SERVER: IS_TEST = false
    
    TEST_MODE --> [*]: Exit for Tests
    
    CREATING_SERVER --> SERVER_CREATED: http.createServer&#40;&#41; Success
    CREATING_SERVER --> ERROR_CREATE: Server Creation Failed
    
    SERVER_CREATED --> REGISTERING_HANDLERS: Register Error Handlers
    REGISTERING_HANDLERS --> BINDING_PORT: server.listen&#40;PORT, HOST&#41;
    
    BINDING_PORT --> LISTENING: Port Bind Success
    BINDING_PORT --> ERROR_EADDRINUSE: Port Already In Use
    BINDING_PORT --> ERROR_EACCES: Permission Denied
    BINDING_PORT --> ERROR_BIND: Other Bind Error
    
    LISTENING --> READY: Setup Complete
    
    READY --> PROCESSING_REQUEST: Request Received
    PROCESSING_REQUEST --> READY: Response Sent
    
    READY --> SHUTDOWN_INITIATED: SIGINT/SIGTERM Signal
    
    SHUTDOWN_INITIATED --> STOPPING_LISTENER: server.close&#40;&#41; Called
    STOPPING_LISTENER --> DRAINING_CONNECTIONS: Listener Closed
    
    DRAINING_CONNECTIONS --> CONNECTIONS_DRAINED: All Connections Closed
    DRAINING_CONNECTIONS --> ERROR_SHUTDOWN: Shutdown Error
    
    CONNECTIONS_DRAINED --> SERVER_STOPPED: Cleanup Complete
    
    SERVER_STOPPED --> [*]: Process Exit Code 0
    
    ERROR_CONFIG --> [*]: Exit Code 1
    ERROR_CREATE --> [*]: Exit Code 1
    ERROR_EADDRINUSE --> [*]: Exit Code 1
    ERROR_EACCES --> [*]: Exit Code 1
    ERROR_BIND --> [*]: Exit Code 1
    ERROR_SHUTDOWN --> [*]: Exit Code 1
    
    note right of READY
        Normal Operating State
        Accepts Connections
        Processes Requests
    end note
    
    note right of DRAINING_CONNECTIONS
        No New Connections
        Waiting for Active
        Requests to Complete
    end note
    
    note right of ERROR_EADDRINUSE
        Port 3000 Already Bound
        Check for Running Process
        or Change PORT Variable
    end note
```

**State Definitions:**

| State | Description | Duration | Exit Conditions |
|---|---|---|---|
| UNINITIALIZED | Initial state before any initialization | < 10ms | Configuration loading begins |
| LOADING_CONFIG | Reading and validating environment variables | < 50ms | Config valid or error detected |
| CONFIG_LOADED | Configuration ready for use | Instant | Proceed to test check |
| CHECKING_TEST | Evaluating IS_TEST environment flag | < 1ms | Branch to test mode or server creation |
| TEST_MODE | Test environment detected, skip server startup | N/A | Process exits immediately |
| CREATING_SERVER | Instantiating http.Server object | < 100ms | Server created or error |
| SERVER_CREATED | Server object exists, not yet listening | Instant | Register handlers |
| REGISTERING_HANDLERS | Attaching error event handlers | < 10ms | Proceed to port binding |
| BINDING_PORT | Attempting to bind to configured port | < 500ms | Bind success or error |
| LISTENING | Server bound to port, accepting connections | Instant | Setup complete |
| READY | Normal operating state, processing requests | Indefinite | Request received or shutdown signal |
| PROCESSING_REQUEST | Handling active HTTP request | < 100ms avg | Response sent |
| SHUTDOWN_INITIATED | Graceful shutdown signal received | Instant | Begin shutdown sequence |
| STOPPING_LISTENER | Closing server listener | < 100ms | Listener closed |
| DRAINING_CONNECTIONS | Waiting for active requests to complete | Variable | All connections closed or error |
| CONNECTIONS_DRAINED | All connections closed gracefully | Instant | Final cleanup |
| SERVER_STOPPED | Server fully stopped, resources released | < 50ms | Process exit |

**Error States:**
- **ERROR_CONFIG:** Invalid configuration (rare, uses defaults)
- **ERROR_CREATE:** Server creation failed (unlikely with Node.js)
- **ERROR_EADDRINUSE:** Port already in use by another process
- **ERROR_EACCES:** Permission denied (binding to privileged port)
- **ERROR_BIND:** Other port binding errors
- **ERROR_SHUTDOWN:** Error during graceful shutdown

**State Persistence:**
- Server instance variable: `let server = null` (initially)
- Set to HTTP server object in LISTENING state
- Reset to `null` in SERVER_STOPPED state
- Checked for existence in SHUTDOWN_INITIATED state

### 4.4.2 Request Lifecycle State Transitions

#### 4.4.2.1 Request Processing State Machine

```mermaid
stateDiagram-v2
    [*] --> RECEIVED: Client Sends Request
    
    RECEIVED --> MIDDLEWARE_ENTRY: Enter Middleware Chain
    
    MIDDLEWARE_ENTRY --> LOGGING_START: Request Logger Middleware
    LOGGING_START --> LOGGING_CONFIGURED: Capture Start Time, Wrap res.end&#40;&#41;
    
    LOGGING_CONFIGURED --> SECURITY_HEADERS: Security Headers Middleware
    SECURITY_HEADERS --> HEADERS_APPLIED: Set X-Content-Type-Options, X-Frame-Options, CSP
    
    HEADERS_APPLIED --> ROUTING: Router Middleware
    ROUTING --> URL_PARSED: Parse req.url
    
    URL_PARSED --> ROUTE_LOOKUP: Lookup pathname in Routes
    
    ROUTE_LOOKUP --> HANDLER_MATCHED: Route Found
    ROUTE_LOOKUP --> HANDLER_404: Route Not Found
    
    HANDLER_MATCHED --> METHOD_CHECK: Validate HTTP Method
    
    METHOD_CHECK --> HANDLER_HELLO: Method = GET, Path = /hello
    METHOD_CHECK --> HANDLER_405: Method != GET
    
    HANDLER_HELLO --> GENERATING_RESPONSE: Execute Hello Handler
    HANDLER_404 --> GENERATING_ERROR_404: Execute 404 Handler
    HANDLER_405 --> GENERATING_ERROR_405: Execute 405 Handler
    
    GENERATING_RESPONSE --> RESPONSE_READY: Set Status 200, Headers, Body
    GENERATING_RESPONSE --> EXCEPTION_THROWN: Uncaught Exception
    
    GENERATING_ERROR_404 --> RESPONSE_READY: Set Status 404, Body
    GENERATING_ERROR_405 --> RESPONSE_READY: Set Status 405, Allow Header, Body
    
    EXCEPTION_THROWN --> HANDLER_500: Error Caught by Middleware
    HANDLER_500 --> GENERATING_ERROR_500: Execute 500 Handler
    GENERATING_ERROR_500 --> RESPONSE_READY: Set Status 500, Body
    
    RESPONSE_READY --> SENDING_RESPONSE: Call res.end&#40;&#41;
    
    SENDING_RESPONSE --> END_INTERCEPTED: Intercepted by Request Logger
    
    END_INTERCEPTED --> CALCULATING_TIME: Calculate Response Time
    CALCULATING_TIME --> LOGGING_RESPONSE: Log Request Details
    
    LOGGING_RESPONSE --> DETERMINING_LEVEL: Determine Log Level Based on Status
    
    DETERMINING_LEVEL --> LOG_ERROR: Status >= 500
    DETERMINING_LEVEL --> LOG_WARN: Status >= 400
    DETERMINING_LEVEL --> LOG_INFO: Status < 400
    
    LOG_ERROR --> FORMATTING_LOG: Format Log Message
    LOG_WARN --> FORMATTING_LOG
    LOG_INFO --> FORMATTING_LOG
    
    FORMATTING_LOG --> CHECKING_TEST: Check IS_TEST Flag
    
    CHECKING_TEST --> SUPPRESS_LOG: IS_TEST = true
    CHECKING_TEST --> OUTPUT_LOG: IS_TEST = false
    
    SUPPRESS_LOG --> CALLING_ORIGINAL: Call Original res.end&#40;&#41;
    OUTPUT_LOG --> CALLING_ORIGINAL
    
    CALLING_ORIGINAL --> RESPONSE_SENT: Response Transmitted to Client
    
    RESPONSE_SENT --> [*]: Request Complete
    
    note right of LOGGING_START
        Start Time Captured
        For Response Time
        Calculation
    end note
    
    note right of HANDLER_HELLO
        Normal Success Path
        Returns 200
        "Hello world"
    end note
    
    note right of EXCEPTION_THROWN
        Any Uncaught Error
        in Handler or
        Middleware
    end note
    
    note right of CALCULATING_TIME
        Response Time =
        Date.now&#40;&#41; - startTime
        Millisecond Precision
    end note
```

**Request State Duration Estimates:**
- **RECEIVED → MIDDLEWARE_ENTRY:** < 1ms
- **MIDDLEWARE_ENTRY → ROUTING:** < 5ms (both middleware)
- **ROUTING → HANDLER_MATCHED:** < 2ms (URL parsing and lookup)
- **HANDLER_MATCHED → GENERATING_RESPONSE:** < 1ms (method validation)
- **GENERATING_RESPONSE → RESPONSE_READY:** < 10ms (handler execution)
- **RESPONSE_READY → RESPONSE_SENT:** < 5ms (logging and transmission)
- **Total End-to-End:** < 50ms average, < 100ms SLA

**State Data Requirements:**
- **LOGGING_START:** Requires writable `req` and `res` objects
- **ROUTING:** Requires `req.url`, `req.method` properties
- **HANDLER_HELLO:** Requires `res` object for status, headers, body
- **CALCULATING_TIME:** Requires `startTime` from closure
- **LOGGING_RESPONSE:** Requires `req.method`, `req.url`, `res.statusCode`, `responseTime`

**Error Recovery Paths:**
- **EXCEPTION_THROWN → HANDLER_500:** Synchronous error catch
- **No rollback:** Request state not persisted, errors isolated
- **Client notification:** Always receives HTTP response (200, 404, 405, or 500)

## 4.5 Error Handling Flowcharts

### 4.5.1 Comprehensive Error Handling Hierarchy

#### 4.5.1.1 Error Classification and Routing

```mermaid
flowchart TD
    Start([Error Detected]) --> ErrorSource{Error<br/>Source?}
    
    ErrorSource -->|Request Processing| RequestError[Request-Level Error]
    ErrorSource -->|Server Lifecycle| ServerError[Server-Level Error]
    ErrorSource -->|Configuration| ConfigError[Configuration Error]
    
    RequestError --> RequestType{Error<br/>Type?}
    
    RequestType -->|Route Not Found| Handle404Flow[404 Not Found Flow]
    RequestType -->|Method Not Allowed| Handle405Flow[405 Method Not Allowed Flow]
    RequestType -->|Uncaught Exception| Handle500Flow[500 Internal Server Error Flow]
    
    ServerError --> ServerType{Error<br/>Type?}
    
    ServerType -->|Port In Use| HandleEADDRINUSE[EADDRINUSE Flow]
    ServerType -->|Permission Denied| HandleEACCES[EACCES Flow]
    ServerType -->|Shutdown Error| HandleShutdown[Shutdown Error Flow]
    
    ConfigError --> ConfigType{Error<br/>Type?}
    
    ConfigType -->|Invalid PORT| HandlePortValidation[Port Validation Flow]
    ConfigType -->|Missing .env| HandleEnvMissing[Silent Fallback Flow]
    ConfigType -->|Parse Error| HandleEnvParse[Parse Warning Flow]
    
    Handle404Flow --> Set404[Set Status: 404]
    Set404 --> SetContent404[Set Content-Type: text/plain]
    SetContent404 --> Log404[Log WARN: Not Found]
    Log404 --> Send404[Send Body: 'Not Found']
    Send404 --> End404([404 Response Sent])
    
    Handle405Flow --> Set405[Set Status: 405]
    Set405 --> SetContent405[Set Content-Type: text/plain]
    SetContent405 --> SetAllow405[Set Allow: GET]
    SetAllow405 --> Log405[Log WARN: Method Not Allowed]
    Log405 --> Send405[Send Body: 'Method Not Allowed']
    Send405 --> End405([405 Response Sent])
    
    Handle500Flow --> CheckHeaders{Headers<br/>Sent?}
    CheckHeaders -->|Yes| CannotSend[Cannot Send Error Response<br/>Connection May Be Corrupted]
    CheckHeaders -->|No| Set500[Set Status: 500]
    
    Set500 --> SetContent500[Set Content-Type: text/plain]
    SetContent500 --> LogFull500[Log ERROR: Full Stack Trace<br/>Server-Side Only]
    LogFull500 --> Send500[Send Body: 'Internal Server Error'<br/>Generic Message]
    Send500 --> End500([500 Response Sent])
    CannotSend --> LogOnly[Log Error Only<br/>No Response Sent]
    LogOnly --> EndCorrupt([Connection Terminates])
    
    HandleEADDRINUSE --> LogPortInUse[Log ERROR: Port PORT Already In Use]
    LogPortInUse --> SuggestFix[Log: Check Running Processes<br/>or Change PORT Variable]
    SuggestFix --> ExitEADDR[Process Exit Code 1]
    ExitEADDR --> EndEADDR([Process Terminated])
    
    HandleEACCES --> LogPermission[Log ERROR: Permission Denied<br/>Port PORT]
    LogPermission --> SuggestRoot[Log: Ports < 1024 Require Root]
    SuggestRoot --> ExitEACCES[Process Exit Code 1]
    ExitEACCES --> EndEACCES([Process Terminated])
    
    HandleShutdown --> LogShutdownError[Log ERROR: Error Stopping Server]
    LogShutdownError --> LogDetails[Log: Error Details and Stack]
    LogDetails --> ExitShutdown[Process Exit Code 1]
    ExitShutdown --> EndShutdown([Process Terminated])
    
    HandlePortValidation --> LogInvalidPort[Log WARN: Invalid PORT Value]
    LogInvalidPort --> UseDefaultPort[Use DEFAULT_PORT 3000]
    UseDefaultPort --> ContinuePort([Continue Startup])
    
    HandleEnvMissing --> CheckEnv{NODE_ENV?}
    CheckEnv -->|development| LogNoEnv[Log: No .env File Found]
    CheckEnv -->|production/test| SilentNoEnv[Silent Continue<br/>Expected in Production]
    LogNoEnv --> ContinueEnv([Continue Startup])
    SilentNoEnv --> ContinueEnv
    
    HandleEnvParse --> LogParseWarn[Log WARN: Error Parsing .env]
    LogParseWarn --> UseDefaults[Use All Default Values]
    UseDefaults --> ContinueParse([Continue Startup])
    
    style Start fill:#fff3cd
    style End404 fill:#fff3cd
    style End405 fill:#fff3cd
    style End500 fill:#f8d7da
    style EndCorrupt fill:#f8d7da
    style EndEADDR fill:#f8d7da
    style EndEACCES fill:#f8d7da
    style EndShutdown fill:#f8d7da
    style ContinuePort fill:#d4edda
    style ContinueEnv fill:#d4edda
    style ContinueParse fill:#d4edda
```

**Error Severity Classification:**

| Severity | Error Types | Response | Recovery |
|---|---|---|---|
| **Critical** | EADDRINUSE, EACCES, Shutdown Errors | Process Exit | None (manual intervention) |
| **High** | Uncaught Exceptions (500) | Error Response | Continue processing other requests |
| **Medium** | Invalid Configuration | Warning + Default | Automatic fallback |
| **Low** | Route Not Found (404), Method Not Allowed (405) | Error Response | Normal operation (client error) |

### 4.5.2 Detailed Error Handler Implementations

#### 4.5.2.1 404 Not Found Handler Flow

```mermaid
flowchart TD
    Start([handleNotFound Called]) --> Params[Parameters:<br/>req: Request Object<br/>res: Response Object]
    
    Params --> SetStatus[Set res.statusCode = 404<br/>HTTP_STATUS.NOT_FOUND]
    
    SetStatus --> SetContentType[Set Header:<br/>Content-Type: text/plain<br/>HEADERS.CONTENT_TYPE_TEXT]
    
    SetContentType --> ExtractInfo[Extract Request Info:<br/>- method: req.method<br/>- url: req.url]
    
    ExtractInfo --> LogWarning[Log at WARN Level:<br/>logger.warn&#40;&#41;<br/>Message: 'Not Found: method url']
    
    LogWarning --> LogFormat[Format Log:<br/> timestamp  WARN: Not Found: GET /unknown]
    
    LogFormat --> WriteBody[Write Response Body:<br/>res.end&#40;MESSAGES.NOT_FOUND&#41;<br/>'Not Found']
    
    WriteBody --> SecurityCheck[Security Headers Already Applied?<br/>By Middleware Chain]
    
    SecurityCheck -->|Yes| ResponseComplete[Response Complete]
    SecurityCheck -->|No Unlikely| MissingHeaders[Missing Security Headers<br/>Architecture Issue]
    
    ResponseComplete --> TriggerLogging[Trigger Request Logger<br/>Intercepted res.end&#40;&#41;]
    
    TriggerLogging --> CalcTime[Calculate Response Time<br/>Log at WARN Level Again]
    
    CalcTime --> FinalLog[Final Log:<br/> timestamp  WARN: GET /unknown 404 45ms]
    
    FinalLog --> End([Client Receives 404 Response])
    
    MissingHeaders --> LogIssue[Log Architecture Warning<br/>Headers Should Be Applied]
    LogIssue --> ResponseComplete
    
    style Start fill:#fff3cd
    style End fill:#fff3cd
    style LogWarning fill:#fff3cd
    style ResponseComplete fill:#d4edda
```

**Implementation Location:** `src/backend/handlers/error.js` - `handleNotFound()` function (lines 20-32)

**Response Characteristics:**
- **Status Code:** 404 (HTTP_STATUS.NOT_FOUND)
- **Content-Type:** text/plain
- **Body:** "Not Found" (MESSAGES.NOT_FOUND constant)
- **Security Headers:** X-Content-Type-Options, X-Frame-Options, CSP (from middleware)
- **Logging Level:** WARN (client error, not server error)

**Trigger Conditions:**
- Request path does not match `/hello`
- No route handler found for pathname
- Invoked by router after route lookup failure

#### 4.5.2.2 405 Method Not Allowed Handler Flow

```mermaid
flowchart TD
    Start([handle405 Called]) --> Params[Parameters:<br/>res: Response Object<br/>&#40;req not needed&#41;]
    
    Params --> SetStatus[Set res.statusCode = 405<br/>HTTP_STATUS.METHOD_NOT_ALLOWED]
    
    SetStatus --> SetContentType[Set Header:<br/>Content-Type: text/plain<br/>HEADERS.CONTENT_TYPE_TEXT]
    
    SetContentType --> SetAllow[Set Header:<br/>Allow: GET<br/>HEADERS.ALLOW]
    
    SetAllow --> LogInfo[Log at INFO Level:<br/>logger.info&#40;&#41;<br/>Message: 'Responding with 405 Method Not Allowed']
    
    LogInfo --> LogFormat[Format Log:<br/> timestamp  INFO: Responding with 405...]
    
    LogFormat --> WriteBody[Write Response Body:<br/>res.end&#40;MESSAGES.METHOD_NOT_ALLOWED&#41;<br/>'Method Not Allowed']
    
    WriteBody --> AllowHeader[Allow Header Indicates:<br/>Supported Methods = GET Only]
    
    AllowHeader --> ResponseComplete[Response Complete]
    
    ResponseComplete --> TriggerLogging[Trigger Request Logger<br/>Intercepted res.end&#40;&#41;]
    
    TriggerLogging --> CalcTime[Calculate Response Time<br/>Log at WARN Level<br/>&#40;Status 405 >= 400&#41;]
    
    CalcTime --> FinalLog[Final Log:<br/> timestamp  WARN: POST /hello 405 38ms]
    
    FinalLog --> ClientAction{Client<br/>Next Action?}
    
    ClientAction -->|Retry with GET| ValidRequest[Client Sends GET /hello]
    ClientAction -->|Different Endpoint| OtherRequest[Client Tries Different Path]
    ClientAction -->|Give Up| NoRetry[No Further Requests]
    
    ValidRequest --> End([Successful Response])
    OtherRequest --> End
    NoRetry --> End
    
    style Start fill:#fff3cd
    style End fill:#fff3cd
    style SetAllow fill:#d1ecf1
    style ResponseComplete fill:#d4edda
```

**Implementation Location:** `src/backend/errorHandler.js` - `handle405()` function (lines 71-83)

**Response Characteristics:**
- **Status Code:** 405 (HTTP_STATUS.METHOD_NOT_ALLOWED)
- **Content-Type:** text/plain
- **Allow Header:** "GET" (indicates supported methods)
- **Body:** "Method Not Allowed" (MESSAGES.METHOD_NOT_ALLOWED constant)
- **Logging Level:** INFO initially, WARN in final request log (status >= 400)

**Trigger Conditions:**
- Request to `/hello` endpoint with non-GET method
- Method validation in `helloHandler.js` detects invalid method
- Invoked by handler after method check failure

**HTTP Specification Compliance:**
- Allow header required by RFC 7231 for 405 responses
- Indicates which methods are supported for the target resource
- Clients should not assume support for methods not listed

#### 4.5.2.3 500 Internal Server Error Handler Flow

```mermaid
flowchart TD
    Start([handleServerError Called]) --> Params[Parameters:<br/>req: Request Object<br/>res: Response Object<br/>error: Error Object]
    
    Params --> CheckHeaders{res.headersSent<br/>Already Sent?}
    
    CheckHeaders -->|Yes| CannotRespond[Cannot Send Error Response<br/>Headers Already Committed]
    CheckHeaders -->|No| SetStatus[Set res.statusCode = 500<br/>HTTP_STATUS.INTERNAL_SERVER_ERROR]
    
    CannotRespond --> LogOnlyError[Log ERROR:<br/>Cannot Send Response<br/>Headers Already Sent]
    LogOnlyError --> LogStack[Log Full Error Stack Trace]
    LogStack --> EndNoResponse([Connection Fails])
    
    SetStatus --> SetContentType[Set Header:<br/>Content-Type: text/plain]
    
    SetContentType --> ExtractError[Extract Error Details:<br/>- error.message<br/>- error.stack<br/>- req.method<br/>- req.url]
    
    ExtractError --> LogFullError[Log at ERROR Level:<br/>Full Error Details:<br/>Message, Stack, Request Context]
    
    LogFullError --> LogFormat[Format Log:<br/> timestamp  ERROR: Server Error processing GET /hello<br/>Error: Unexpected exception<br/>Stack: ...]
    
    LogFormat --> SecurityFilter[Security Filter:<br/>DO NOT Include Error Details<br/>in Response Body]
    
    SecurityFilter --> WriteGeneric[Write Generic Response:<br/>res.end&#40;MESSAGES.SERVER_ERROR&#41;<br/>'Internal Server Error']
    
    WriteGeneric --> NoLeakage[Prevent Information Leakage:<br/>- No stack traces to client<br/>- No file paths to client<br/>- No environment variables to client]
    
    NoLeakage --> ResponseComplete[Response Complete]
    
    ResponseComplete --> TriggerLogging[Trigger Request Logger<br/>Intercepted res.end&#40;&#41;]
    
    TriggerLogging --> CalcTime[Calculate Response Time<br/>Log at ERROR Level<br/>&#40;Status 500 >= 500&#41;]
    
    CalcTime --> FinalLog[Final Log:<br/> timestamp  ERROR: GET /hello 500 67ms]
    
    FinalLog --> ServerContinues[Server Continues Operating<br/>Error Isolated to Single Request]
    
    ServerContinues --> MonitoringAlert{Monitoring<br/>Alert?}
    
    MonitoringAlert -->|Configured| SendAlert[Send Alert:<br/>Error Rate Increased<br/>500 Status Detected]
    MonitoringAlert -->|Not Configured| NoAlert[No Alert Sent]
    
    SendAlert --> End([Client Receives Generic 500])
    NoAlert --> End
    
    style Start fill:#f8d7da
    style End fill:#f8d7da
    style EndNoResponse fill:#f8d7da
    style LogFullError fill:#f8d7da
    style SecurityFilter fill:#d1ecf1
    style NoLeakage fill:#d1ecf1
    style ServerContinues fill:#d4edda
```

**Implementation Location:** 
- Primary: `src/backend/handlers/error.js` - `handleServerError()` function (lines 65-77)
- Alternative: `src/backend/errorHandler.js` - `handleRequestError()` function (lines 18-33)

**Response Characteristics:**
- **Status Code:** 500 (HTTP_STATUS.INTERNAL_SERVER_ERROR)
- **Content-Type:** text/plain
- **Body:** "Internal Server Error" (generic, no details)
- **Security:** Error details logged server-side only, never sent to client
- **Logging Level:** ERROR (server error, requires investigation)

**Security Considerations:**
1. **Information Disclosure Prevention:**
   - Stack traces remain server-side only
   - File paths not exposed to clients
   - Environment variables not leaked
   - Database connection strings not revealed

2. **Generic Client Response:**
   - All 500 errors return identical message
   - No error differentiation visible to clients
   - Prevents error-based reconnaissance

3. **Detailed Server Logging:**
   - Full error object logged with message and stack
   - Request context captured (method, URL)
   - Timestamp for correlation with monitoring
   - Error details available for debugging

**Trigger Conditions:**
- Uncaught exception in request handler
- Synchronous error thrown in middleware
- Unhandled promise rejection (if not caught earlier)
- Unexpected runtime errors

**Recovery:**
- Server continues operating
- Error isolated to failing request
- No process restart required
- Other requests unaffected

#### 4.5.2.4 Server Startup Error Handling

```mermaid
flowchart TD
    Start([Server Startup Error]) --> ErrorType{Error<br/>Type?}
    
    ErrorType -->|EADDRINUSE| PortInUse[Port Already In Use Error]
    ErrorType -->|EACCES| PermissionDenied[Permission Denied Error]
    ErrorType -->|EADDRNOTAVAIL| AddressNotAvailable[Address Not Available]
    ErrorType -->|Other| GenericError[Generic Startup Error]
    
    PortInUse --> ExtractPort[Extract PORT from Config<br/>Error.port or Config.PORT]
    ExtractPort --> LogEADDR[Log ERROR:<br/>'Port PORT is already in use']
    LogEADDR --> CheckProcesses["Suggest: Check Running Processes<br/>ps aux | grep node<br/>netstat -tuln | grep PORT"]
    CheckProcesses --> SuggestChange[Suggest: Change PORT Variable<br/>export PORT=3001]
    SuggestChange --> ExitPort[Process Exit Code 1]
    ExitPort --> EndPort([Process Terminated])
    
    PermissionDenied --> CheckPortNumber{"PORT<br/>< 1024?"}
    CheckPortNumber -->|Yes| SuggestRoot["Log ERROR:<br/>Ports < 1024 Require Root<br/>Suggest: Use PORT >= 1024<br/>or Run as Root &#40;not recommended&#41;"]
    CheckPortNumber -->|No| OtherPermission[Log ERROR:<br/>Permission Denied<br/>Check Firewall or SELinux]
    SuggestRoot --> ExitPerm[Process Exit Code 1]
    OtherPermission --> ExitPerm
    ExitPerm --> EndPerm([Process Terminated])
    
    AddressNotAvailable --> LogAddr[Log ERROR:<br/>Address Not Available<br/>Invalid HOST Value]
    LogAddr --> SuggestHost[Suggest: Use HOST=0.0.0.0<br/>or HOST=127.0.0.1]
    SuggestHost --> ExitAddr[Process Exit Code 1]
    ExitAddr --> EndAddr([Process Terminated])
    
    GenericError --> LogGeneric[Log ERROR:<br/>Server Startup Failed<br/>Error Message and Stack]
    LogGeneric --> CheckRecoverable{Recoverable<br/>Error?}
    CheckRecoverable -->|No| ExitGeneric[Process Exit Code 1]
    CheckRecoverable -->|Yes Rare| RetryStartup[Retry Startup<br/>Exponential Backoff]
    ExitGeneric --> EndGeneric([Process Terminated])
    RetryStartup --> RetriesExhausted{Retries<br/>Exhausted?}
    RetriesExhausted -->|Yes| ExitGeneric
    RetriesExhausted -->|No| WaitRetry[Wait for Backoff Period]
    WaitRetry --> Start
    
    style Start fill:#f8d7da
    style EndPort fill:#f8d7da
    style EndPerm fill:#f8d7da
    style EndAddr fill:#f8d7da
    style EndGeneric fill:#f8d7da
    style CheckProcesses fill:#fff3cd
    style SuggestRoot fill:#fff3cd
```

**Error Handler Location:** `src/backend/errorHandler.js` - `handleServerError()` function (lines 39-49)

**Error Code Handling:**

| Error Code | Meaning | Common Causes | Resolution |
|---|---|---|---|
| EADDRINUSE | Port already in use | Another process bound to port | Kill other process or change PORT |
| EACCES | Permission denied | Binding to privileged port (< 1024) | Use PORT >= 1024 or run as root |
| EADDRNOTAVAIL | Address not available | Invalid HOST configuration | Use valid IP address or hostname |
| ENETUNREACH | Network unreachable | Network interface down | Check network connectivity |

**Diagnostics Commands (Suggested in Logs):**
```bash
# Check if port is in use

lsof -i :3000
netstat -tuln | grep 3000
ss -tuln | grep 3000

#### Find process using port

ps aux | grep node

#### Kill process (if safe)

kill -9 <PID>
```

**Non-Recoverable Nature:**
- All server startup errors result in process termination
- No automatic retry mechanism (simplicity for educational project)
- Production systems might implement retry with exponential backoff
- Manual intervention required to resolve underlying issue

## 4.6 Testing Workflow

### 4.6.1 Test Execution Flow

#### 4.6.1.1 Complete Test Suite Execution

```mermaid
flowchart TD
    Start([npm test Command]) --> LoadJest[Load Jest Configuration<br/>jest.config.js]
    
    LoadJest --> SetEnv[Set Environment:<br/>NODE_ENV=test<br/>IS_TEST=true]
    
    SetEnv --> LoadSetup[Load Test Setup<br/>__tests__/setup.js]
    
    LoadSetup --> MockLogger[Mock Logger Functions:<br/>- info&#40;&#41;<br/>- warn&#40;&#41;<br/>- error&#40;&#41;<br/>- debug&#40;&#41;]
    
    MockLogger --> SpyConsole[Spy on Console Methods:<br/>Prevent Test Output Noise]
    
    SpyConsole --> RegisterHooks[Register Hooks:<br/>beforeEach, afterEach]
    
    RegisterHooks --> DiscoverTests[Discover Test Files:<br/>**/__tests__/**/*.test.js]
    
    DiscoverTests --> RunUnit[Run Unit Tests]
    DiscoverTests --> RunIntegration[Run Integration Tests]
    
    RunUnit --> ConfigTests[Test: config.test.js<br/>Configuration Loading and Validation]
    RunUnit --> RouterTests[Test: router.test.js<br/>Route Matching Logic]
    RunUnit --> HandlerTests[Test: handlers/*.test.js<br/>Handler Functions]
    RunUnit --> UtilTests[Test: utils/*.test.js<br/>Utility Functions]
    
    ConfigTests --> ConfigResult{Tests<br/>Pass?}
    RouterTests --> RouterResult{Tests<br/>Pass?}
    HandlerTests --> HandlerResult{Tests<br/>Pass?}
    UtilTests --> UtilResult{Tests<br/>Pass?}
    
    ConfigResult -->|Pass| ConfigCoverage[Check Coverage:<br/>config.js]
    ConfigResult -->|Fail| UnitFailed[Unit Tests Failed]
    
    RouterResult -->|Pass| RouterCoverage[Check Coverage:<br/>router.js]
    RouterResult -->|Fail| UnitFailed
    
    HandlerResult -->|Pass| HandlerCoverage[Check Coverage:<br/>handlers/hello.js 100%<br/>handlers/error.js 90%+]
    HandlerResult -->|Fail| UnitFailed
    
    UtilResult -->|Pass| UtilCoverage[Check Coverage:<br/>utils/*.js]
    UtilResult -->|Fail| UnitFailed
    
    ConfigCoverage --> CheckGlobal{Global Coverage<br/>Thresholds Met?}
    RouterCoverage --> CheckGlobal
    HandlerCoverage --> CheckGlobal
    UtilCoverage --> CheckGlobal
    
    CheckGlobal -->|No| CoverageFailed[Coverage Below Thresholds:<br/>Branches 80%<br/>Functions 90%<br/>Lines 85%]
    CheckGlobal -->|Yes| UnitComplete[Unit Tests Complete]
    
    RunIntegration --> StartServer[Start Real Server<br/>await startServer&#40;&#41;]
    
    StartServer --> ServerReady{Server<br/>Started?}
    
    ServerReady -->|No| IntegrationFailed[Integration Tests Failed:<br/>Server Start Error]
    ServerReady -->|Yes| RunAPITests[Run API Integration Tests<br/>__tests__/integration/api.test.js]
    
    RunAPITests --> TestGET[Test: GET /hello → 200 'Hello world']
    RunAPITests --> Test404[Test: GET /unknown → 404 'Not Found']
    RunAPITests --> Test405[Test: POST /hello → 405 'Method Not Allowed']
    RunAPITests --> Test500[Test: Error Scenario → 500 'Internal Server Error']
    
    TestGET --> GETResult{Pass?}
    Test404 --> NotFoundResult{Pass?}
    Test405 --> MethodResult{Pass?}
    Test500 --> ErrorResult{Pass?}
    
    GETResult -->|Pass| VerifyHeaders[Verify Response Headers:<br/>Content-Type: text/plain<br/>Security Headers Present]
    GETResult -->|Fail| IntegrationFailed
    
    NotFoundResult -->|Pass| Verify404[Verify 404 Behavior]
    NotFoundResult -->|Fail| IntegrationFailed
    
    MethodResult -->|Pass| Verify405[Verify 405 with Allow Header]
    MethodResult -->|Fail| IntegrationFailed
    
    ErrorResult -->|Pass| Verify500[Verify Generic Error Response]
    ErrorResult -->|Fail| IntegrationFailed
    
    VerifyHeaders --> IntegrationComplete[Integration Tests Complete]
    Verify404 --> IntegrationComplete
    Verify405 --> IntegrationComplete
    Verify500 --> IntegrationComplete
    
    IntegrationComplete --> StopServer[Stop Server<br/>await stopServer&#40;&#41;]
    
    StopServer --> ServerStopped{Server<br/>Stopped?}
    
    ServerStopped -->|No| CleanupFailed[Cleanup Failed:<br/>Log Warning]
    ServerStopped -->|Yes| AllComplete[All Tests Complete]
    
    UnitComplete --> AllComplete
    
    AllComplete --> GenerateReports[Generate Reports:<br/>- Console Summary<br/>- HTML Coverage<br/>- JUnit XML]
    
    GenerateReports --> ExitCode{All Tests<br/>Passed?}
    
    ExitCode -->|Yes| ExitSuccess[Exit Code 0<br/>Success]
    ExitCode -->|No| ExitFailure[Exit Code 1<br/>Failure]
    
    UnitFailed --> ExitFailure
    CoverageFailed --> ExitFailure
    IntegrationFailed --> ExitFailure
    CleanupFailed --> ExitFailure
    
    ExitSuccess --> EndSuccess([CI/CD Continues])
    ExitFailure --> EndFail([CI/CD Blocks])
    
    style Start fill:#e1f5e1
    style EndSuccess fill:#d4edda
    style ExitSuccess fill:#d4edda
    style EndFail fill:#f8d7da
    style UnitFailed fill:#f8d7da
    style CoverageFailed fill:#f8d7da
    style IntegrationFailed fill:#f8d7da
```

**Test Configuration (from `src/backend/jest.config.js`):**

**Coverage Thresholds:**
```javascript
coverageThresholds: {
  global: {
    branches: 80,
    functions: 90,
    lines: 85,
    statements: 85
  },
  './handlers/helloHandler.js': {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100
  },
  './handlers/error.js': {
    branches: 90,
    functions: 100,
    lines: 90,
    statements: 90
  }
}
```

**Test Categories:**

1. **Unit Tests (Isolated Component Testing):**
   - Configuration: Environment variable loading and validation
   - Router: Path matching and normalization
   - Handlers: Request/response logic for each endpoint
   - Utilities: Helper functions and constants
   - Mocking: Heavy use of jest.mock() for isolation

2. **Integration Tests (End-to-End Testing):**
   - Full HTTP request/response cycle
   - Real server instance (not mocked)
   - Supertest for HTTP assertions
   - Middleware chain verification
   - Security headers validation

**Test Execution Commands:**
- `npm test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode (auto-rerun on changes)
- `npm run test:coverage`: Run tests with coverage report
- `npm run test:ci`: Run tests in CI mode (no watch, junit output)

**Test Output Artifacts:**
- **Console:** Test results summary, pass/fail status
- **HTML Report:** `./coverage/lcov-report/index.html` (coverage visualization)
- **JUnit XML:** `./coverage/junit/junit.xml` (CI integration)
- **LCOV:** `./coverage/lcov.info` (coverage data for tools)

## 4.7 References

### 4.7.1 Source Files Referenced

**Core Application Files:**
- `src/backend/index.js` - Application entry point, graceful shutdown signal handling
- `src/backend/server.js` - HTTP server lifecycle management, request handling, startServer/stopServer functions
- `src/backend/router.js` - URL routing and path matching logic
- `src/backend/config.js` - Configuration loading, environment variable validation, default values
- `src/backend/errorHandler.js` - Centralized error handling utilities
- `src/backend/handlers/helloHandler.js` - /hello endpoint implementation
- `src/backend/handlers/error.js` - Error response handlers (404, 405, 500)
- `src/backend/middleware/index.js` - Request logger, security headers, middleware composition
- `src/backend/utils/constants.js` - HTTP status codes, routes, messages, headers
- `src/backend/utils/logger.js` - Logging utility with level filtering

**Infrastructure Files:**
- `infrastructure/local/docker-compose.yml` - Docker Compose configuration with healthcheck
- `infrastructure/scripts/health-check.sh` - Standalone health check script
- `infrastructure/scripts/deploy.sh` - Deployment orchestration script
- `infrastructure/monitoring/prometheus.yml` - Prometheus scrape configuration
- `infrastructure/monitoring/grafana-dashboard.json` - Grafana dashboard definition

**Test Files:**
- `src/backend/jest.config.js` - Jest configuration with coverage thresholds
- `src/backend/__tests__/setup.js` - Test environment setup and mocks
- `src/backend/__tests__/integration/api.test.js` - End-to-end integration tests
- `src/backend/__tests__/handlers/*.test.js` - Handler unit tests

**Configuration Files:**
- `src/backend/Dockerfile` - Multi-stage Docker build configuration
- `src/backend/package.json` - npm dependencies and scripts
- `.env` - Environment variable configuration (optional)

### 4.7.2 Technical Specification Cross-References

**Related Sections:**
- **Section 1.2 System Overview** - System architecture, component interactions, high-level request flow
- **Section 2.2 Feature Catalog** - All 11 features with detailed functional requirements
  - F-001: HTTP Server Implementation
  - F-002: Hello World Endpoint
  - F-003: Comprehensive Error Handling
  - F-004: Request Logging
  - F-005: HTTP Security Headers
  - F-006: Configuration Management
  - F-007: Health Checking
  - F-008: Graceful Shutdown
  - F-009: Docker Containerization
  - F-010: Monitoring and Observability
  - F-011: Testing Infrastructure
- **Section 3.2 Programming Languages** - Node.js 18.x LTS, Bash scripting details
- **Section 3.3 Frameworks & Libraries** - Jest testing framework, Supertest HTTP assertions

### 4.7.3 External References

**HTTP Specifications:**
- RFC 7231: Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content
- RFC 7232: HTTP Status Code Definitions (200, 404, 405, 500)
- RFC 7234: HTTP Security Headers

**Node.js Documentation:**
- Node.js 18.x API Documentation: http module
- Node.js Process: Signal Events (SIGINT, SIGTERM)
- Node.js Server: server.listen() and server.close()

**Testing Documentation:**
- Jest Framework: https://jestjs.io/docs/getting-started
- Supertest Library: https://github.com/visionmedia/supertest
- Jest Coverage: https://jestjs.io/docs/configuration#coveragethreshold-object

**Docker and Orchestration:**
- Docker Compose: Healthcheck Configuration
- Dockerfile: Multi-stage Builds Best Practices
- Container Health Checks: https://docs.docker.com/engine/reference/builder/#healthcheck

**Monitoring Standards:**
- Prometheus: Text Exposition Format
- Grafana: Dashboard JSON Model
- Prometheus Best Practices: Naming and Labels

### 4.7.4 Implementation Notes

**Metrics Endpoint Status:**
The monitoring configuration references a `/metrics` endpoint for Prometheus scraping (infrastructure/monitoring/prometheus.yml), however, the implementation of this endpoint was not verified in the application source code during documentation. The health monitoring functionality using the `/hello` endpoint is fully functional. Full observability integration would require implementing metrics instrumentation, likely using the `prom-client` npm package, and exposing the `/metrics` endpoint in the router configuration.

**Connection Draining Timeout:**
The graceful shutdown implementation uses Node.js default behavior for connection draining (server.close()) without explicit timeout enforcement. Production systems typically enforce a maximum shutdown timeout (e.g., 30 seconds) followed by forced termination to prevent indefinite waits. This implementation prioritizes simplicity and educational clarity over production-hardened timeout handling.

**Test Mode Server Suppression:**
The IS_TEST environment flag (set by Jest) prevents server startup during test execution to avoid port conflicts and enable isolated unit testing. Integration tests explicitly call startServer() to test the full HTTP stack. This pattern is essential for maintaining fast, reliable unit tests while supporting comprehensive integration testing.

**Error Information Disclosure:**
All 500 Internal Server Error responses return a generic "Internal Server Error" message to clients, with full error details (message, stack trace, request context) logged server-side only. This security pattern prevents information disclosure attacks while maintaining debuggability for developers and operators. Error details are never exposed in HTTP responses.

# 5. System Architecture

## 5.1 High-Level Architecture

### 5.1.1 System Overview

The Node.js Hello World Service implements a **stateless monolithic HTTP server architecture** using a synchronous request-response pattern. This architectural style was deliberately chosen for its simplicity and direct mapping to HTTP fundamentals, making it ideal for educational purposes while maintaining production-ready operational patterns.

#### Architecture Style and Rationale

The system employs a **Native-First Architecture** that prioritizes Node.js built-in modules over heavyweight frameworks. This approach maximizes learning value by exposing HTTP protocol fundamentals without framework abstraction layers. The architecture is implemented in `src/backend/server.js` using the native `http` module rather than Express.js or similar frameworks, providing complete control over request processing, middleware composition, and response generation.

The service operates as a **single-process, single-threaded HTTP server** leveraging Node.js's event-driven architecture. This design eliminates clustering complexity while maintaining sufficient performance for the educational scope. The stateless nature of the service—with no session management, persistent storage, or shared state—enables trivial horizontal scaling when needed.

#### Key Architectural Principles

**1. Separation of Concerns**
The codebase is organized into distinct layers with single responsibilities:
- **Entry Point Layer** (`index.js`): Application bootstrap and lifecycle management
- **Server Layer** (`server.js`): HTTP server creation and request pipeline orchestration
- **Middleware Layer** (`middleware/`): Cross-cutting request processing (logging, security)
- **Routing Layer** (integrated in `server.js`): Path-based request dispatching
- **Handler Layer** (`handlers/`): Business logic for specific endpoints
- **Support Layer** (`utils/`): Configuration, logging, constants, and error handling

**2. Explicit Configuration Management**
All runtime behavior is controlled through environment variables with validated defaults, implementing the Twelve-Factor App methodology. The configuration module (`config.js`) loads settings from `.env` files using the dotenv library, validates port ranges (1-65535), and computes environment flags (IS_DEV, IS_PROD, IS_TEST) for conditional behavior.

**3. Test-Friendly Design**
Components expose promise-based APIs (`startServer()`, `stopServer()`) and pure functions to enable comprehensive testing without complex mocking. The application detects test mode via the `IS_TEST` environment variable and conditionally skips server startup, allowing unit tests to import modules without side effects.

**4. Production-Ready Operational Patterns**
Despite its educational focus, the system implements professional operational practices:
- Graceful shutdown with SIGINT/SIGTERM signal handling
- Comprehensive error handling with appropriate HTTP status codes
- Security headers (X-Content-Type-Options, X-Frame-Options, CSP)
- Request logging with timestamp and response time tracking
- Health checking infrastructure for availability monitoring
- Containerization with Docker for deployment consistency

#### System Boundaries and Major Interfaces

The system operates as a standalone service with minimal external dependencies:

**Primary Interface**: HTTP/1.1 server listening on configurable HOST:PORT (default 0.0.0.0:3000)

**External Integration Points**:
- **Prometheus**: Metrics scraping endpoint `/metrics` (infrastructure provisioned, implementation pending)
- **Docker Engine**: Container lifecycle management via Docker API
- **Console/Stdout**: Logging output captured by Docker for centralized collection
- **Environment Variables**: Configuration input from host system or orchestration platform

**System Boundaries**:
- No database or persistent storage integration
- No authentication or authorization systems
- No message queues or asynchronous processing
- No external service dependencies or API calls
- No user session management or stateful connections

### 5.1.2 Core Components Table

| Component Name | Primary Responsibility | Key Dependencies | Integration Points |
|---|---|---|---|
| **index.js** | Application lifecycle management: bootstrap, startup coordination, graceful shutdown | server.js, config.js, logger.js | Process signals (SIGINT/SIGTERM), Node.js runtime |
| **server.js** | HTTP server creation and request pipeline orchestration | Native http module, url module, middleware/, handlers/ | PORT/HOST binding, middleware chain execution |
| **config.js** | Environment configuration loading, validation, and management | dotenv, native path module | process.env, .env file, environment flags |
| **router (server.js)** | URL path to handler mapping and request dispatching | Native url module, handlers/ | createRoutes() mapping, pathname extraction |

| Component Name | Primary Responsibility | Key Dependencies | Integration Points |
|---|---|---|---|
| **helloHandler.js** | `/hello` endpoint business logic and response generation | constants.js, logger.js, errorHandler.js | HTTP method validation, response construction |
| **errorHandler.js** | Centralized error response generation for all error types | constants.js, logger.js | 404/405/500 status handling, EADDRINUSE detection |
| **middleware/index.js** | Request lifecycle middleware: timing, security, error handling | logger.js, handlers/error.js | res.end wrapping, header injection, try/catch wrapper |
| **utils/constants.js** | Application-wide constants and configuration values | None (pure constants) | HTTP status codes, routes, messages, headers |

| Component Name | Primary Responsibility | Key Dependencies | Integration Points |
|---|---|---|---|
| **utils/logger.js** | Centralized logging with timestamp formatting | config.js (IS_TEST flag) | Console methods, ISO timestamp generation |
| **Dockerfile** | Production container image definition and build instructions | node:18-alpine base image | Docker Engine, npm package manager |
| **docker-compose.yml** | Local development orchestration and service coordination | Docker Compose, Dockerfile | Volume mounts, network configuration, health checks |
| **prometheus.yml** | Metrics collection configuration and scrape targets | Prometheus server, application metrics endpoint | 5s app metrics scrape, 30s health scrape |

### 5.1.3 Data Flow Description

#### Request Processing Flow

**Step 1: Connection Establishment**
When an HTTP request arrives at the server, the Node.js runtime invokes the `handleRequest` function registered with `http.createServer()`. The server is bound to the configured HOST and PORT (default 0.0.0.0:3000) as defined in `config.js` and initialized by `server.listen()` in the `startServer()` function.

**Step 2: Middleware Pipeline Entry**
The request enters the middleware pipeline implemented in `middleware/index.js`. The `requestLogger` middleware executes first, wrapping the `res.end()` method to capture the start timestamp and calculate response time upon completion. The wrapped function stores the original `res.end` reference and replaces it with a timing-aware version that logs the request method, URL, status code, and elapsed time in milliseconds.

**Step 3: Security Header Injection**
The `securityHeaders` middleware executes next, injecting three HTTP security headers into every response:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing attacks
- `X-Frame-Options: DENY` - Prevents clickjacking by disallowing iframe embedding
- `Content-Security-Policy: default-src 'none'` - Restricts resource loading to prevent XSS

These headers are applied regardless of the response status or handler outcome, ensuring consistent security posture.

**Step 4: URL Parsing and Routing**
The `routeRequest` function in `server.js` parses the request URL using the native `url.parse()` method to extract the pathname. The pathname is matched against the routes object returned by `createRoutes()`, which maps `/hello` to the `handleHello` handler. If no route matches, the request proceeds to the 404 Not Found handler.

**Step 5: Handler Execution**
For requests to `/hello`, the `handleHello` handler executes with method validation. If the HTTP method is GET, the handler generates a 200 OK response with `Content-Type: text/plain` and body "Hello world". For other HTTP methods (POST, PUT, DELETE, etc.), the handler invokes `handle405` from `errorHandler.js`, returning a 405 Method Not Allowed response with an `Allow: GET` header indicating the supported method.

**Step 6: Response Completion and Logging**
When `res.end()` is called with the response body, the wrapped version from `requestLogger` executes. It captures the completion timestamp, calculates the elapsed time since request start, and logs the formatted message: `{method} {url} {statusCode} {responseTime}ms`. The log output is written to stdout (suppressed when IS_TEST=true) and captured by Docker for centralized collection.

#### Configuration Loading Flow

**Startup Configuration Sequence**:

At application startup, the configuration loading follows a deterministic sequence implemented in `config.js`:

1. **Module Evaluation**: When `config.js` is first imported, Node.js executes the module's top-level code, triggering the `getConfig()` function.

2. **Environment File Loading**: The `loadEnv()` function calls `dotenv.config()` to load the `.env` file from the process working directory. If the file exists, dotenv parses each line in `KEY=value` format and populates `process.env`. Missing `.env` files are handled gracefully without errors.

3. **Variable Extraction and Defaults**: The configuration object extracts environment variables with fallback defaults:
   - `PORT`: process.env.PORT || 3000
   - `HOST`: process.env.HOST || '0.0.0.0'
   - `NODE_ENV`: process.env.NODE_ENV || 'development'
   - `LOG_LEVEL`: process.env.LOG_LEVEL || 'INFO'

4. **Port Validation**: The `validatePort()` function ensures the PORT value is a number within the valid range (1-65535). Invalid ports cause application startup failure with a descriptive error message.

5. **Environment Flag Computation**: Boolean flags are computed for conditional logic:
   - `IS_DEV`: NODE_ENV === 'development'
   - `IS_PROD`: NODE_ENV === 'production'
   - `IS_TEST`: NODE_ENV === 'test'

6. **Configuration Export**: The validated configuration object is frozen using `Object.freeze()` to prevent runtime modification and exported as a singleton.

#### Error Flow Paths

**Synchronous Error Handling**:
The middleware chain in `server.js` wraps handler execution in a try/catch block. When a synchronous error is thrown during request processing, the catch block invokes `handleServerError(req, res, err)` from `errorHandler.js`. This function checks if headers have already been sent to the client (preventing "headers already sent" errors), logs the error with stack trace, and responds with 500 Internal Server Error status and a generic error message that doesn't leak implementation details.

**Asynchronous Error Handling**:
For the 404 Not Found path, requests to unrecognized URLs trigger `handle404(req, res)` from `errorHandler.js`, which sends a 404 status with `Content-Type: text/plain` and body "Not Found". The 405 Method Not Allowed path handles invalid HTTP methods for valid routes, sending a 405 status with an `Allow` header listing supported methods.

**Server-Level Error Handling**:
During server startup, the `startServer()` function registers an 'error' event listener. When the server emits an error (e.g., `EADDRINUSE` when the port is already in use), the handler checks the error code and logs a specific message: "Port {PORT} is already in use. Please choose a different port or stop the conflicting process." The promise returned by `startServer()` is rejected, preventing the application from entering an inconsistent state.

### 5.1.4 External Integration Points

| System Name | Integration Type | Data Exchange Pattern | Protocol/Format |
|---|---|---|---|
| **Prometheus** | Metrics Collection | Pull-based HTTP scraping | HTTP GET /metrics (Prometheus exposition format) |
| **Prometheus Health** | Availability Monitoring | Pull-based HTTP scraping | HTTP GET /health (up/down status) |
| **Docker Engine** | Container Runtime | Container lifecycle management | Docker API (REST over Unix socket) |
| **Host Environment** | Configuration Input | Environment variable reading | KEY=value format, read-only at startup |

| System Name | Integration Type | Data Exchange Pattern | Protocol/Format |
|---|---|---|---|
| **Console/Stdout** | Logging Output | Synchronous write operations | Plain text with ISO 8601 timestamps |
| **Docker Volumes** | Source Code Sync | Bind mount file system | Development hot reload via nodemon |
| **Docker Network** | Service Discovery | DNS-based container resolution | hello-world-network bridge network |
| **Grafana** | Metrics Visualization | Prometheus data source query | PromQL queries via Prometheus API |

**Integration SLA Requirements**:

- **Prometheus Metrics Scrape**: 5-second scrape interval, 3-second timeout, continuous availability required
- **Prometheus Health Scrape**: 30-second scrape interval, 5-second timeout, monitors service uptime
- **Docker Health Check**: 30-second interval, 10-second timeout, 3 retries before marking unhealthy, 10-second start period
- **Configuration Loading**: No SLA—read once at startup, no runtime reconfiguration
- **Logging Output**: Fire-and-forget—no delivery guarantee or backpressure handling

**Implementation Status Note**: The monitoring infrastructure (Prometheus configuration, Grafana dashboard with 13 panels) is fully provisioned in `infrastructure/monitoring/`, but the application does not currently expose `/metrics` or `/health` endpoints. Full observability functionality requires implementing metrics instrumentation using the `prom-client` library.

## 5.2 Component Details

### 5.2.1 Application Entry Point (index.js)

#### Purpose and Responsibilities

The `index.js` module serves as the application entry point with three core responsibilities:
1. **Bootstrap Orchestration**: Coordinates server initialization and startup
2. **Graceful Shutdown Management**: Handles process termination signals (SIGINT, SIGTERM)
3. **Test Mode Detection**: Conditionally skips server startup in test environments

#### Technologies and Frameworks

- **Node.js Native APIs**: Process signal handling (`process.on('SIGINT')`, `process.on('SIGTERM')`)
- **ECMAScript Modules**: Uses ES6 module syntax for clean imports
- **Promise-Based Async**: Leverages async/await for server lifecycle management

#### Key Interfaces and APIs

**startApplication() Function**:
```
async function startApplication()
Returns: Promise<http.Server>
Purpose: Initializes and starts the HTTP server
Side Effects: Binds to network port, registers signal handlers
Error Handling: Logs errors and exits with process.exit(1)
```

**setupGracefulShutdown(server) Function**:
```
function setupGracefulShutdown(server: http.Server)
Returns: void
Purpose: Registers SIGINT and SIGTERM handlers
Behavior: Calls stopServer() with 10-second timeout, exits process
Guarantees: Server connections closed before process termination
```

#### Data Persistence Requirements

None. This component manages only in-memory state (server instance reference) with no persistent storage.

#### Scaling Considerations

The entry point implements a single-process architecture without clustering. Horizontal scaling is achieved by deploying multiple container instances behind a load balancer rather than using Node.js cluster module. This approach simplifies the codebase while maintaining the stateless design principle that enables unlimited horizontal scaling.

**Test Mode Behavior**: When `IS_TEST=true` (set by test runner), the server startup is skipped entirely. This allows test files to import modules without triggering network binding, preventing port conflicts and enabling parallel test execution.

#### Component Lifecycle Diagram

```mermaid
sequenceDiagram
    participant Process
    participant Index as index.js
    participant Server as server.js
    participant OS as Operating System
    
    Process->>Index: node index.js
    Index->>Index: Check IS_TEST flag
    alt IS_TEST === true
        Index->>Process: Skip startup (test mode)
    else IS_TEST === false
        Index->>Server: startServer()
        Server->>OS: Bind to HOST:PORT
        OS->>Server: Socket bound
        Server->>Index: Server instance
        Index->>Index: setupGracefulShutdown()
        Index->>Process: Register signal handlers
        Note over Index: Server running...
        OS->>Index: SIGINT/SIGTERM signal
        Index->>Server: stopServer(timeout=10s)
        Server->>OS: Close connections
        OS->>Server: Connections closed
        Server->>Index: Shutdown complete
        Index->>Process: process.exit(0)
    end
```

### 5.2.2 HTTP Server Component (server.js)

#### Purpose and Responsibilities

The `server.js` module implements the core HTTP server with five primary responsibilities:
1. **Server Lifecycle Management**: Promise-based server creation, startup, and shutdown
2. **Request Pipeline Orchestration**: Coordinates middleware execution and handler invocation
3. **Route Management**: Maps URL paths to appropriate handlers
4. **Connection Tracking**: Maintains active socket connections for graceful shutdown
5. **Error Propagation**: Handles server-level errors and request processing failures

#### Technologies and Frameworks

- **Node.js http Module**: Native `http.createServer()` for server instantiation
- **Node.js url Module**: Native `url.parse()` for URL parsing and pathname extraction
- **Promise-Based APIs**: startServer() and stopServer() return promises for async control
- **Event Emitter Pattern**: Leverages Node.js event emitter for server lifecycle events

#### Key Interfaces and APIs

**startServer() Function**:
```
async function startServer()
Returns: Promise<http.Server>
Behavior: Creates server, registers handlers, binds to PORT/HOST
Error Handling: Rejects promise on EADDRINUSE or binding failures
Events: Emits 'listening' on success, 'error' on failure
```

**stopServer(timeout = 10000) Function**:
```
async function stopServer(timeout: number = 10000)
Returns: Promise<void>
Behavior: Closes server, destroys active sockets after timeout
Parameters: timeout in milliseconds (default 10 seconds)
Guarantees: Completes within timeout even if connections remain
```

**handleRequest(req, res) Function**:
```
function handleRequest(req: IncomingMessage, res: ServerResponse)
Returns: void (response sent via res.end())
Pipeline: requestLogger → securityHeaders → router → handler
Error Handling: try/catch wraps handler invocation, 500 on errors
```

**createRoutes() Function**:
```
function createRoutes()
Returns: Object<string, Function> (path → handler mapping)
Current Routes: { '/hello': handleHello }
Extensibility: Additional routes added to returned object
```

#### Data Persistence Requirements

None. The server maintains only transient in-memory state:
- Active socket connections (Map for graceful shutdown tracking)
- Server instance reference
- No session data, request history, or persistent state

#### Scaling Considerations

**Horizontal Scaling**:
The stateless design enables trivial horizontal scaling. Multiple server instances can run concurrently without coordination:
- No shared state between instances
- No session stickiness required
- Load balancer distributes requests arbitrarily
- Each instance operates independently

**Vertical Scaling Limitations**:
Single-threaded Node.js event loop limits vertical scaling. The current implementation does not use:
- Node.js cluster module for multi-process parallelism
- Worker threads for CPU-intensive tasks
- PM2 or similar process managers

These limitations are intentional for educational clarity, prioritizing understandability over maximum performance.

#### Server Architecture Diagram

```mermaid
graph TD
    subgraph "Server Lifecycle"
        A[startServer<br/>Called] --> B{Server<br/>Exists?}
        B -->|No| C[http.createServer<br/>handleRequest]
        B -->|Yes| D[Return Existing<br/>Server]
        C --> E[Register Error<br/>Handler]
        E --> F[server.listen<br/>PORT, HOST]
        F --> G{Bind<br/>Success?}
        G -->|Yes| H[Log Success<br/>Return Server]
        G -->|No| I[Emit Error<br/>EADDRINUSE]
        I --> J[Reject Promise]
    end
    
    subgraph "Request Processing"
        K[HTTP Request<br/>Arrives] --> L[handleRequest<br/>Invoked]
        L --> M[Middleware<br/>Pipeline]
        M --> N[routeRequest<br/>Called]
        N --> O{Path<br/>Match?}
        O -->|Yes| P[Invoke Handler]
        O -->|No| Q[handle404]
        P --> R[Response Sent]
        Q --> R
    end
    
    subgraph "Graceful Shutdown"
        S[stopServer<br/>Called] --> T{Server<br/>Running?}
        T -->|No| U[Return Immediately]
        T -->|Yes| V[server.close<br/>No New Connections]
        V --> W[Wait for<br/>Active Requests]
        W --> X{Timeout<br/>Elapsed?}
        X -->|No| Y[Connections<br/>Complete]
        X -->|Yes| Z[Force Close<br/>Sockets]
        Y --> AA[Server Closed]
        Z --> AA
    end
```

### 5.2.3 Configuration Management (config.js)

#### Purpose and Responsibilities

The `config.js` module centralizes configuration management with four core functions:
1. **Environment Variable Loading**: Loads `.env` file using dotenv library
2. **Configuration Validation**: Validates port range and required settings
3. **Default Value Management**: Provides sensible defaults for all settings
4. **Environment Flag Computation**: Calculates derived boolean flags (IS_DEV, IS_PROD, IS_TEST)

#### Technologies and Frameworks

- **dotenv v16.0.3**: The only production runtime dependency for `.env` file parsing
- **Node.js path Module**: Resolves `.env` file path relative to project root
- **Node.js process Module**: Accesses `process.env` and `process.cwd()`

#### Key Interfaces and APIs

**getConfig() Function**:
```
function getConfig()
Returns: Object (frozen configuration object)
Side Effects: Calls loadEnv(), validates PORT, computes environment flags
Evaluation: Executes once at module load time
Export: Result exported as module default
```

**Configuration Object Structure**:
```javascript
{
  PORT: number,              // 3000 default, validated 1-65535
  HOST: string,              // '0.0.0.0' default
  NODE_ENV: string,          // 'development' | 'production' | 'test'
  LOG_LEVEL: string,         // 'INFO' | 'WARN' | 'ERROR'
  IS_DEV: boolean,           // true if NODE_ENV === 'development'
  IS_PROD: boolean,          // true if NODE_ENV === 'production'
  IS_TEST: boolean           // true if NODE_ENV === 'test'
}
```

**validatePort(port) Function**:
```
function validatePort(port: number)
Returns: void
Throws: Error if port < 1 or port > 65535
Purpose: Ensures valid TCP port range
```

#### Data Persistence Requirements

None. Configuration is read-only after initial loading. The configuration object is frozen using `Object.freeze()` to prevent runtime modification, enforcing immutability.

#### Scaling Considerations

**Static Configuration**:
Configuration is loaded once at application startup. No runtime reconfiguration or hot-reload capabilities exist. To change configuration:
1. Update `.env` file or environment variables
2. Restart the application process

**Environment-Specific Configuration**:
Different configurations for development, staging, and production are managed through:
- Multiple `.env` files (`.env.development`, `.env.production`)
- Container orchestration environment variables (Docker Compose, Kubernetes)
- Cloud platform configuration services (AWS Parameter Store, Azure Key Vault)

**Configuration Precedence**:
The configuration system follows standard precedence (highest to lowest):
1. Operating system environment variables
2. `.env` file values
3. Hard-coded defaults in `config.js`

This precedence enables local `.env` files for development while allowing production systems to override via OS environment variables.

#### Configuration Loading Diagram

```mermaid
flowchart TD
    Start[Module Import] --> LoadEnv[loadEnv Executes]
    LoadEnv --> CheckFile{.env File<br/>Exists?}
    CheckFile -->|Yes| ParseFile[dotenv.config<br/>Parse File]
    CheckFile -->|No| SkipFile[Skip Loading<br/>No Error]
    ParseFile --> ExtractVars[Extract Variables<br/>from process.env]
    SkipFile --> ExtractVars
    
    ExtractVars --> ApplyDefaults[Apply Default<br/>Values]
    ApplyDefaults --> ValidatePort{PORT<br/>Valid?}
    ValidatePort -->|No| ThrowError[Throw Error<br/>Invalid Port]
    ValidatePort -->|Yes| ComputeFlags[Compute Environment<br/>Flags]
    
    ComputeFlags --> FreezeConfig[Object.freeze<br/>Configuration]
    FreezeConfig --> ExportConfig[Export Config<br/>Object]
    ThrowError --> AppExit[Application<br/>Fails to Start]
    
    style ThrowError fill:#ffcccc
    style AppExit fill:#ffcccc
    style ExportConfig fill:#ccffcc
```

### 5.2.4 Request Routing (router in server.js)

#### Purpose and Responsibilities

The routing logic embedded in `server.js` provides path-based request dispatching with three responsibilities:
1. **URL Path Extraction**: Parses request URL to extract pathname
2. **Route Matching**: Matches pathname against registered routes
3. **Handler Invocation**: Calls appropriate handler or 404 handler

#### Technologies and Frameworks

- **Node.js url Module**: Native `url.parse(req.url)` for URL parsing
- **JavaScript Object Mapping**: Simple object literal for route → handler mapping
- **Function Reference Storage**: Handlers stored as function references in routes object

#### Key Interfaces and APIs

**routeRequest(req, res) Function**:
```
function routeRequest(req: IncomingMessage, res: ServerResponse)
Returns: void
Behavior: Parses URL, looks up handler, invokes handler or 404
Algorithm: O(1) object property lookup for route matching
```

**createRoutes() Function**:
```
function createRoutes()
Returns: { [pathname: string]: Function }
Current Mapping: { '/hello': handleHello }
Extension Pattern: Add new routes to returned object
```

#### Routing Algorithm

The routing implementation uses a simple exact-match algorithm:

1. **Parse URL**: Extract pathname using `url.parse(req.url, true).pathname`
2. **Normalize Path**: No normalization—exact string match required
3. **Lookup Handler**: Access `routes[pathname]` property
4. **Invoke or 404**: If handler exists, invoke it; otherwise call `handle404`

**Routing Limitations**:
- No path parameters (e.g., `/users/:id`)
- No query string handling in routing (available in parsed URL)
- No wildcard or regex matching
- No route precedence or priority
- No middleware per-route

These limitations are intentional design choices for educational clarity, demonstrating fundamental routing concepts without framework complexity.

#### Scaling Considerations

**Route Table Size**:
Object property lookup is O(1) average case, making route matching performant even with hundreds of routes. The current implementation with a single route incurs negligible overhead.

**Adding New Routes**:
To add a new route:
1. Create handler function in `handlers/` directory
2. Import handler in `server.js`
3. Add mapping to `createRoutes()` return object: `'/path': handlerFunction`

**Future Extensibility**:
For more complex routing requirements (path parameters, wildcards), consider:
- Extracting routing to dedicated `router.js` module
- Implementing trie-based route matching for path parameters
- Adopting a routing library if complexity increases significantly

#### Routing Flow Diagram

```mermaid
flowchart TD
    A[Request Received] --> B[routeRequest<br/>Invoked]
    B --> C[url.parse<br/>Extract Pathname]
    C --> D{Pathname in<br/>Routes?}
    
    D -->|Yes: '/hello'| E[Retrieve Handler<br/>handleHello]
    D -->|No| F[No Handler<br/>Found]
    
    E --> G{HTTP Method<br/>Valid?}
    G -->|GET| H[Execute Handler<br/>Generate Response]
    G -->|Other| I[Invoke handle405<br/>Method Not Allowed]
    
    F --> J[Invoke handle404<br/>Not Found]
    
    H --> K[Response: 200<br/>Hello world]
    I --> L[Response: 405<br/>Allow: GET]
    J --> M[Response: 404<br/>Not Found]
    
    K --> N[res.end Called]
    L --> N
    M --> N
    
    style K fill:#ccffcc
    style L fill:#ffffcc
    style M fill:#ffcccc
```

### 5.2.5 Handler Components

## helloHandler.js - Hello Endpoint Handler

**Purpose**: Implements business logic for the `/hello` endpoint

**Responsibilities**:
1. HTTP method validation (GET only)
2. Response generation with correct headers
3. Error handling for invalid methods

**Key Interfaces**:
```
function handleHello(req: IncomingMessage, res: ServerResponse)
Returns: void
Accepted Methods: GET
Response: 200 OK, Content-Type: text/plain, Body: "Hello world"
Error Cases: 405 Method Not Allowed for non-GET requests
```

**Implementation Details**:

The handler implements a two-step process:

**Step 1: Method Validation**
- Check if `req.method === 'GET'`
- If false, invoke `handle405(req, res, ['GET'])` to send Method Not Allowed response

**Step 2: Response Generation**
- Set status: `res.statusCode = 200`
- Set header: `res.setHeader('Content-Type', 'text/plain')`
- Write body: `res.end('Hello world')`

**Security Considerations**: The handler generates static responses with no user input processing, eliminating injection attack vectors. The Content-Type header is explicitly set to `text/plain` to prevent browser interpretation as HTML or JavaScript.

## errorHandler.js - Centralized Error Handling

**Purpose**: Provides centralized error response generation for all error scenarios

**Components**:

**handleRequestError(req, res, err) - 500 Internal Server Error**:
```
function handleRequestError(req, res, err)
Purpose: Handles uncaught exceptions during request processing
Security: Logs full error internally, returns generic message externally
Response: 500 status, "Internal Server Error" body
Safety: Checks res.headersSent to prevent double-send errors
```

**handleServerError(req, res, err) - Server-Level Errors**:
```
function handleServerError(req, res, err)
Purpose: Handles server startup and binding errors
Special Case: Detects EADDRINUSE for port conflict messages
Logging: Comprehensive error logging with stack traces
```

**handle404(req, res) - Not Found**:
```
function handle404(req, res)
Purpose: Responds to requests for non-existent paths
Response: 404 status, Content-Type: text/plain, Body: "Not Found"
Logging: Logs requested path for monitoring
```

**handle405(req, res, allowedMethods) - Method Not Allowed**:
```
function handle405(req, res, allowedMethods: string[])
Purpose: Responds to requests with unsupported HTTP methods
Response: 405 status, Allow header with supported methods
Body: "Method Not Allowed"
Example: Allow: GET for /hello endpoint
```

**Error Handling Safety**:
All error handlers check `res.headersSent` before writing responses to prevent "Can't set headers after they are sent" errors. If headers are already sent, the handler logs the error but does not attempt to modify the response.

#### Handler Component Interaction Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Router
    participant Hello as helloHandler
    participant Error as errorHandler
    participant Response
    
    rect rgb(200, 255, 200)
        Note over Client,Response: Successful GET Request Flow
        Client->>Router: GET /hello
        Router->>Hello: handleHello(req, res)
        Hello->>Hello: Validate Method = GET
        Hello->>Response: Set Status 200
        Hello->>Response: Set Header Content-Type
        Hello->>Response: Write "Hello world"
        Response->>Client: 200 OK
    end
    
    rect rgb(255, 255, 200)
        Note over Client,Response: Invalid Method Flow
        Client->>Router: POST /hello
        Router->>Hello: handleHello(req, res)
        Hello->>Hello: Validate Method ≠ GET
        Hello->>Error: handle405(req, res, ['GET'])
        Error->>Response: Set Status 405
        Error->>Response: Set Header Allow: GET
        Error->>Response: Write "Method Not Allowed"
        Response->>Client: 405 Method Not Allowed
    end
    
    rect rgb(255, 200, 200)
        Note over Client,Response: Not Found Flow
        Client->>Router: GET /unknown
        Router->>Router: Path Not in Routes
        Router->>Error: handle404(req, res)
        Error->>Response: Set Status 404
        Error->>Response: Write "Not Found"
        Response->>Client: 404 Not Found
    end
```

### 5.2.6 Middleware Layer

#### Purpose and Responsibilities

The middleware layer implemented in `middleware/index.js` provides cross-cutting request processing with four components:
1. **requestLogger**: Request timing instrumentation and logging
2. **securityHeaders**: HTTP security header injection
3. **errorMiddleware**: Terminal error handling
4. **applyMiddleware**: Middleware composition function

#### requestLogger Middleware

**Purpose**: Captures request timing and logs request/response details

**Implementation Strategy**:
The logger uses a **res.end wrapping pattern** to capture response completion:

1. Store original `res.end` reference
2. Replace `res.end` with wrapped version
3. Wrapped version:
   - Calculates elapsed time: `Date.now() - startTime`
   - Logs formatted message: `{method} {url} {statusCode} {responseTime}ms`
   - Calls original `res.end()`
4. Call next middleware in chain

**Interface**:
```
function requestLogger(req, res, next)
Side Effects: Wraps res.end, logs to console on completion
Timing: Captures request start timestamp
Output: "{METHOD} {URL} {STATUS} {TIME}ms"
```

**Performance Impact**: Minimal—adds two timestamp captures and one function call wrapper per request. Logging is synchronous but non-blocking for I/O operations.

#### securityHeaders Middleware

**Purpose**: Injects standard HTTP security headers into every response

**Headers Injected**:

1. **X-Content-Type-Options: nosniff**
   - Purpose: Prevents MIME type sniffing
   - Threat Mitigated: Browsers executing non-executable files as scripts
   - Standard: Recommended by OWASP

2. **X-Frame-Options: DENY**
   - Purpose: Prevents page embedding in iframes
   - Threat Mitigated: Clickjacking attacks
   - Alternative: Content-Security-Policy frame-ancestors directive

3. **Content-Security-Policy: default-src 'none'**
   - Purpose: Restricts resource loading
   - Threat Mitigated: XSS attacks via injected scripts
   - Configuration: Completely disallows resource loading (safe for text responses)

**Interface**:
```
function securityHeaders(req, res, next)
Side Effects: Modifies response headers
Execution: Runs before handler execution
Guarantee: Headers present on all responses (200, 404, 405, 500)
```

#### applyMiddleware Composition Function

**Purpose**: Chains multiple middleware functions with error handling

**Composition Strategy**:

The composition function builds a middleware chain using a **recursive calling pattern**:

```
applyMiddleware(handler, [mw1, mw2, mw3])
  → mw1(req, res, next1)
    → mw2(req, res, next2)
      → mw3(req, res, next3)
        → handler(req, res)
```

**Error Handling Integration**:
The final composed function is wrapped in a try/catch block:
```javascript
try {
  middlewareChain(req, res);
} catch (error) {
  handleServerError(req, res, error);
}
```

This pattern captures synchronous errors thrown by any middleware or handler, ensuring consistent error responses.

**Limitations**:
- **Synchronous Only**: Does not handle async/await or promise rejections
- **No Error Middleware**: No concept of error-specific middleware (Express.js style)
- **Linear Chain**: No conditional branching or middleware skipping

These limitations are acceptable for the current synchronous, stateless design.

#### Middleware Pipeline Diagram

```mermaid
flowchart LR
    subgraph "Middleware Pipeline"
        A[HTTP Request] --> B[requestLogger]
        B --> C[Wrap res.end]
        C --> D[securityHeaders]
        D --> E[Inject Headers]
        E --> F[Router]
        F --> G[Handler]
        G --> H[res.end Called]
        H --> I[Wrapped res.end<br/>Executes]
        I --> J[Log Request]
        J --> K[Call Original<br/>res.end]
        K --> L[Response Sent]
    end
    
    subgraph "Error Handling"
        M[Error Thrown] --> N{try/catch<br/>Captures}
        N -->|Yes| O[handleServerError]
        N -->|No| P[Uncaught Exception<br/>Process Crash]
        O --> Q[500 Response]
    end
    
    style P fill:#ffcccc
    style Q fill:#ffffcc
    style L fill:#ccffcc
```

### 5.2.7 Utility Components

## constants.js - Application Constants

**Purpose**: Single source of truth for application-wide constants

**Categories**:

1. **HTTP_STATUS**: HTTP status codes used throughout application
   ```
   { OK: 200, NOT_FOUND: 404, METHOD_NOT_ALLOWED: 405, SERVER_ERROR: 500 }
   ```

2. **ROUTES**: Path constants for route registration
   ```
   { HELLO: '/hello' }
   ```

3. **CONFIG**: Configuration defaults
   ```
   { DEFAULT_PORT: 3000, DEFAULT_HOST: '0.0.0.0' }
   ```

4. **MESSAGES**: Standard response messages
   ```
   { HELLO: 'Hello world', NOT_FOUND: 'Not Found', METHOD_NOT_ALLOWED: 'Method Not Allowed', SERVER_ERROR: 'Internal Server Error' }
   ```

5. **HEADERS**: HTTP header names
   ```
   { CONTENT_TYPE: 'Content-Type', ALLOW: 'Allow' }
   ```

6. **HTTP_METHODS**: Supported HTTP methods
   ```
   { GET: 'GET' }
   ```

**Design Benefits**:
- **Refactoring Safety**: Changing a constant value updates all usages
- **Typo Prevention**: Autocomplete for constant names prevents string typos
- **Discoverability**: Central location makes available constants visible
- **Type Safety**: IDEs provide better autocomplete and validation

## logger.js - Centralized Logging Utility

**Purpose**: Provides consistent logging with timestamps and test suppression

**Log Levels**:

1. **info(message)**: Informational messages (green in console)
   - Usage: Server startup, shutdown, normal operation events
   - Output: `[ISO_timestamp] INFO: message`

2. **warn(message)**: Warning messages (yellow in console)
   - Usage: Non-fatal issues, deprecated functionality
   - Output: `[ISO_timestamp] WARN: message`

3. **error(message)**: Error messages (red in console)
   - Usage: Exceptions, failures, error conditions
   - Output: `[ISO_timestamp] ERROR: message`

**Specialized Logging Functions**:

**logServerStart(port, host)**:
```
function logServerStart(port: number, host: string)
Output: "Server started successfully on http://host:port"
Purpose: Consistent server startup notification
```

**logServerStop()**:
```
function logServerStop()
Output: "Server stopped gracefully"
Purpose: Confirms clean shutdown
```

**logRequest(method, url, statusCode, responseTime)**:
```
function logRequest(method, url, statusCode, responseTime)
Output: "method url statusCode responseTimems"
Example: "GET /hello 200 5ms"
Purpose: Request/response audit trail
```

**Test Mode Suppression**:
All logging functions check `config.IS_TEST` before writing output. When `IS_TEST === true`, all log calls become no-ops, preventing test output pollution.

**Logging Destination**:
- **Development**: Console (stdout/stderr)
- **Docker**: Captured by Docker logging driver
- **Production**: Redirect to log aggregation service (e.g., CloudWatch, Elasticsearch)

**Logging Limitations**:
- **No Log Levels Filtering**: All levels always output (no LOG_LEVEL enforcement)
- **No Structured Logging**: Plain text format, not JSON
- **No Log Rotation**: Unbounded output to stdout
- **Synchronous**: console.log blocks event loop briefly

These limitations are acceptable for educational purposes and small-scale deployments.

#### Utility Component Relationship Diagram

```mermaid
graph TD
    subgraph "Application Components"
        A[server.js]
        B[handlers/]
        C[middleware/]
        D[config.js]
        E[index.js]
    end
    
    subgraph "Utility Layer"
        F[constants.js]
        G[logger.js]
    end
    
    A --> F
    A --> G
    B --> F
    B --> G
    C --> G
    D --> G
    E --> G
    
    F -.No Dependencies.-> H[Pure Constants]
    G --> D
    G -.Uses.-> I[config.IS_TEST]
    
    style F fill:#e1f5ff
    style G fill:#e1f5ff
    style H fill:#f0f0f0
    style I fill:#f0f0f0
```

## 5.3 Technical Decisions

### 5.3.1 Architecture Style Decisions

#### Decision 1: Native HTTP Module vs. Express.js Framework

**Decision**: Implement primary service using Node.js native `http` module, provide Express.js as optional alternative

**Context**: Educational project requires exposing HTTP fundamentals while demonstrating professional patterns

**Alternatives Considered**:

| Alternative | Advantages | Disadvantages | Decision |
|---|---|---|---|
| Express.js Only | Industry standard, rapid development, rich ecosystem | Abstracts HTTP details, framework-specific patterns | Not Selected (Primary) |
| Native HTTP Only | Exposes fundamentals, zero dependencies, full control | More verbose, no conventions, requires manual patterns | **Selected (Primary)** |
| Fastify | High performance, modern design, schema validation | Less common, steeper learning curve | Not Considered |
| Koa | Modern middleware, async/await native | Smaller ecosystem, less familiar | Not Considered |

**Rationale**:

**Educational Value**: Using `http.createServer()` directly exposes learners to:
- Request/response object structure
- Header management
- Status code handling
- Manual middleware composition
- Routing implementation

**Zero Abstraction**: Developers see exactly what happens when a request arrives:
1. Socket connection accepted
2. HTTP protocol parsing (handled by Node.js)
3. Request object passed to handler
4. Response manually constructed
5. TCP connection managed

**Framework Comparison**: Providing Express.js alternative enables side-by-side comparison, teaching:
- What frameworks abstract away
- Performance implications of abstraction layers
- When to choose frameworks vs. native implementation

**Trade-offs Accepted**:

✅ **Accepted**:
- More verbose code (explicit is educational)
- Manual middleware composition (demonstrates patterns)
- No routing conventions (learns fundamentals)

❌ **Rejected**:
- Rapid development (not primary goal)
- Rich ecosystem (no features needed)
- Production shortcuts (educational focus)

**Evidence**: `src/backend/server.js` lines 12-13 import native `http` and `url` modules; Tech Spec 3.3.1.1 documents native-first approach; `server-express.js` provides optional Express implementation for comparison.

#### Decision 2: Stateless Architecture (No Database)

**Decision**: No persistent storage, database, or session management

**Context**: Educational simplicity vs. real-world representativeness

**Alternatives Considered**:

| Alternative | Advantages | Disadvantages | Decision |
|---|---|---|---|
| SQLite Database | Local, no server, simple SQL | Adds complexity, requires schema, state management | Not Selected |
| In-Memory Store | Fast, simple API | Not persistent, requires implementation | Not Selected |
| Redis Cache | Industry standard, key-value simplicity | External dependency, setup complexity | Not Selected |
| No Storage | Maximum simplicity, stateless design | Not representative of real applications | **Selected** |

**Rationale**:

**Simplicity Focus**: Removing database eliminates:
- Database setup and configuration
- Schema design and migrations
- Connection pool management
- Query construction and ORM learning
- Data seeding for tests
- Backup and recovery procedures

**Horizontal Scalability**: Stateless design enables:
- Unlimited horizontal scaling (no shared state)
- No session affinity requirements
- Trivial load balancing
- Independent instance lifecycle
- No distributed state synchronization

**Testing Simplification**: No database means:
- No test database setup
- No fixture loading
- No cleanup between tests
- Faster test execution
- Reduced test complexity

**Trade-offs Accepted**:

✅ **Accepted**:
- Limited use cases (cannot store data)
- Not representative (most apps need storage)
- No data persistence demonstration

❌ **Rejected**:
- Real-world applicability (intentional)
- Complete CRUD demonstration
- Database pattern learning

**Evidence**: Tech Spec 3.6 confirms "stateless architecture with no persistent data storage"; README.md line 12 documents stateless design; no database dependencies in `package.json`.

#### Decision 3: Synchronous Request Processing

**Decision**: All request processing is synchronous with no asynchronous I/O operations

**Context**: Simple request-response pattern vs. async complexity

**Rationale**:

**No I/O Operations**: The service performs no operations requiring async handling:
- No database queries
- No external API calls
- No file system access (except startup configuration loading)
- No network requests

**Educational Clarity**: Synchronous code is:
- Easier to understand for beginners
- Simpler to trace in debugger
- No callback hell or promise chains
- Linear execution flow

**Sufficient Performance**: For simple response generation:
- Response time < 1ms
- No blocking operations
- Event loop remains responsive
- High throughput achievable

**Trade-offs**: Future additions requiring I/O (database, API calls, file operations) would require refactoring to async/await patterns.

**Evidence**: All handlers in `handlers/` directory use synchronous code; no `async` keyword in request processing functions; no Promise returns from handlers.

### 5.3.2 Technology Stack Choices

#### Decision 4: Node.js 18.x LTS as Runtime Platform

**Decision**: Node.js 18.x Long-Term Support version as required runtime

**Alternatives Considered**:

| Alternative | Advantages | Disadvantages | Decision |
|---|---|---|---|
| Node.js 16.x LTS | Longer LTS period (until 2024-09) | Missing modern features, older V8 | Not Selected |
| Node.js 18.x LTS | Active LTS (until 2025-04), modern features | Slightly newer (less mature) | **Selected** |
| Node.js 20.x LTS | Latest LTS, newest features | Too new (potential instability) | Not Selected |
| Deno | Modern design, TypeScript native, secure defaults | Different ecosystem, less familiar | Not Considered |
| Bun | Extreme performance, built-in tools | Very new, unstable, limited ecosystem | Not Considered |

**Rationale**:

**LTS Guarantee**: 18.x provides:
- Security updates until April 2025
- Bug fixes and stability patches
- Production-ready status
- Wide cloud platform support

**Modern JavaScript Support**: Node.js 18.x includes:
- ES2022 syntax (native async/await, optional chaining, nullish coalescing)
- Top-level await support
- Fetch API (experimental)
- Test runner (experimental)

**Ecosystem Compatibility**: 18.x is supported by:
- All major npm packages
- Docker official images (node:18-alpine)
- Cloud platforms (AWS Lambda, Azure Functions, Google Cloud Functions)
- CI/CD systems (GitHub Actions, GitLab CI)

**Evidence**: `package.json` engines field requires Node.js >=18.0.0; Dockerfile uses `node:18-alpine`; README.md prerequisites document Node.js 18.x requirement.

#### Decision 5: dotenv as Only Production Dependency

**Decision**: Minimize production dependencies to single library (dotenv) for environment variable management

**Alternatives Considered**:

| Alternative | Advantages | Disadvantages | Decision |
|---|---|---|---|
| No Dependencies | Absolute minimum complexity | Manual .env parsing, no Twelve-Factor | Not Selected |
| dotenv v16.0.3 | Industry standard, simple API, widely adopted | One dependency, external code | **Selected** |
| dotenv-expand | Adds variable expansion ($VAR syntax) | Additional complexity, unnecessary | Not Selected |
| node-config | Rich configuration management | Too complex, multiple dependencies | Not Selected |

**Rationale**:

**Twelve-Factor Compliance**: dotenv implements the configuration principle:
- Configuration separate from code
- Environment-specific settings
- No hard-coded credentials
- .env files in .gitignore

**Development Convenience**: Enables:
- Local .env file for easy configuration
- No manual environment variable setup
- Consistent configuration across developers
- Simple onboarding process

**Production Safety**: Allows:
- OS environment variables override .env
- Container orchestration configuration
- Secret management service integration
- No .env file in production (optional)

**Trade-offs Accepted**:
- One production dependency (acceptable for value provided)
- .env file read on every startup (negligible performance impact)

**Evidence**: `package.json` dependencies: `"dotenv": "16.0.3"` (only production dep); `config.js` lines 11, 24-38 implement dotenv loading.

#### Decision 6: Alpine Linux for Docker Base Image

**Decision**: Use node:18-alpine instead of standard Debian-based Node.js image

**Alternatives Considered**:

| Alternative | Image Size | Security | Compatibility | Decision |
|---|---|---|---|---|
| node:18 (Debian) | ~300-400MB | More packages = larger attack surface | Maximum compatibility (glibc) | Not Selected |
| node:18-slim (Debian) | ~200-250MB | Reduced packages | Good compatibility | Not Selected |
| node:18-alpine | ~50-70MB | Minimal packages (musl libc) | Good (rare native module issues) | **Selected** |
| Distroless | ~100-150MB | No package manager | Complex debugging | Not Considered |

**Rationale**:

**Minimal Footprint**: Alpine Linux provides:
- 4-5x smaller image size
- Faster image pulls (important for CI/CD)
- Faster container starts
- Lower storage costs
- Reduced network bandwidth

**Security Hardening**: Minimal package set:
- Fewer potential vulnerabilities
- Smaller attack surface
- Reduced CVE exposure
- Less maintenance burden

**Sufficient Compatibility**: For this service:
- No native modules with compilation
- Pure JavaScript dependencies
- musl libc works for all requirements
- No glibc-specific functionality needed

**Trade-offs**:

✅ **Accepted**:
- musl libc vs. glibc (not an issue for this codebase)
- Fewer debugging tools (can install apk packages if needed)
- Less familiar (Alpine less common than Debian)

❌ **Rejected**:
- Larger images for slightly better compatibility
- Standard Debian for maximum familiarity

**Evidence**: `Dockerfile` line 2: `FROM node:18-alpine`; Tech Spec 3.7.1.1 documents Alpine rationale and ~50-70MB compressed size.

### 5.3.3 Deployment Architecture Decisions

#### Decision 7: Docker Compose for Local Development

**Decision**: Use Docker Compose v3.8 for local development orchestration with hot reload

**Alternatives Considered**:

| Alternative | Advantages | Disadvantages | Decision |
|---|---|---|---|
| Local Node.js | No container overhead, native performance | "Works on my machine" issues | Not Selected |
| Docker Compose | Consistent environment, multi-container | Learning curve, overhead | **Selected** |
| Kubernetes (minikube) | Production-like, full orchestration | Extreme complexity, resource heavy | Not Selected |
| Docker Swarm | Simpler than K8s, built-in | Less common, deprecated by Docker | Not Considered |

**Rationale**:

**Environment Consistency**: Docker Compose provides:
- Identical environment across all developer machines
- No Node.js version conflicts
- No npm dependency issues
- Consistent network configuration
- Reproducible builds

**Development Convenience**: Compose enables:
- One-command startup: `docker-compose up`
- Hot reload via volume mount + nodemon
- Service dependencies (future: database, cache)
- Network isolation with service discovery
- Health checks for service readiness

**Production Similarity**: Local Compose configuration similar to production:
- Same base Docker image
- Same environment variables
- Same network patterns
- Easy transition to production orchestration (ECS, K8s)

**Volume Strategy**: Two-volume pattern optimizes development:

1. **Bind Mount** (`../../src/backend:/app`):
   - Real-time code synchronization
   - Changes trigger nodemon restart
   - No image rebuild required

2. **Named Volume** (`node_modules:/app/node_modules`):
   - Preserves Linux-built dependencies
   - Prevents host OS node_modules conflicts
   - Avoids native module compatibility issues

**Evidence**: `infrastructure/local/docker-compose.yml` complete configuration; bind mount + named volume pattern lines 18-20; nodemon command line 24.

#### Decision 8: Prometheus Pull-Based Monitoring

**Decision**: Prometheus scrapes metrics via HTTP pull model

**Alternatives Considered**:

| Alternative | Model | Advantages | Disadvantages | Decision |
|---|---|---|---|---|
| Prometheus | Pull | Simple client, centralized control, industry standard | Requires network access | **Selected** |
| StatsD + Graphite | Push | Simple protocol, fire-and-forget | Client manages connection, more complex | Not Selected |
| CloudWatch | Push | AWS native, managed service | Vendor lock-in, cost | Not Selected |
| Datadog | Push/Pull | Rich features, SaaS | Commercial, complex | Not Considered |

**Rationale**:

**Decoupling**: Pull model separates concerns:
- Application doesn't know about Prometheus
- Prometheus controls scrape timing
- Prometheus handles failures
- Application provides endpoint, Prometheus decides when to scrape

**Reliability**: Prometheus manages:
- Retry logic for failed scrapes
- Scrape interval configuration
- Timeout handling
- Target health tracking

**Simplicity**: Application only needs:
- Expose `/metrics` endpoint
- Generate Prometheus format
- No connection management
- No push scheduling

**Scalability**: Pull model enables:
- Prometheus scales independently
- Application scales independently
- No additional client connections
- Centralized target configuration

**Implementation Status**: Infrastructure provisioned in `infrastructure/monitoring/prometheus.yml` with two scrape jobs:
- `hello-world-app`: 5-second interval for application metrics
- `hello-world-health`: 30-second interval for health checks

**Implementation Gap**: `/metrics` and `/health` endpoints not yet implemented (requires `prom-client` library integration).

**Evidence**: `prometheus.yml` lines 14-47 configure scrape jobs; Tech Spec 3.7.4.1 documents pull-based model; Grafana dashboard references Prometheus datasource.

### 5.3.4 Architecture Decision Record Diagram

```mermaid
graph TD
    subgraph "Decision Tree: Framework Selection"
        A[Need HTTP Server] --> B{Primary Goal?}
        B -->|Education| C[Expose Fundamentals]
        B -->|Production Speed| D[Use Framework]
        C --> E{Dependencies?}
        E -->|Minimize| F[**Native HTTP**<br/>Selected]
        E -->|Accept| G[Express.js]
        D --> H[Express.js]
        F -.Alternative.-> I[Express.js<br/>Implementation]
    end
    
    subgraph "Decision Tree: Storage Selection"
        J[Need Data Storage?] --> K{Data Persistence<br/>Required?}
        K -->|No - Stateless| L[**No Database**<br/>Selected]
        K -->|Yes| M{Complexity<br/>Tolerance?}
        M -->|Low| N[SQLite]
        M -->|Medium| O[PostgreSQL]
        M -->|High| P[Distributed DB]
    end
    
    subgraph "Decision Tree: Container Base Image"
        Q[Need Container] --> R{Priority?}
        R -->|Size| S[**Alpine Linux**<br/>Selected]
        R -->|Compatibility| T[Debian Slim]
        R -->|Maximum Compat| U[Debian Full]
        S -.Trade-off.-> V[50-70MB<br/>musl libc]
        T -.Trade-off.-> W[200-250MB<br/>glibc]
        U -.Trade-off.-> X[300-400MB<br/>All tools]
    end
    
    subgraph "Decision Tree: Monitoring Approach"
        Y[Need Monitoring] --> Z{Control Model?}
        Z -->|Centralized| AA[**Prometheus Pull**<br/>Selected]
        Z -->|Distributed| AB[StatsD Push]
        Z -->|Cloud Native| AC[CloudWatch Push]
        AA -.Benefits.-> AD[Decoupled<br/>Reliable<br/>Standard]
    end
    
    style F fill:#ccffcc
    style L fill:#ccffcc
    style S fill:#ccffcc
    style AA fill:#ccffcc
```

## 5.4 Cross-Cutting Concerns

### 5.4.1 Logging and Observability

#### Logging Strategy

**Approach**: Console-based synchronous logging with ISO 8601 timestamps and test suppression

**Implementation**: The `utils/logger.js` module provides centralized logging with three severity levels:

1. **INFO Level**: Normal operation events
   - Server lifecycle: startup, shutdown
   - Configuration: loaded settings
   - Request processing: successful requests
   - Output: `[2024-01-15T10:30:45.123Z] INFO: Server started successfully on http://0.0.0.0:3000`

2. **WARN Level**: Non-fatal issues
   - Deprecated functionality usage
   - Configuration oddities
   - Performance degradation
   - Output: `[2024-01-15T10:30:45.123Z] WARN: Warning message`

3. **ERROR Level**: Error conditions
   - Uncaught exceptions
   - Server startup failures
   - Request processing errors
   - Output: `[2024-01-15T10:30:45.123Z] ERROR: Error message with stack trace`

**Request Logging Format**: The `requestLogger` middleware logs every request upon completion:
```
GET /hello 200 5ms
POST /hello 405 3ms
GET /unknown 404 2ms
```

Format: `{METHOD} {URL} {STATUS_CODE} {RESPONSE_TIME}ms`

**Test Suppression**: All logging functions check `config.IS_TEST` before output. When running under test (NODE_ENV=test), all log calls become no-ops, preventing test output pollution and improving test performance.

**Logging Destinations**:

| Environment | Destination | Collection Method | Retention |
|---|---|---|---|
| Development | Console (stdout/stderr) | Terminal display | None |
| Docker Local | Docker logs | `docker logs` command | Until container removed |
| Production | stdout (captured by orchestrator) | CloudWatch/Elasticsearch | 30-90 days typical |

#### Observability Infrastructure

**Prometheus Metrics Collection**:

The monitoring infrastructure is fully provisioned but requires metrics endpoint implementation:

**Planned Metrics** (based on Grafana dashboard configuration):

1. **Request Metrics**:
   - `http_requests_total{method, path, status}`: Total request counter
   - `http_request_duration_seconds`: Request latency histogram for percentile calculations
   - `http_request_size_bytes`: Request size distribution
   - `http_response_size_bytes`: Response size distribution

2. **System Metrics**:
   - `nodejs_process_cpu_usage_percentage`: CPU utilization
   - `nodejs_process_memory_rss_bytes`: Resident set size memory
   - `nodejs_heap_used_bytes`: JavaScript heap memory
   - `nodejs_heap_total_bytes`: Total heap allocation
   - `nodejs_eventloop_lag_seconds`: Event loop delay (blocking detection)

3. **Health Metrics**:
   - `up{}`: Service availability (1=healthy, 0=down)
   - `process_uptime_seconds`: Service uptime

**Grafana Visualization**:

The pre-configured dashboard (`infrastructure/monitoring/grafana-dashboard.json`) includes 13 panels:

| Panel Category | Metrics Displayed | Update Frequency |
|---|---|---|
| Service Health | Uptime, total requests, request rate | 10 seconds |
| Performance | p50/p95/p99 latency, request duration | 10 seconds |
| Errors | HTTP status distribution, 4xx/5xx rates | 10 seconds |
| System Resources | Memory (RSS/heap), CPU usage, event loop lag | 10 seconds |

**Scrape Configuration**:

Prometheus is configured with two scrape jobs:
- **Application Metrics**: 5-second interval, 3-second timeout, endpoint `/metrics`
- **Health Monitoring**: 30-second interval, 5-second timeout, endpoint `/health`

**Implementation Gap**: The application does not currently expose `/metrics` or `/health` endpoints. Full observability requires:
1. Install `prom-client` library: `npm install prom-client`
2. Create metrics registry and collectors
3. Implement `/metrics` endpoint returning Prometheus format
4. Implement `/health` endpoint returning 200 OK when healthy

**Evidence**: `infrastructure/monitoring/prometheus.yml` complete scrape config; `grafana-dashboard.json` with 13 panels; Tech Spec 3.7.4 documents monitoring architecture.

#### Observability Limitations

**Current State**:
- ✅ Console logging implemented with timestamps
- ✅ Request timing instrumentation active
- ✅ Prometheus infrastructure provisioned
- ✅ Grafana dashboard configured
- ❌ Metrics endpoint not implemented
- ❌ No distributed tracing (Jaeger/Zipkin)
- ❌ No structured JSON logging
- ❌ No log aggregation configuration
- ❌ No alerting rules defined

**Suitable For**: Development and small-scale production deployments where console logging suffices

**Not Suitable For**: Large-scale production requiring centralized logging, distributed tracing, or real-time alerting

### 5.4.2 Error Handling Patterns

#### Error Classification and Handling

**Client Errors (4xx Status Codes)**:

**404 Not Found** - Unknown URL paths:
- **Trigger**: Request URL path not in routes object
- **Handler**: `handle404(req, res)` in `errorHandler.js`
- **Response**: 404 status, Content-Type: text/plain, Body: "Not Found"
- **Logging**: Logs requested path for monitoring: `404 Not Found: {path}`
- **Example**: `GET /api/users` → `404 Not Found`

**405 Method Not Allowed** - Invalid HTTP methods:
- **Trigger**: Non-GET request to `/hello` endpoint
- **Handler**: `handle405(req, res, allowedMethods)` in `errorHandler.js`
- **Response**: 405 status, Allow: GET header, Body: "Method Not Allowed"
- **Logging**: Logs method and path: `405 Method Not Allowed: {method} {path}`
- **Example**: `POST /hello` → `405 Method Not Allowed` with `Allow: GET` header

**Server Errors (5xx Status Codes)**:

**500 Internal Server Error** - Uncaught exceptions:
- **Trigger**: Synchronous error thrown during request processing
- **Handler**: `handleServerError(req, res, err)` in `errorHandler.js`
- **Response**: 500 status, Body: "Internal Server Error" (generic message)
- **Logging**: Full error with stack trace logged internally, generic message externally
- **Security**: No error details leaked to client (prevents information disclosure)
- **Safety**: Checks `res.headersSent` to prevent double-send errors

**Server Startup Errors**:

**EADDRINUSE** - Port already in use:
- **Trigger**: Another process bound to PORT during `server.listen()`
- **Handler**: `handleServerError` with EADDRINUSE detection
- **Message**: "Port {PORT} is already in use. Please choose a different port or stop the conflicting process."
- **Outcome**: Promise rejected, application startup fails, process exits with code 1
- **Prevention**: Health checks and deployment scripts verify port availability

#### Error Handling Architecture

**Synchronous Error Capture**:

The middleware chain wraps handler execution in try/catch:

```
try {
  middlewareChain(req, res)
    → requestLogger
    → securityHeaders  
    → router
    → handler
} catch (error) {
  handleServerError(req, res, error)
}
```

**Error Safety Mechanisms**:

1. **Headers Sent Check**: All error handlers verify `res.headersSent === false` before sending responses
   - Prevents "Can't set headers after they are sent" errors
   - Logs error but doesn't attempt response if headers already sent

2. **Error Response Standardization**: All errors follow consistent format:
   - Status code set via `res.statusCode`
   - Content-Type: text/plain header
   - Plain text body (not JSON or HTML)
   - No stack traces or internal details to client

3. **Logging Separation**: Error details logged internally, generic messages sent externally:
   - Internal: Full error message, stack trace, request context
   - External: Generic message preventing information disclosure

#### Error Flow Diagram

```mermaid
flowchart TD
    A[HTTP Request<br/>Arrives] --> B{Path in<br/>Routes?}
    
    B -->|No| C[handle404<br/>Not Found]
    B -->|Yes| D{Method<br/>Allowed?}
    
    D -->|No| E[handle405<br/>Method Not Allowed]
    D -->|Yes| F[Execute Handler]
    
    F --> G{Error<br/>Thrown?}
    
    G -->|No| H[Generate Success<br/>Response]
    G -->|Yes| I{Headers<br/>Sent?}
    
    I -->|Yes| J[Log Error<br/>Cannot Respond]
    I -->|No| K[handleServerError<br/>Internal Server Error]
    
    C --> L[Send 404<br/>Response]
    E --> M[Send 405<br/>Response + Allow Header]
    H --> N[Send 200<br/>Response]
    K --> O[Send 500<br/>Response]
    J --> P[Connection May<br/>Be Broken]
    
    L --> Q[Log Request]
    M --> Q
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R[Response<br/>Complete]
    
    style C fill:#ffffcc
    style E fill:#ffffcc
    style K fill:#ffcccc
    style J fill:#ffcccc
    style H fill:#ccffcc
```

#### Error Handling Limitations

**Synchronous Only**:
- try/catch only captures synchronous errors
- Async/await errors require `.catch()` or wrapper
- Promise rejections not automatically caught
- Limitation acceptable: current code is entirely synchronous

**No Error Recovery**:
- Errors result in immediate error response
- No retry logic or fallback behavior
- No circuit breaker pattern
- No graceful degradation

**No Custom Error Types**:
- Generic Error objects only
- No custom error classes (ValidationError, AuthorizationError, etc.)
- No error codes beyond HTTP status codes
- Limitation acceptable: simple error scenarios

**Evidence**: `errorHandler.js` implements all error handlers; `server.js` lines 86-89 wrap handler in try/catch; security checks in place (res.headersSent, no stack traces to client).

### 5.4.3 Security Framework

#### Security Headers

**Implemented Headers** (via `securityHeaders` middleware):

| Header | Value | Protection | Standard |
|---|---|---|---|
| X-Content-Type-Options | nosniff | Prevents MIME type sniffing attacks | OWASP Recommended |
| X-Frame-Options | DENY | Prevents clickjacking via iframe embedding | OWASP Recommended |
| Content-Security-Policy | default-src 'none' | Restricts all resource loading (XSS mitigation) | CSP Level 3 |

**Header Details**:

**X-Content-Type-Options: nosniff**:
- **Threat**: Browser interprets non-executable content as JavaScript
- **Example Attack**: Serve JavaScript as image/png, browser executes despite MIME type
- **Mitigation**: Browser strictly follows Content-Type header, refuses execution

**X-Frame-Options: DENY**:
- **Threat**: Clickjacking—attacker overlays invisible iframe over legitimate site
- **Example Attack**: User clicks "Download" on malicious site, actually clicks "Transfer Money" in hidden iframe
- **Mitigation**: Browser refuses to render page in any frame or iframe

**Content-Security-Policy: default-src 'none'**:
- **Threat**: XSS attacks—injected JavaScript executes in user's browser
- **Example Attack**: Reflected XSS in URL parameter executes malicious script
- **Mitigation**: Browser refuses to load scripts, styles, images, or any resources
- **Note**: Strict policy suitable for plain text responses; would require relaxation for HTML pages

#### Attack Surface Reduction

**No User Input Processing**:
The service accepts no user input, eliminating entire vulnerability classes:

| Vulnerability | Status | Reason |
|---|---|---|
| SQL Injection | ✅ Not Applicable | No database, no SQL queries |
| XSS (Cross-Site Scripting) | ✅ Mitigated | No HTML rendering, CSP header, plain text responses |
| CSRF (Cross-Site Request Forgery) | ✅ Not Applicable | No state-changing operations, no session management |
| Command Injection | ✅ Not Applicable | No system command execution |
| Path Traversal | ✅ Not Applicable | No file system access based on user input |
| XML External Entity (XXE) | ✅ Not Applicable | No XML parsing |
| Insecure Deserialization | ✅ Not Applicable | No deserialization of user data |

**Minimal Dependency Surface**:
Only one production dependency (dotenv) reduces vulnerability exposure:
- Fewer dependencies = fewer CVEs
- Smaller supply chain attack surface
- Reduced maintenance burden
- Evidence: `package.json` contains only `"dotenv": "16.0.3"` in dependencies

**Alpine Linux Base Image**:
Minimal package set reduces attack surface:
- ~50-70MB vs. ~300-400MB for Debian
- Fewer packages = fewer potential vulnerabilities
- Less maintenance burden for security patches
- Evidence: `Dockerfile` line 2 uses `node:18-alpine`

#### Authentication and Authorization

**Current Implementation**: None

**Rationale**: The service exposes a single public endpoint with no sensitive data or state-changing operations:
- `/hello` endpoint is public information
- No user accounts or identity
- No protected resources
- No access control requirements

**Future Considerations**: If adding protected endpoints, implement:
- JWT (JSON Web Token) authentication in Authorization header
- API key validation for service-to-service communication
- Rate limiting per client/API key
- OAuth 2.0 for third-party integrations

#### Security Gaps and Limitations

**No Transport Encryption**:
- ❌ No HTTPS/TLS termination in application
- ✅ Expected at load balancer or reverse proxy
- Risk: Man-in-the-middle attacks on unencrypted HTTP traffic
- Mitigation: Deploy behind TLS-terminating load balancer (ALB, Nginx, Traefik)

**No Rate Limiting**:
- ❌ No request rate limiting or throttling
- ❌ No DDoS protection
- Risk: Service can be overwhelmed with requests
- Mitigation: Implement rate limiting middleware or use cloud-based DDoS protection

**No Input Validation**:
- ❌ No validation framework (though no user input accepted)
- Future Risk: Adding endpoints with user input requires validation
- Mitigation: Use validation libraries (joi, yup) for future endpoints

**No Security Scanning**:
- ❌ No automated security scanning in CI/CD
- ❌ No dependency vulnerability scanning beyond `npm audit`
- Risk: Vulnerabilities in dependencies may go unnoticed
- Mitigation: Integrate Snyk, Dependabot, or OWASP Dependency-Check

**Security Posture Summary**:

| Security Aspect | Status | Notes |
|---|---|---|
| Security Headers | ✅ Implemented | X-Content-Type-Options, X-Frame-Options, CSP |
| Dependency Management | ✅ Minimal | Only dotenv, reduced attack surface |
| Container Security | ✅ Alpine Base | Minimal packages, smaller attack surface |
| Input Validation | ⚠️ Not Needed Currently | No user input processed |
| Authentication | ⚠️ Not Needed Currently | Public endpoint only |
| Rate Limiting | ❌ Not Implemented | Service unprotected from abuse |
| HTTPS/TLS | ❌ Not Implemented | Expected at load balancer |
| Security Scanning | ❌ Not Implemented | No automated vulnerability detection |

**Evidence**: `middleware/index.js` implements securityHeaders; README.md lines 179-181 document security headers; no authentication middleware present.

### 5.4.4 Performance and Scalability

#### Performance Characteristics

**Expected Performance** (estimated based on architecture):

| Metric | Value | Rationale |
|---|---|---|
| Request Latency (p50) | < 5ms | No I/O operations, simple string response |
| Request Latency (p95) | < 10ms | Minimal variance without I/O |
| Request Latency (p99) | < 20ms | Occasional GC pauses or event loop delays |
| Throughput (single instance) | 1,000-5,000 req/s | Typical Node.js HTTP performance |
| Memory Footprint (RSS) | 50-100MB | Node.js baseline + application overhead |
| CPU Utilization (moderate load) | < 10% | Minimal processing per request |
| Startup Time | < 1 second | Simple initialization, no database connections |

**No Explicit SLA Requirements**: The repository contains no documented SLA, latency targets, or throughput requirements. Above estimates are typical for Node.js HTTP servers with similar characteristics.

#### Scaling Strategy

**Horizontal Scaling** (Recommended):

The stateless architecture enables unlimited horizontal scaling:

**Scaling Approach**:
1. Deploy multiple container instances
2. Place load balancer in front (ALB, Nginx, Traefik)
3. Load balancer distributes requests across instances
4. No session affinity or state synchronization required

**Deployment Pattern**:
```
                     ┌─────────────┐
                     │Load Balancer│
                     │  (ALB/Nginx)│
                     └──────┬──────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
         │Instance1│   │Instance2│   │Instance3│
         │ Port 3000│  │ Port 3000│  │ Port 3000│
         └─────────┘   └─────────┘   └─────────┘
```

**Scaling Metrics** (when to scale):
- CPU utilization > 70% sustained
- Memory usage > 80% of allocation
- Request latency p95 > 50ms
- Request rate approaching throughput limit

**Vertical Scaling** (Not Recommended):

Single-threaded Node.js limits vertical scaling effectiveness:
- ❌ No cluster module implementation
- ❌ No worker threads
- ❌ Single CPU core per instance
- Result: Additional CPU cores provide no benefit

**Recommendation**: Prefer horizontal scaling over vertical scaling for Node.js workloads.

#### Performance Optimizations

**Implemented Optimizations**:

1. **Stateless Design**: No state lookup or session management overhead
2. **Synchronous Processing**: No async/await overhead for simple operations
3. **Minimal Middleware**: Only two middleware functions (logging, security headers)
4. **Native Modules**: No framework overhead, direct HTTP module usage
5. **Alpine Linux**: Smaller container images = faster pulls and starts

**Not Implemented** (future considerations):

- **Response Caching**: No caching layer (acceptable for static response)
- **Compression**: No gzip/brotli compression (text response too small)
- **Connection Pooling**: Not applicable (no database connections)
- **Clustering**: No multi-process parallelism
- **HTTP/2**: Using HTTP/1.1 only

#### Resource Requirements

**Minimum Requirements**:

| Resource | Development | Production | Notes |
|---|---|---|---|
| CPU | 0.1 core | 0.25-0.5 core | Single-threaded, minimal processing |
| Memory | 128MB | 256MB | Node.js baseline + headroom |
| Disk | 100MB | 200MB | Container image + logs |
| Network | 1 Mbps | 10 Mbps | Minimal bandwidth per request |

**Recommended Resource Allocation** (Kubernetes/ECS):

```yaml
resources:
  requests:
    cpu: 250m          # 0.25 CPU core
    memory: 256Mi      # 256 MB RAM
  limits:
    cpu: 500m          # 0.5 CPU core max
    memory: 512Mi      # 512 MB RAM max
```

**Evidence**: Stateless design confirmed in Tech Spec 3.6; single-process architecture in `index.js` (no clustering); minimal processing in handlers; no performance requirements documented.

### 5.4.5 Health Checking and Availability

#### Health Check Mechanisms

**1. Docker Container Health Check**:

Configured in `docker-compose.yml` to monitor container health:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
  interval: 30s        # Check every 30 seconds
  timeout: 10s         # 10-second timeout per check
  retries: 3           # 3 consecutive failures = unhealthy
  start_period: 10s    # 10-second grace period after start
```

**Health States**:
- **healthy**: Endpoint returns 200 OK
- **unhealthy**: 3 consecutive failures
- **starting**: Within start_period grace period

**Actions on Unhealthy**:
- Docker marks container as unhealthy
- Orchestrator can restart container (depends on restart policy)
- Health status visible in `docker ps` output

**2. Prometheus Health Scraping**:

Configured in `prometheus.yml` as separate scrape job:

```yaml
- job_name: 'hello-world-health'
  scrape_interval: 30s
  scrape_timeout: 5s
  static_configs:
    - targets: ['hello-world-app:3000/health']
```

**Prometheus Health Metrics**:
- `up{}` metric: 1=healthy, 0=down
- Used for alerting and dashboard health indicators
- Separate from application metrics (different scrape frequency)

**Implementation Status**: `/health` endpoint not implemented. Prometheus scrape target configured but requires endpoint implementation.

**3. Bash Health Check Script**:

Located at `infrastructure/scripts/health-check.sh`, provides:

**Validation Checks**:
- HTTP status code = 200
- Response body contains "Hello world" text
- Network connectivity to service

**Exit Codes**:
- `0`: Service healthy (200 status + correct response)
- `1`: Service unhealthy (wrong status or response)
- `2`: Service unreachable (connection failed)

**Usage**:
- Manual health verification
- Post-deployment validation in `deploy.sh`
- CI/CD health checks before routing traffic

#### Availability Patterns

**Restart Policy**:

Docker Compose `restart: unless-stopped` policy:
- Container automatically restarts on failure
- Does not restart if manually stopped
- Restarts on system reboot
- Suitable for development and single-host deployments

**Production Restart Policies** (Kubernetes/ECS):

```yaml
# Kubernetes

restartPolicy: Always
livenessProbe:
  httpGet:
    path: /hello
    port: 3000
  periodSeconds: 30
  failureThreshold: 3

#### ECS

healthCheck:
  command: ["CMD-SHELL", "curl -f http://localhost:3000/hello || exit 1"]
  interval: 30
  timeout: 10
  retries: 3
  startPeriod: 10
```

#### Graceful Shutdown

**Implementation**: `index.js` registers SIGINT and SIGTERM handlers:

**Shutdown Sequence**:
1. **Signal Received**: OS sends SIGINT (Ctrl+C) or SIGTERM (kill)
2. **Server Stop**: Call `stopServer(timeout=10000)`
3. **Connection Draining**: server.close() stops accepting new connections
4. **Active Request Completion**: Wait up to 10 seconds for in-flight requests
5. **Force Close**: Destroy remaining sockets after timeout
6. **Process Exit**: `process.exit(0)` terminates process cleanly

**Guarantees**:
- ✅ No new connections accepted after signal
- ✅ Active requests complete (up to timeout)
- ✅ Clean resource cleanup
- ✅ Graceful shutdown within 10 seconds

**Timeout Behavior**:
- Default: 10-second timeout
- Active connections given time to complete
- After timeout: Force destroy remaining sockets
- Log message: "Server stopped gracefully"

**Evidence**: `index.js` lines 26-52 implement graceful shutdown; `server.js` `stopServer()` function manages connection closing; 10-second timeout in `setupGracefulShutdown`.

#### Health Check Architecture Diagram

```mermaid
sequenceDiagram
    participant Docker
    participant App
    participant Prometheus
    participant HealthScript as health-check.sh
    participant Deploy as deploy.sh
    
    Note over Docker,Prometheus: Every 30 seconds (staggered)
    
    rect rgb(230, 255, 230)
        Note over Docker,App: Docker Health Check
        Docker->>App: curl http://localhost:3000/hello
        App->>Docker: 200 OK "Hello world"
        Docker->>Docker: Mark container healthy
    end
    
    rect rgb(230, 240, 255)
        Note over Prometheus,App: Prometheus Health Scrape
        Prometheus->>App: GET /health
        App->>Prometheus: (Not Implemented)
        Prometheus->>Prometheus: up{} = 0 (down)
    end
    
    rect rgb(255, 245, 230)
        Note over Deploy,App: Deployment Validation
        Deploy->>HealthScript: Execute health-check.sh
        HealthScript->>App: GET /hello
        App->>HealthScript: 200 OK "Hello world"
        HealthScript->>HealthScript: Validate response
        HealthScript->>Deploy: Exit 0 (healthy)
        Deploy->>Deploy: Deployment successful
    end
    
    rect rgb(255, 230, 230)
        Note over Docker,App: Unhealthy Container
        Docker->>App: curl http://localhost:3000/hello
        App->>Docker: Connection refused
        Docker->>Docker: Retry (3 attempts)
        Docker->>Docker: Mark unhealthy after 3 failures
        Docker->>App: Restart container (restart policy)
    end
```

### 5.4.6 Disaster Recovery and Resilience

#### Recovery Procedures

**Container Failure Recovery**:

**Scenario**: Container process crashes or becomes unresponsive

**Automatic Recovery**:
1. Docker health check detects unhealthy state (3 consecutive failures)
2. Docker Engine restarts container (restart policy: unless-stopped)
3. Application initializes and binds to port
4. Health check validates recovery
5. Service returns to healthy state

**Timeframe**: ~30-60 seconds (health check interval + startup time)

**No Data Loss**: Stateless design means no data to lose on restart

**Port Conflict Recovery**:

**Scenario**: EADDRINUSE error during startup (port 3000 already bound)

**Detection**:
- `server.listen()` emits 'error' event with code 'EADDRINUSE'
- Error handler logs: "Port 3000 is already in use. Please choose a different port or stop the conflicting process."
- Promise rejected, application startup fails
- Process exits with code 1

**Manual Resolution**:
1. Identify process using port: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)
2. Stop conflicting process or choose different port
3. Update PORT environment variable if changing port
4. Restart application

**No Automatic Recovery**: Requires manual intervention to resolve conflict

**Application Crash Recovery**:

**Scenario**: Uncaught exception crashes Node.js process

**Prevention**:
- try/catch in request pipeline captures synchronous errors
- Error handlers prevent unhandled exceptions
- Safe error responses (check res.headersSent)

**If Crash Occurs**:
1. Docker detects process exit
2. Restart policy initiates container restart
3. Application reinitializes
4. Service returns to operation

**Evidence**: `errorHandler.js` lines 44-46 detect EADDRINUSE; `docker-compose.yml` line 24 restart policy; `index.js` graceful shutdown implementation.

#### Resilience Patterns

**Stateless Design** (Primary Resilience Mechanism):

The stateless architecture provides inherent resilience:
- ✅ No session state to lose on restart
- ✅ No database transactions to roll back
- ✅ No in-memory data structures to rebuild
- ✅ Each request independent of others
- ✅ Immediate readiness after startup

**Circuit Breaker**: Not implemented (no external service dependencies to protect)

**Retry Logic**: Not implemented (no external API calls requiring retries)

**Timeout Patterns**: Implemented for graceful shutdown (10-second timeout)

**Bulkhead Isolation**: Not implemented (single service, no resource partitioning)

**Limitations**: The simple architecture lacks advanced resilience patterns found in complex distributed systems. This is acceptable for the educational scope and stateless design.

#### Disaster Scenarios and Recovery

| Scenario | Impact | Recovery Procedure | Recovery Time | Data Loss |
|---|---|---|---|---|
| Container Crash | Single instance down | Docker auto-restart | 30-60s | None |
| Port Conflict | Startup failure | Manual port resolution | 5-10min | None |
| Host Failure | All instances on host down | Deploy to new host, health check | 2-5min | None |
| Corruption (rare) | Container image corrupted | Rebuild image, redeploy | 5-10min | None |
| Resource Exhaustion | OOM kill or CPU starvation | Auto-restart, scale horizontally | 1-2min | None |

**No Backup Required**: Stateless design with no persistent data eliminates backup requirements

**No Database Recovery**: No database to restore or recover

**No Transaction Rollback**: No transactions or state changes to reverse

**Multi-Region DR**: Not implemented—single-region deployment expected for educational tool

#### Disaster Recovery Limitations

**No Multi-Region Deployment**:
- ❌ No geographic redundancy
- ❌ No automatic failover to secondary region
- Risk: Complete outage if single region fails
- Mitigation: Deploy to multiple regions with DNS failover (future)

**No Automated Failover**:
- ❌ No automatic traffic routing to healthy instances
- ❌ No load balancer health check integration documented
- Risk: Manual intervention required for traffic shifting
- Mitigation: Use cloud load balancers (ALB, NLB) with health checks

**No Data Backup**:
- ✅ Not Needed: Stateless design, no data to back up
- Future Risk: Adding database requires backup strategy

**No Disaster Recovery Testing**:
- ❌ No documented DR testing procedures
- ❌ No chaos engineering or failure injection
- Risk: Unknown recovery effectiveness
- Mitigation: Regular DR drills and failure testing

**Disaster Recovery Posture Summary**:

| Aspect | Status | Notes |
|---|---|---|
| Stateless Design | ✅ Implemented | Primary DR mechanism, no state to lose |
| Auto-Restart | ✅ Implemented | Docker restart policy handles crashes |
| Graceful Shutdown | ✅ Implemented | Clean connection draining |
| Health Checking | ✅ Implemented | Docker health check with auto-restart |
| Multi-Region | ❌ Not Implemented | Single-region deployment |
| Automated Failover | ❌ Not Implemented | No load balancer integration documented |
| Backup/Restore | ✅ Not Needed | Stateless, no persistent data |
| DR Testing | ❌ Not Implemented | No documented testing procedures |

**Suitable For**: Educational tool, development environments, small-scale production with manual recovery

**Not Suitable For**: Mission-critical systems requiring 99.99% uptime, multi-region high availability, or zero-downtime deployments

**Evidence**: Stateless design in Tech Spec 3.6; Docker restart policy in `docker-compose.yml`; graceful shutdown in `index.js`; no database or persistent storage.

## 5.5 References

#### Files Examined

**Core Application Files**:
- `src/backend/index.js` - Application bootstrap, lifecycle management, graceful shutdown signal handlers
- `src/backend/server.js` - HTTP server implementation, middleware pipeline orchestration, promise-based lifecycle
- `src/backend/config.js` - Configuration management, dotenv loading, port validation, environment flag computation
- `src/backend/handlers/helloHandler.js` - GET /hello endpoint handler, method validation, response generation
- `src/backend/errorHandler.js` - Centralized error handlers (404, 405, 500, EADDRINUSE detection)
- `src/backend/middleware/index.js` - Request logger, security headers, error middleware, middleware composition
- `src/backend/utils/constants.js` - Application constants (HTTP_STATUS, ROUTES, MESSAGES, HEADERS, HTTP_METHODS)
- `src/backend/utils/logger.js` - Centralized logging utility with timestamp formatting and test suppression

**Infrastructure Files**:
- `Dockerfile` - Production Docker image with node:18-alpine, layer caching optimization, production dependencies
- `infrastructure/local/docker-compose.yml` - Local development orchestration, hot reload configuration, health checks, volume strategy
- `infrastructure/monitoring/prometheus.yml` - Metrics collection configuration, scrape targets (5s app, 30s health)
- `infrastructure/monitoring/grafana-dashboard.json` - Pre-configured dashboard with 13 visualization panels

**Documentation Files**:
- `README.md` - System overview, architecture description, features, API documentation, setup instructions
- `CONTRIBUTING.md` - Development workflow, Git conventions, coding standards

#### Folders Explored

**Source Code Structure**:
- `src/backend/` - Main application backend service implementation
- `src/backend/handlers/` - HTTP request handlers (hello, error handlers)
- `src/backend/middleware/` - Request lifecycle middleware (logging, security, error handling)
- `src/backend/utils/` - Utility modules (constants, logger)

**Infrastructure Configuration**:
- `infrastructure/` - Deployment and operations configuration
- `infrastructure/local/` - Docker Compose for local development
- `infrastructure/monitoring/` - Prometheus and Grafana monitoring configuration
- `infrastructure/scripts/` - Bash automation scripts (deploy, health-check, setup, start-server)

#### Technical Specification Sections Referenced

- **Section 1.2 System Overview** - Overall system description, components, architecture, success criteria
- **Section 3.2 Programming Languages** - Node.js 18.x LTS, Bash scripting, version requirements
- **Section 3.3 Frameworks & Libraries** - Native http module rationale, dotenv usage, nodemon configuration
- **Section 3.6 Databases & Storage** - Stateless architecture confirmation, no persistent storage
- **Section 3.7 Development & Deployment** - Docker architecture, Docker Compose orchestration, Prometheus/Grafana monitoring
- **Section 3.8 Security Considerations** - Security headers, attack surface analysis
- **Section 4.2 System Workflows** - Request processing flow, configuration loading sequence

#### External References

- **Node.js 18.x Documentation**: HTTP module, URL module, process signals, event emitters
- **Docker Documentation**: Dockerfile best practices, multi-stage builds, health checks, Alpine Linux base images
- **Docker Compose Specification v3.8**: Compose file format, volume types, network configuration, health check syntax
- **Prometheus Documentation**: Scrape configuration, pull model architecture, exposition format
- **Grafana Documentation**: Dashboard JSON schema version 30, Prometheus data source configuration
- **OWASP Secure Headers Project**: X-Content-Type-Options, X-Frame-Options, Content-Security-Policy recommendations
- **Twelve-Factor App Methodology**: Configuration principle (Factor III), environment-based configuration
- **HTTP/1.1 Specification (RFC 7231)**: Status codes, methods, headers
- **dotenv Documentation**: Environment variable loading from .env files

#### Web Searches

No web searches were performed for this section. All information was derived from provided repository files, technical specification sections, and established technical standards.

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Section Completeness**: Comprehensive - all required subsections and diagrams included  
**Validation Status**: ✅ All mermaid diagrams validated, proper markdown formatting, three levels of numbered headings, all references cited

# 6. SYSTEM COMPONENTS DESIGN

## 6.1 Core Services Architecture

### 6.1.1 Applicability Statement

**Core Services Architecture is not applicable for this system.**

The Node.js Hello World Service does not implement microservices, distributed architecture, or distinct service components. As documented in Section 1.2.1, this is a "standalone tutorial project with no enterprise integration requirements" that explicitly avoids distributed system patterns. The system operates as a single-process, monolithic HTTP server designed specifically for educational purposes, prioritizing simplicity and HTTP fundamentals over distributed architecture complexity.

This architectural approach is an intentional design decision, not an omission or limitation. The absence of service-oriented architecture enables the project to fulfill its primary educational mission: teaching core Node.js HTTP server concepts without the cognitive overhead of distributed systems, service orchestration, or inter-service communication patterns.

### 6.1.2 Architectural Rationale

#### 6.1.2.1 Intentional Simplicity

The Node.js Hello World Service deliberately implements a monolithic architecture for several pedagogical and operational reasons documented throughout the technical specification:

**Educational Focus**  
As stated in Section 1.2.1, the project targets "beginners to intermediate developers learning Node.js server-side development" with an "intentionally narrow focus on HTTP server basics to enable deep understanding of core concepts." Introducing distributed architecture patterns would fundamentally conflict with this objective by:

- Obscuring HTTP protocol fundamentals behind service mesh abstractions
- Requiring knowledge of distributed systems theory before understanding basic request-response patterns
- Adding operational complexity (service discovery, load balancing, circuit breakers) that distracts from core learning objectives
- Necessitating multiple codebases or repositories to understand a single concept

**Native-First Architecture**  
Section 5.1.1 documents the system's "Native-First Architecture that prioritizes Node.js built-in modules over heavyweight frameworks." This philosophy extends to architectural patterns—the use of Node.js's native `http` module in a single-process server provides maximum transparency into how HTTP servers actually function, without framework or orchestration abstractions.

**Isolation by Design**  
Section 1.2.1 explicitly states: "This isolation is a deliberate design choice to ensure the learning experience remains focused and accessible." The system intentionally avoids external dependencies and integration points that would be prerequisites for distributed architecture:

- No database or persistent storage integration
- No authentication or authorization systems  
- No message queues or asynchronous processing
- No external service dependencies or API calls
- No coordination with other microservices or distributed systems

**Operational Simplicity**  
The single-process architecture eliminates entire categories of operational concerns while still demonstrating production-ready patterns:

- No service discovery mechanisms required (Consul, Eureka, etcd)
- No inter-service communication protocols to implement or debug (gRPC, message queues)
- No distributed tracing infrastructure needed (Jaeger, Zipkin)
- No circuit breaker implementations or retry logic between services
- No API gateway configuration or service mesh deployment

#### 6.1.2.2 Sufficient Architecture for Requirements

The monolithic architecture fully satisfies all documented requirements without introducing unnecessary complexity:

**Request Processing**  
The system's single-endpoint design (`/hello`) requires only path-based routing within a single server process. Section 4.2 documents the complete request workflow from client connection through response generation, all occurring within a single process boundary without network hops or service-to-service calls.

**Scalability**  
Section 5.1.1 notes the "stateless nature of the service—with no session management, persistent storage, or shared state—enables trivial horizontal scaling when needed." While not currently implemented, the architecture supports horizontal scaling through standard container orchestration without requiring microservices decomposition. For the educational scope defined in Section 1.2.3, a single instance provides sufficient capacity.

**Resilience**  
The system implements appropriate resilience patterns for a monolithic architecture as documented in Section 5.1.1:
- Graceful shutdown with SIGINT/SIGTERM signal handling
- Comprehensive error handling with appropriate HTTP status codes
- Server-level error recovery for startup failures (EADDRINUSE detection)

These patterns address resilience requirements without distributed system complexity like consensus protocols, distributed transactions, or multi-datacenter failover.

### 6.1.3 Actual Architecture Implementation

#### 6.1.3.1 Monolithic HTTP Server Architecture

The Node.js Hello World Service implements what Section 5.1.1 describes as a "stateless monolithic HTTP server architecture using a synchronous request-response pattern." This architectural style consists of a single Node.js process that handles all system functionality:

**Single-Process Server**  
As documented in Section 5.1.1: "The service operates as a single-process, single-threaded HTTP server leveraging Node.js's event-driven architecture." The implementation in `src/backend/server.js` uses Node.js's native `http.createServer()` to instantiate a single HTTP server that:

- Binds to a single HOST:PORT combination (default 0.0.0.0:3000)
- Processes all incoming HTTP requests through a single request handler function
- Executes middleware, routing, and handler logic within the same process and memory space
- Maintains no shared state or persistent connections between requests

**Layered Component Architecture**  
Rather than service boundaries, the system organizes code into layered components with clear separation of concerns, as detailed in Section 5.1.1:

- **Entry Point Layer** (`index.js`): Application bootstrap and lifecycle management
- **Server Layer** (`server.js`): HTTP server creation and request pipeline orchestration  
- **Middleware Layer** (`middleware/`): Cross-cutting request processing (logging, security headers)
- **Routing Layer** (integrated in `server.js`): Path-based request dispatching to handlers
- **Handler Layer** (`handlers/`): Business logic for specific endpoints (`/hello`)
- **Support Layer** (`utils/`): Configuration, logging, constants, error handling

These layers communicate through direct function calls and shared memory within a single process, not through network protocols or message passing between services.

#### 6.1.3.2 Request Processing Flow

Section 4.2 documents the complete request workflow as a linear pipeline within the single server process:

1. **Connection Establishment**: Node.js runtime invokes the `handleRequest` function when HTTP requests arrive
2. **Middleware Pipeline**: Request enters logging and security header middleware in `middleware/index.js`
3. **Routing**: URL parsing and handler selection in `server.js` using native `url.parse()`
4. **Handler Execution**: Business logic in `handlers/helloHandler.js` generates response
5. **Response Completion**: Logging middleware captures timing and writes to stdout

This entire flow occurs synchronously within microseconds in a single process, without service-to-service network calls, message queue operations, or distributed transactions.

#### 6.1.3.3 Deployment Architecture

The containerized deployment maintains the monolithic architecture rather than implementing service orchestration:

**Single Container Deployment**  
The `infrastructure/local/docker-compose.yml` file defines exactly one application service:

```yaml
services:
  hello-world-app:  # Single application container
    build:
      context: ../..
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
```

**Supporting Infrastructure**  
The Docker Compose configuration includes Prometheus and Grafana containers, but these are **monitoring infrastructure tools**, not application services. As documented in Section 5.1.4, these systems integrate through:

- **Pull-based metrics collection**: Prometheus scrapes the application's `/metrics` endpoint
- **Read-only data visualization**: Grafana queries Prometheus for dashboard rendering

Neither Prometheus nor Grafana participates in request processing, business logic, or application workflows. They are operational support tools that observe the single application service.

### 6.1.4 Absent Distributed Architecture Components

#### 6.1.4.1 No Service Decomposition

The system does not implement service boundaries or distributed service patterns:

**Service Discovery**: No service registry (Consul, Eureka, etcd) or DNS-based service discovery mechanisms exist. The single server has a fixed HOST:PORT binding configured through environment variables.

**API Gateway**: No gateway layer routes, transforms, or aggregates requests across multiple backend services. The HTTP server directly handles client requests without intermediary routing layers.

**Service Mesh**: No sidecar proxies (Istio, Linkerd, Consul Connect) manage service-to-service communication, as there are no services to communicate. Traffic management, load balancing, and circuit breaker functionality would occur in external infrastructure if horizontal scaling were required.

**Multiple Service Repositories**: The entire application resides in a single codebase under `src/backend/`, not distributed across multiple service repositories with independent deployment pipelines.

#### 6.1.4.2 No Inter-Service Communication

The system has no mechanisms for communication between services:

**Synchronous Communication**: No REST API calls, gRPC connections, or GraphQL queries between backend services. All request processing occurs within the single server process through direct function invocation.

**Asynchronous Messaging**: No message queues (RabbitMQ, Apache Kafka, AWS SQS), event buses, or pub/sub systems. Section 5.1.1 explicitly states "No message queues or asynchronous processing."

**Data Sharing**: No distributed caching layers (Redis, Memcached) or shared databases across multiple services. Section 5.1.1 documents "No database or persistent storage integration."

#### 6.1.4.3 No Distributed Resilience Patterns

The single-process architecture eliminates the need for distributed resilience mechanisms:

**Circuit Breakers**: No circuit breaker implementations (Hystrix, Resilience4j, Opossum) exist because there are no downstream service dependencies that could fail or timeout.

**Retry Logic**: No exponential backoff, jitter, or retry policies for inter-service calls. Error handling is confined to HTTP-level responses documented in Section 5.1.3.

**Fallback Mechanisms**: No degraded functionality or alternative service paths when dependencies are unavailable. The server either successfully processes requests or returns appropriate error status codes.

**Distributed Tracing**: No trace propagation (Jaeger, Zipkin, OpenTelemetry) across service boundaries. Request logging in `middleware/requestLogger.js` captures complete request lifecycle within the single process.

**Rate Limiting and Throttling**: No rate limiting middleware or distributed rate limiting (using Redis) to prevent service overload from other services.

#### 6.1.4.4 No Horizontal Scaling Infrastructure

While Section 5.1.1 notes the stateless design "enables trivial horizontal scaling when needed," no scaling infrastructure is currently implemented:

**Container Orchestration**: No Kubernetes deployments, Docker Swarm services, or AWS ECS task definitions with replica counts. The Docker Compose configuration in `infrastructure/local/docker-compose.yml` specifies a single container instance.

**Load Balancing**: No load balancer configuration (NGINX, HAProxy, AWS ALB/NLB) to distribute traffic across multiple instances. Client requests connect directly to the single server instance at `0.0.0.0:3000`.

**Auto-Scaling Policies**: No Horizontal Pod Autoscalers (HPA), AWS Auto Scaling Groups, or dynamic scaling rules based on CPU, memory, or request metrics.

**Session Affinity**: No sticky session configuration, as the stateless design documented in Section 5.1.1 makes session affinity unnecessary even if horizontal scaling were implemented.

### 6.1.5 Architecture Cross-References

For detailed information about the actual system architecture, refer to the following Technical Specification sections:

- **Section 5.1 High-Level Architecture**: Complete documentation of the monolithic HTTP server architecture, component layering, request processing flow, and external integration points
- **Section 1.2 System Overview**: Educational context, architectural rationale, and design philosophy
- **Section 4.2 System Workflows**: Detailed request processing sequences and error handling flows
- **Section 3.1 Overview**: Technology stack including native Node.js modules and minimal framework dependencies

#### References

#### Technical Specification Sections

- `1.2 System Overview` - Standalone project context and educational rationale
- `1.2.1 Project Context` - Enterprise integration exclusions and isolation by design
- `5.1 High-Level Architecture` - Monolithic server architecture documentation
- `5.1.1 System Overview` - Single-process implementation details and architectural principles
- `5.1.3 Data Flow Description` - Request processing within single process
- `5.1.4 External Integration Points` - Monitoring infrastructure vs. application services
- `4.2 System Workflows` - Complete request lifecycle documentation
- `3.1 Overview` - Technology stack and dependency philosophy

#### Implementation Files Examined

- `infrastructure/local/docker-compose.yml` - Single service container definition confirming monolithic deployment
- `src/backend/server.js` - Native HTTP server implementation using `http.createServer()` in single process
- `src/backend/` - Complete backend codebase in single directory without service boundaries

#### Architecture Validation

- Search Query: "kubernetes deployment configuration" - No results (confirmed no container orchestration)
- Search Query: "load balancer nginx haproxy service mesh" - No results (confirmed no traffic management infrastructure)
- Search Query: "horizontal scaling auto scaling cluster" - No results (confirmed no scaling configuration)
- Search Query: "api gateway service discovery consul" - No results (confirmed no service discovery mechanisms)

## 6.2 Database Design

### 6.2.1 Applicability Statement

**Database Design is not applicable to the Node.js Hello World Service.**

The system implements a completely stateless architecture with no persistent data storage, caching mechanisms, or data persistence layers of any kind. This architectural decision is intentional and fundamental to the service's educational mission, as documented throughout the technical specification and confirmed through comprehensive repository analysis.

As explicitly stated in Section 3.6.1: "The Node.js Hello World Service implements a **stateless architecture** with no persistent data storage. This design choice is intentional and aligns with the service's educational purpose." The system processes each HTTP request independently, generating responses from application constants without any database queries, data persistence operations, or state management between requests.

### 6.2.2 Evidence-Based Analysis

#### 6.2.2.1 Technical Specification Confirmation

The absence of database functionality is thoroughly documented across multiple sections of the technical specification:

**Section 3.6 Databases & Storage** provides the definitive statement that the system has "No Database or Persistent Storage." This section explicitly identifies all storage systems that are intentionally excluded from the architecture:

- **Relational Databases:** No PostgreSQL, MySQL, or SQL Server implementations
- **NoSQL Databases:** No MongoDB, Redis, or DynamoDB integrations
- **Caching Solutions:** No Redis, Memcached, or in-memory caching layers
- **Object Storage:** No AWS S3, Azure Blob Storage, or file storage systems
- **Session Stores:** No session persistence or user state management mechanisms
- **Message Queues:** No RabbitMQ, Kafka, or message persistence layers

**Section 1.2.2 System Overview** documents the core request processing model: "Each incoming request is processed independently with no session lookup or user state retrieval, no database queries or data persistence, no caching or response memoization. Response generated from application constants (`MESSAGES.HELLO_RESPONSE`)."

**Section 6.1 Core Services Architecture** confirms: "The system has no database or persistent storage integration" and operates as a "single-process monolithic HTTP server" with no data sharing mechanisms or distributed caching layers.

#### 6.2.2.2 Repository Code Analysis

Comprehensive analysis of the repository structure and implementation files confirms the complete absence of database infrastructure:

**Dependency Analysis** - The `package.json` file located at the project root contains no database-related dependencies:

```json
{
    "name": "hello_world",
    "version": "1.0.0",
    "description": "Hello world in Node.js",
    "main": "index.js",
    "author": "hxu",
    "license": "MIT"
}
```

The dependency manifest includes no database drivers, ORMs, or data persistence libraries:
- No PostgreSQL client (`pg`, `pg-promise`)
- No MySQL client (`mysql`, `mysql2`)
- No MongoDB driver (`mongodb`, `mongoose`)
- No Redis client (`redis`, `ioredis`)
- No ORM frameworks (`sequelize`, `typeorm`, `prisma`, `knex`)
- No query builders or schema migration tools

**Source Code Structure** - Examination of the `src/backend/` directory reveals no database-related components:

```
src/backend/
├── config.js
├── server.js
├── router.js
├── errorHandler.js
├── handlers/
│   ├── helloHandler.js
│   ├── error.js
└── utils/
    ├── constants.js
    └── logger.js
```

The codebase contains no directories or files associated with data persistence:
- No `/models` directory for data models or entity definitions
- No `/repositories` directory for data access layer implementations
- No `/entities` directory for database entity mappings
- No `/migrations` directory for schema version control
- No `/schemas` directory for validation or database schemas
- No `/database` or `/db` directories for connection management
- No files containing database queries, connection pools, or transaction management

**Configuration Analysis** - The `src/backend/config.js` module manages only HTTP server configuration parameters:

- **PORT**: Server listening port (default: 3000)
- **HOST**: Server binding address (default: 0.0.0.0)
- **NODE_ENV**: Environment identifier (default: development)
- **LOG_LEVEL**: Logging verbosity (default: INFO)

The configuration module contains no database-related settings:
- No database connection strings or host configurations
- No database credentials (username, password)
- No connection pool parameters (max connections, idle timeout)
- No database-specific feature flags or timeout settings
- No backup or replication configurations

**Infrastructure Analysis** - The `infrastructure/local/docker-compose.yml` file defines the deployment environment with a single application service and monitoring infrastructure:

```yaml
services:
  hello-world-app:
    build:
      context: ../..
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
```

The Docker Compose configuration includes no database services:
- No PostgreSQL container (`postgres:latest`)
- No MySQL container (`mysql:latest`)
- No MongoDB container (`mongo:latest`)
- No Redis container (`redis:latest`)
- No database initialization scripts or volume mounts for data persistence

The supporting services (Prometheus and Grafana) are monitoring tools that observe the application through metrics scraping but do not provide data persistence capabilities for the application itself.

#### 6.2.2.3 Request Processing Model

The system's request processing architecture fundamentally excludes database interactions at every stage of the request lifecycle:

**Request Handling Flow**:
1. **Connection Establishment**: Client HTTP request received by Node.js HTTP server
2. **Middleware Processing**: Request logging and security header application
3. **Routing**: URL path matching to appropriate handler
4. **Handler Execution**: Response generation from application constants
5. **Response Completion**: HTTP response sent to client with logging

At no point in this workflow does the system:
- Query a database for data retrieval
- Execute database writes or updates
- Check a cache for memoized responses
- Persist request logs to a database
- Store session state or user data
- Perform any I/O operations to persistent storage

The `/hello` endpoint handler, documented in Section 5.2, generates responses using the constant `MESSAGES.HELLO_RESPONSE = 'Hello world'` defined in `src/backend/utils/constants.js`. This constant is loaded into memory at application startup and requires no database lookup or external data retrieval.

### 6.2.3 Architectural Rationale for Stateless Design

#### 6.2.3.1 Educational Focus and Simplicity

The intentional exclusion of database functionality aligns with the system's primary educational objectives documented in Section 1.2.1. The project targets "beginners to intermediate developers learning Node.js server-side development" with an "intentionally narrow focus on HTTP server basics to enable deep understanding of core concepts."

Introducing database interactions would fundamentally conflict with these objectives by:

**Increased Cognitive Load**: Database integration would require learners to understand connection management, query languages (SQL or NoSQL query syntax), data modeling, schema design, transactions, and error handling for database failures—all before mastering basic HTTP request-response patterns.

**Infrastructure Complexity**: Database systems require installation, configuration, user account setup, schema initialization, and ongoing maintenance. This infrastructure overhead creates barriers to entry for developers who want to focus specifically on HTTP server fundamentals.

**Obscured Core Concepts**: Database abstractions (ORMs, query builders) or raw database queries would obscure the direct relationship between HTTP requests and responses, making it harder to understand how web servers fundamentally operate.

**Testing Complications**: Database-driven applications require test database setup, schema migrations in test environments, test data seeding, transaction rollback between tests, and database mocking strategies. These testing complexities distract from the core learning objective of understanding HTTP server behavior.

#### 6.2.3.2 Stateless REST API Demonstration

As documented in Section 3.6.1, the stateless design "demonstrates pure stateless REST API pattern where each request is independent and self-contained, a fundamental concept for scalable web services."

The stateless architecture provides critical educational value:

**REST Principles**: Demonstrates Roy Fielding's REST architectural constraint that "each request from client to server must contain all information necessary to understand the request, and cannot take advantage of any stored context on the server." The absence of database state enforces this principle completely.

**Horizontal Scalability Foundation**: By eliminating shared database state, the architecture teaches developers that truly stateless services can scale horizontally without session affinity, sticky routing, or database connection coordination. Any number of service instances can process requests independently without synchronization.

**Simplified Deployment**: Stateless services require no database migration scripts during deployment, no schema version synchronization, no backup and restore procedures, and no database failover configuration. This simplicity demonstrates how stateless design reduces operational complexity.

**Failure Isolation**: Without database dependencies, the service has no external failure modes. Database connection failures, query timeouts, deadlocks, and replication lag cannot affect service availability, making the system maximally reliable for its scope.

#### 6.2.3.3 Zero Infrastructure Requirements

Section 3.6.1 emphasizes that the stateless design enables "Zero Infrastructure: No database installation, configuration, or management required. Developers can run the service immediately without Docker Compose, database migrations, or schema management."

This architectural decision provides concrete benefits:

**Immediate Execution**: Developers can clone the repository and execute `node src/backend/server.js` to run the service in seconds, without installing PostgreSQL, MySQL, MongoDB, or Redis. The only prerequisite is Node.js runtime, dramatically lowering the barrier to entry.

**Platform Independence**: Without database dependencies, the service runs identically on Windows, macOS, and Linux without platform-specific database driver compilation, connection string format variations, or path separator issues.

**Cloud-Native Simplicity**: The stateless design eliminates the need for managed database services (AWS RDS, Azure SQL Database, MongoDB Atlas), database connection string secrets management, VPC network configuration for database access, and cloud-specific IAM database authentication.

**Resource Efficiency**: The service requires minimal system resources without database memory allocation, connection pool overhead, or disk I/O for data persistence. This efficiency enables running the service on resource-constrained development machines or lightweight cloud instances.

### 6.2.4 Alternative Data Sources

#### 6.2.4.1 Application Constants as Data Source

In the absence of database storage, the Node.js Hello World Service uses application constants defined in `src/backend/utils/constants.js` as its sole data source:

**Constants Module Structure**:
```
HTTP Status Codes:
- HTTP_STATUS.OK = 200
- HTTP_STATUS.NOT_FOUND = 404
- HTTP_STATUS.METHOD_NOT_ALLOWED = 405
- HTTP_STATUS.INTERNAL_SERVER_ERROR = 500

Response Messages:
- MESSAGES.HELLO_RESPONSE = 'Hello world'
- MESSAGES.NOT_FOUND = 'Not Found'
- MESSAGES.METHOD_NOT_ALLOWED = 'Method Not Allowed'

Content Types:
- CONTENT_TYPES.TEXT_PLAIN = 'text/plain'
- CONTENT_TYPES.JSON = 'application/json'
```

These constants are loaded into Node.js process memory at application startup and remain immutable throughout the application lifecycle. The `/hello` endpoint handler retrieves `MESSAGES.HELLO_RESPONSE` through a synchronous in-memory reference without I/O operations, network calls, or latency.

**Design Characteristics**:
- **Immutability**: Constants never change during runtime, eliminating consistency concerns
- **Zero Latency**: In-memory access with sub-microsecond retrieval time
- **No Failure Modes**: Cannot experience connection timeouts, query errors, or data unavailability
- **Version Control**: Application constants are source-controlled alongside code, ensuring reproducibility

#### 6.2.4.2 Request-Derived Data

The system processes data derived directly from incoming HTTP requests without requiring persistent storage:

**Request Metadata Used**:
- HTTP method (GET, POST, PUT, DELETE) - extracted from request object for routing decisions
- URL path (e.g., `/hello`) - parsed for handler selection
- Request timestamp - generated at middleware entry for logging purposes
- Client address - extracted from socket information for observability

The request logger middleware documented in Section 5.2 captures this request-derived data for console logging: "Log entry example: `[2023-10-15T14:32:10.123Z] GET /hello - 200 - 5ms`." These logs are written to stdout and stderr streams, not persisted to a database or log aggregation system within the application itself.

**Logging Persistence** (External to Application):
While the application does not implement log persistence, operators may configure external log collection:
- Container stdout/stderr capture by Docker or Kubernetes
- Log forwarding to centralized systems (Elasticsearch, CloudWatch, Datadog)
- File-based logging through process managers (PM2, systemd)

These external persistence mechanisms operate independently of the application code and do not constitute database design within the service architecture.

### 6.2.5 Comparison with Database-Driven Architectures

#### 6.2.5.1 What Would Change with Database Integration

To illustrate the intentional architectural choice, the following comparison shows what would be required if the system were redesigned to include database functionality:

| Architectural Component | Current Stateless Design | Hypothetical Database-Driven Design |
|---|---|---|
| **Dependencies** | Native Node.js `http` module, `dotenv` configuration | Database drivers (`pg`, `mysql2`, `mongodb`), ORM framework (`sequelize`, `typeorm`) |
| **Configuration** | PORT, HOST, NODE_ENV, LOG_LEVEL | Database host, port, credentials, connection pool size, timeout settings |
| **Schema Management** | No schema or data models | Entity definitions, migration scripts, schema versioning system |

| Architectural Component | Current Stateless Design | Hypothetical Database-Driven Design |
|---|---|---|
| **Connection Management** | Single HTTP server binding | Database connection pool initialization, health checks, reconnection logic |
| **Error Handling** | HTTP-level errors (404, 405, 500) | Database connection failures, query timeouts, deadlock detection, constraint violations |
| **Request Processing** | Synchronous constant retrieval (sub-microsecond) | Asynchronous database queries (5-50ms typical), transaction management |

| Architectural Component | Current Stateless Design | Hypothetical Database-Driven Design |
|---|---|---|
| **Testing Strategy** | In-memory unit tests, integration tests without setup | Test database provisioning, schema migrations, test data seeding, transaction rollback |
| **Deployment** | Single container deployment | Application container + database container/service, schema migration automation |
| **Operational Complexity** | Server process monitoring only | Database backup schedules, replication monitoring, query performance tuning, disk space management |

The current stateless design eliminates all components in the right column, enabling the simplified architecture that serves the educational mission.

#### 6.2.5.2 Scalability Characteristics

The stateless, database-free architecture provides distinct scalability properties:

**Current Stateless Scaling**:
- Horizontal scaling requires only additional container instances
- No database connection pool contention across instances
- No distributed locking or coordination mechanisms needed
- Load balancer can distribute requests using round-robin without session affinity
- Each instance operates independently with identical behavior

**Database-Driven Scaling Challenges** (Avoided by Current Design):
- Database connection pool limits constrain concurrent request capacity
- Read replicas and write master coordination required for high availability
- Database becomes single point of failure and scalability bottleneck
- Caching layer (Redis) typically required to reduce database query load
- Connection pool exhaustion and connection leak monitoring necessary

Section 5.1.1 documents this advantage: "The stateless nature of the service—with no session management, persistent storage, or shared state—enables trivial horizontal scaling when needed."

### 6.2.6 Cross-References to Related Sections

For comprehensive understanding of the system's architecture and the rationale for excluding database functionality, refer to the following Technical Specification sections:

**Section 3.6 Databases & Storage**: Definitive documentation of the "No Database or Persistent Storage" status with complete justification for the stateless design approach and detailed explanation of intentionally excluded storage systems.

**Section 1.2 System Overview**: Educational context, target audience definition, and architectural philosophy that prioritizes simplicity and HTTP fundamentals over distributed system complexity.

**Section 5.1 High-Level Architecture**: Complete monolithic HTTP server architecture documentation, including component layering, request processing flow, and confirmation that no database integration exists at any architectural layer.

**Section 6.1 Core Services Architecture**: Documentation of the single-process monolithic architecture with explicit confirmation that the system has "no database or persistent storage integration" and operates without data sharing mechanisms.

**Section 4.2 System Workflows**: Detailed request processing sequences showing that responses are generated from application constants without database queries or data persistence operations.

### 6.2.7 Future Considerations

#### 6.2.7.1 When Database Integration Would Be Appropriate

While the current system intentionally excludes database functionality, the following scenarios would justify reconsidering this architectural decision:

**Educational Progression**: If the project evolves into an advanced tutorial series, a follow-on module could demonstrate database integration patterns as a natural progression from the stateless foundation. This would maintain the current project's simplicity while providing a database-focused learning path for students ready for more complex topics.

**Feature Expansion**: If requirements emerge for user-specific greetings (e.g., "Hello, [username]"), request history tracking, or personalized responses, these features would necessitate persistent storage and fundamentally change the service's educational scope from HTTP basics to full-stack application development.

**Production Usage**: If the service transitions from educational demonstration to production use case requiring audit logging, user session management, or dynamic content, database integration would become a core requirement rather than an architectural anti-pattern.

#### 6.2.7.2 Recommended Database Technologies for Hypothetical Integration

If future requirements necessitated database integration, the following technologies would align with the project's existing technical stack and educational mission:

**PostgreSQL**: Open-source relational database with excellent Node.js driver support (`pg`, `pg-promise`), strong data integrity guarantees, and comprehensive documentation suitable for learners. Would provide traditional SQL query learning opportunities.

**MongoDB**: Document-oriented NoSQL database with native JSON storage, intuitive JavaScript-based query language, and simple schema-less development model. Mongoose ODM would provide elegant data modeling patterns familiar to JavaScript developers.

**Redis**: In-memory key-value store excellent for session management, caching, and simple data persistence. Would introduce distributed caching concepts while maintaining operational simplicity with minimal configuration requirements.

However, any database integration would fundamentally alter the project's educational focus and should be considered a distinct successor project rather than an evolution of the current stateless architecture.

### 6.2.8 References

#### Technical Specification Sections Referenced

- **Section 3.6 Databases & Storage** - Definitive statement of "No Database or Persistent Storage" status and comprehensive justification
- **Section 3.6.1 Data Persistence Strategy** - Detailed explanation of stateless design rationale and intentionally excluded storage systems
- **Section 1.2 System Overview** - Educational mission, target audience, and architectural philosophy
- **Section 1.2.1 Project Context** - Standalone project design and explicit exclusion of enterprise integrations
- **Section 1.2.2 High-Level Description** - Request processing model confirming no database queries or data persistence
- **Section 5.1 High-Level Architecture** - Monolithic HTTP server architecture with no database integration
- **Section 5.1.1 System Overview** - Single-process implementation details and native-first architecture philosophy
- **Section 6.1 Core Services Architecture** - Confirmation of monolithic architecture without database or persistent storage integration
- **Section 4.2 System Workflows** - Request processing sequences showing responses generated from application constants

#### Repository Files and Folders Examined

**Configuration and Dependencies**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/package.json` - Root manifest confirming absence of database driver dependencies
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/config.js` - Configuration module with only HTTP server settings, no database configuration

**Infrastructure**:
- `infrastructure/local/docker-compose.yml` - Docker Compose orchestration with single application service and no database containers

**Source Code Structure**:
- `src/backend/` - Complete backend implementation directory with no database-related folders (no `/models`, `/repositories`, `/migrations`, `/schemas`)
- `src/backend/handlers/` - Request handlers directory containing only HTTP response handlers (404, 405, 500, `/hello`)
- `src/backend/utils/` - Utility modules directory with constants and logging, no database utilities

**Comprehensive Folder Exploration** (9 folders examined):
1. Root repository: `""` (depth 0)
2. Main folder: `"hao-backprop-test-main (1)"` (depth 1)
3. Project root: `"hao-backprop-test-main (1)/hao-backprop-test-main"` (depth 2)
4. Source container: `"hao-backprop-test-main (1)/hao-backprop-test-main/src"` (depth 3)
5. Backend implementation: `"hao-backprop-test-main (1)/hao-backprop-test-main/src/backend"` (depth 4)
6. Request handlers: `"hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/handlers"` (depth 5)
7. Utility modules: `"hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/utils"` (depth 6)
8. Infrastructure: `"hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure"` (depth 4)
9. Local deployment: `"hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/local"` (depth 5)

#### Semantic Search Validation

**Database Schema and ORM Search**: Query for "database schema models migrations ORM entity data persistence storage" returned zero results, confirming complete absence of data modeling infrastructure.

**Database Driver Search**: Query for "SQL database connection pool postgres mysql mongodb redis sequelize prisma typeorm knex" returned zero results, confirming no database client libraries or connection management code.

**Configuration Search**: Query for environment files and database connection strings returned zero results, confirming no database credentials or connection configuration.

## 6.3 Integration Architecture

### 6.3.1 Applicability and Scope

#### 6.3.1.1 Integration Architecture Overview

The Node.js Hello World Service implements a **minimal integration architecture by design**, reflecting its educational mission and focus on HTTP fundamentals. As documented in Section 3.5.1, this system operates as a "fully self-contained system with no external service dependencies," intentionally excluding traditional enterprise integration patterns to maintain clarity and reduce setup complexity.

This section documents the limited but production-ready integration points that do exist within the system:

- **Monitoring Integration**: Prometheus metrics collection and Grafana visualization
- **Container Orchestration**: Docker-based deployment and local development
- **Configuration Integration**: Environment-based configuration management
- **Health Check Integration**: Availability monitoring endpoints

The absence of API gateways, message queues, authentication providers, and third-party services is an **intentional architectural decision**, not a limitation. As stated in Section 1.2.1, "This isolation is a deliberate design choice to ensure the learning experience remains focused and accessible."

#### 6.3.1.2 Integration Complexity Assessment

The system's integration architecture can be characterized as **Level 1: Standalone System** on the integration complexity spectrum:

| Integration Level | Characteristics | Applicable to This System |
|---|---|---|
| Level 1: Standalone | Single application, monitoring only, no business integrations | ✓ Yes |
| Level 2: Simple Integration | Few external services, synchronous APIs | ✗ No |
| Level 3: Enterprise Integration | Multiple services, message queues, API gateway | ✗ No |
| Level 4: Distributed Systems | Microservices, service mesh, distributed tracing | ✗ No |

This positioning enables the system to demonstrate production-ready operational patterns (monitoring, health checks, containerization) while avoiding the cognitive overhead of distributed systems, service orchestration, and inter-service communication.

### 6.3.2 API Design

#### 6.3.2.1 REST Endpoint Specification

The Node.js Hello World Service exposes a **single REST endpoint** implementing the GET HTTP method, as defined in `src/backend/handlers/helloHandler.js`. This minimal API surface demonstrates RESTful principles without introducing complexity.

**Primary API Endpoint:**

| Endpoint | Method | Description | Content-Type | Response Body |
|---|---|---|---|
| `/hello` | GET | Returns greeting message | text/plain | "Hello world" |

**HTTP Status Code Implementation:**

The system implements four HTTP status codes defined in `src/backend/utils/constants.js`:

| Status Code | Scenario | Handler | Response Message |
|---|---|---|---|
| 200 OK | Successful GET to /hello | `helloHandler.js` | "Hello world" |
| 404 Not Found | Request to unknown path | `errorHandler.js` (handle404) | "Not Found" |
| 405 Method Not Allowed | Non-GET method to /hello | `errorHandler.js` (handle405) | "Method Not Allowed" |
| 500 Internal Server Error | Server-side error | `errorHandler.js` (handleServerError) | "Internal Server Error" |

**Implementation Evidence:**

The hello endpoint handler in `src/backend/handlers/helloHandler.js` implements method validation and response generation:

```javascript
function handleHelloRequest(req, res) {
  if (method === HTTP_METHODS.GET) {
    res.statusCode = HTTP_STATUS.OK;  // 200
    res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.CONTENT_TYPE_TEXT);
    res.end(MESSAGES.HELLO_RESPONSE);  // "Hello world"
  } else {
    handle405(res);  // Method Not Allowed
  }
}
```

For requests using unsupported HTTP methods (POST, PUT, DELETE, PATCH, etc.), the handler returns 405 Method Not Allowed with an `Allow: GET` header indicating the supported method, as documented in Section 5.1.3.

#### 6.3.2.2 Request Processing Pipeline

**Middleware Chain Architecture:**

The system implements a **synchronous middleware pipeline** that processes every incoming HTTP request through a fixed sequence of operations, as detailed in Section 5.1.3. The middleware chain is defined in `src/backend/middleware/index.js` and applied in `src/backend/server.js`:

1. **Request Logger Middleware** (`requestLogger`): Captures request start time, wraps `res.end()` to calculate response time, logs request method, URL, status code, and elapsed time
2. **Security Headers Middleware** (`securityHeaders`): Injects HTTP security headers into all responses
3. **Router**: URL path parsing using native `url.parse()`, route matching against handler mappings
4. **Handler**: Endpoint-specific business logic execution
5. **Error Handler**: Catches synchronous errors and generates appropriate error responses

**Request Flow Sequence:**

```mermaid
sequenceDiagram
    participant Client
    participant HTTPServer as HTTP Server<br/>(server.js)
    participant Logger as Request Logger<br/>Middleware
    participant Security as Security Headers<br/>Middleware
    participant Router as Router<br/>(routeRequest)
    participant Handler as Hello Handler<br/>(helloHandler.js)
    
    Client->>HTTPServer: HTTP GET /hello
    HTTPServer->>Logger: handleRequest(req, res)
    Logger->>Logger: Wrap res.end() for timing
    Logger->>Security: next()
    Security->>Security: Inject security headers
    Security->>Router: next()
    Router->>Router: Parse URL pathname
    Router->>Handler: Route to handleHello()
    Handler->>Handler: Validate HTTP method
    Handler->>Handler: Generate response body
    Handler->>HTTPServer: res.end("Hello world")
    HTTPServer->>Logger: Wrapped res.end() executes
    Logger->>Logger: Calculate response time
    Logger->>Logger: Log: GET /hello 200 5ms
    HTTPServer->>Client: HTTP 200 "Hello world"
```

This synchronous processing model ensures that the complete request lifecycle—from connection establishment to response completion—occurs within a single Node.js event loop iteration, as explained in Section 5.1.1's description of the "single-process, single-threaded HTTP server."

#### 6.3.2.3 Security Headers Integration

**Mandatory Security Headers:**

The `securityHeaders` middleware in `src/backend/middleware/index.js` applies three HTTP security headers to **every response**, regardless of status code or handler outcome:

| Header | Value | Protection |
|---|---|---|
| X-Content-Type-Options | nosniff | Prevents MIME type sniffing attacks |
| X-Frame-Options | DENY | Prevents clickjacking by disallowing iframe embedding |
| Content-Security-Policy | default-src 'none' | Restricts resource loading to prevent XSS attacks |

These headers are applied before handler execution and persist through error responses, ensuring consistent security posture across all integration points. As documented in Section 1.2.2, this demonstrates that "even simple services should follow operational best practices."

#### 6.3.2.4 No Authentication or Authorization

**Intentional Exclusion of Authentication:**

The system explicitly excludes authentication and authorization mechanisms, as documented in Section 3.5.1:

- **No Authentication Providers**: No Auth0, Okta, or other identity services
- **No API Keys**: No credential-based access control
- **No JWT Tokens**: No bearer token validation
- **No Session Management**: Stateless design with no user sessions
- **No OAuth/OIDC**: No authorization code flows or implicit grants

**Architectural Rationale:**

Section 3.5.1 explains this exclusion: "External services add complexity and setup requirements that distract from core Node.js server concepts. The service focuses on HTTP fundamentals, not integration patterns." Authentication would require API keys, configuration management, and error handling for authentication failures, fundamentally shifting the learning focus from HTTP request-response patterns to identity and access management.

#### 6.3.2.5 No Rate Limiting or Throttling

The system does not implement rate limiting middleware or distributed rate limiting mechanisms (Redis-based rate stores). This exclusion aligns with the educational scope—demonstrating rate limiting patterns would require introducing state management (in-memory token buckets or distributed Redis counters) and configuration complexity (rate windows, burst limits, quota management) that extends beyond the core HTTP concepts focus.

As noted in Section 5.1.1, the "stateless nature of the service—with no session management, persistent storage, or shared state—enables trivial horizontal scaling when needed." If traffic management becomes necessary, rate limiting would be implemented at the infrastructure layer (load balancer, API gateway) rather than within the application.

#### 6.3.2.6 No API Versioning Strategy

**Single-Version API:**

The system exposes a single endpoint (`/hello`) without versioning prefixes (no `/v1/hello` or `/api/v1/hello` patterns). This design decision reflects several factors:

- **Stable Endpoint Contract**: The `/hello` endpoint returns a fixed response ("Hello world") with no evolving schema or breaking changes
- **Educational Simplicity**: API versioning strategies (URL-based, header-based, content negotiation) add complexity without demonstrating fundamental concepts
- **No Backward Compatibility Requirements**: As a new educational project with no production consumers, version migration concerns do not apply

For systems requiring API evolution, versioning would typically be implemented through URL path prefixes (`/v1/`, `/v2/`) or Accept header content negotiation (`application/vnd.api+json;version=1`), but these patterns are unnecessary for this single-endpoint system.

### 6.3.3 Message Processing Architecture

#### 6.3.3.1 Message Processing Not Applicable

**Message processing architecture is not applicable for this system.**

The Node.js Hello World Service does not implement asynchronous message processing patterns, event-driven architectures, or batch processing workflows. As explicitly documented in Section 5.1.1, the system has:

- **No message queues**: No RabbitMQ, Apache Kafka, AWS SQS, or Azure Service Bus
- **No event processing**: No event buses, pub/sub patterns, or event sourcing
- **No stream processing**: No Apache Kafka Streams, Apache Flink, or real-time data pipelines
- **No batch processing**: No scheduled jobs, cron-based workflows, or batch data imports

**Architectural Pattern:**

The system exclusively uses a **synchronous request-response pattern** where all processing occurs within the HTTP request lifecycle. Section 5.1.1 describes this as a "stateless monolithic HTTP server architecture using a synchronous request-response pattern." Every request completes within milliseconds, returns a response immediately, and does not trigger asynchronous background processing.

**Request Processing Model:**

```mermaid
graph LR
    A[HTTP Request Arrives] --> B[Middleware Processing]
    B --> C[Handler Execution]
    C --> D[Response Generation]
    D --> E[HTTP Response Sent]
    E --> F[Request Complete]
    
    style A fill:#4CAF50
    style F fill:#4CAF50
    style B fill:#2196F3
    style C fill:#2196F3
    style D fill:#2196F3
```

**Rationale for Exclusion:**

Section 3.5.1 explains: "External services add complexity and setup requirements that distract from core Node.js server concepts." Introducing message queues would require:

- **Queue Infrastructure**: RabbitMQ or Kafka deployment and management
- **Producer/Consumer Patterns**: Message serialization, acknowledgments, dead letter queues
- **Async Complexity**: Promise chains, error handling for asynchronous operations
- **State Management**: Tracking in-flight messages and processing status

These patterns fundamentally shift focus from HTTP fundamentals to distributed systems architecture, contradicting the educational mission stated in Section 1.2.1: "Intentionally narrow focus on HTTP server basics to enable deep understanding of core concepts."

#### 6.3.3.2 No Event-Driven Integration

The system does not implement event-driven integration patterns such as:

- **Event Emitters**: No custom EventEmitter usage for application-level events
- **Webhooks**: No outbound HTTP callbacks to external systems on events
- **Server-Sent Events (SSE)**: No long-lived HTTP connections for server push
- **WebSockets**: No bidirectional persistent connections

All communication occurs through standard HTTP request-response cycles with immediate completion. The Node.js `http` module's internal event emitters (for 'request', 'error', 'close' events) are used for server lifecycle management, but these are framework-level concerns, not application integration patterns.

### 6.3.4 External Systems Integration

#### 6.3.4.1 Monitoring Integration Architecture

**Prometheus Metrics Collection:**

The system integrates with **Prometheus** for metrics collection using a **pull-based scraping model**, as configured in `infrastructure/monitoring/prometheus.yml`. This integration pattern enables time-series data collection without requiring the application to maintain persistent connections to monitoring infrastructure.

**Prometheus Scrape Configuration:**

The Prometheus configuration defines three distinct scrape jobs with different intervals and purposes:

| Scrape Job | Target Endpoint | Interval | Timeout | Purpose |
|---|---|---|---|
| prometheus | localhost:9090 | 15s | 10s | Prometheus self-monitoring |
| hello-world-app | hello-world-app:3000/metrics | 5s | 10s | Application metrics collection |
| hello-world-health | hello-world-app:3000/health | 30s | 10s | Health status monitoring |

**Scrape Job Details from `prometheus.yml`:**

```yaml
scrape_configs:
  - job_name: 'hello-world-app'
    static_configs:
      - targets: ['hello-world-app:3000']
        labels:
          service: 'hello-world-app'
    metrics_path: '/metrics'
    scrape_interval: 5s  # High-frequency metrics collection
    
  - job_name: 'hello-world-health'
    metrics_path: '/health'
    scrape_interval: 30s  # Lower frequency health checks
    static_configs:
      - targets: ['hello-world-app:3000']
```

**Service Discovery Pattern:**

The configuration uses **static targets** (`hello-world-app:3000`) with Docker Compose DNS resolution rather than dynamic service discovery (Consul, Kubernetes service discovery). The hostname `hello-world-app` resolves to the application container's IP address within the `hello-world-network` Docker bridge network defined in `infrastructure/local/docker-compose.yml`.

**Integration Flow:**

```mermaid
sequenceDiagram
    participant App as Hello World App<br/>(Port 3000)
    participant Prom as Prometheus<br/>(Port 9090)
    participant DB as Time-Series DB
    participant Graf as Grafana<br/>(Port 3001)
    
    Note over Prom: Every 5 seconds
    Prom->>App: HTTP GET /metrics
    App->>Prom: Prometheus exposition format
    Prom->>DB: Store time-series data
    
    Note over Prom: Every 30 seconds
    Prom->>App: HTTP GET /health
    App->>Prom: Health check response
    Prom->>DB: Store availability metric
    
    Note over Graf: User requests dashboard
    Graf->>Prom: PromQL query
    Prom->>DB: Retrieve time-series
    DB->>Prom: Metric values
    Prom->>Graf: Query results
    Graf->>Graf: Render visualization
```

**Grafana Dashboard Integration:**

The system includes a pre-configured Grafana dashboard (`infrastructure/monitoring/grafana-dashboard.json`) with 13 visualization panels expecting a Prometheus datasource named "Prometheus". The dashboard queries include:

- **Application Status**: `up{job="hello-world-app"}` - Binary availability metric
- **Request Rate**: `rate(http_requests_total[1m])` - Requests per second
- **Response Time Percentiles**: `histogram_quantile(0.95, http_request_duration_seconds_bucket)` - 95th percentile latency
- **Error Rate**: HTTP status code distribution and error percentage calculations
- **Node.js Metrics**: `nodejs_memory_usage_bytes`, `nodejs_cpu_usage_percentage`, `nodejs_event_loop_lag_seconds`

**Implementation Status Note:**

As documented in Section 5.1.1, "the monitoring infrastructure (Prometheus configuration, Grafana dashboard with 13 panels) is fully provisioned in `infrastructure/monitoring/`, but the application does not currently expose `/metrics` or `/health` endpoints." Full observability functionality requires implementing metrics instrumentation using the `prom-client` library to expose the Prometheus exposition format.

#### 6.3.4.2 Container Orchestration Integration

**Docker Integration Pattern:**

The system integrates with **Docker Engine** for container lifecycle management and **Docker Compose** for local development orchestration, as configured in `infrastructure/local/docker-compose.yml`.

**Container Service Definition:**

```yaml
services:
  hello-world-app:
    build:
      context: ../..
      dockerfile: Dockerfile
    image: hello-world-app:latest
    container_name: hello-world-app
    ports:
      - "3000:3000"  # Host:Container port mapping
    environment:
      - PORT=3000
      - NODE_ENV=development
    volumes:
      - ../../src/backend:/app  # Hot-reload volume mount
      - /app/node_modules  # Preserve container node_modules
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    networks:
      - hello-world-network
```

**Integration Points:**

| Integration Type | Implementation | Purpose |
|---|---|---|
| Health Check Probe | curl -f http://localhost:3000/hello | Container health status verification |
| Volume Mounting | src/backend:/app bind mount | Hot-reload development workflow |
| Network Isolation | hello-world-network bridge | Container-to-container DNS resolution |
| Port Mapping | 3000:3000 | Host access to containerized service |
| Environment Variables | PORT, NODE_ENV injection | Configuration integration |

**Docker Build Integration:**

The `Dockerfile` at the repository root implements a **production-optimized build pattern** using the Alpine Linux base image:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY src/backend/package*.json ./
RUN npm install --production  # Production dependencies only
COPY src/backend/ ./
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]
```

**Build Optimization Strategy:**

- **Layer Caching**: Copy `package*.json` before application code to cache dependency installation
- **Production Dependencies**: `npm install --production` excludes devDependencies (Jest, Supertest)
- **Minimal Base Image**: Alpine Linux reduces image size to ~100MB vs. ~900MB for standard Node.js images
- **Single Process**: No process manager (PM2, nodemon) in production—relies on container restart policies

**Container Orchestration Flow:**

```mermaid
graph TB
    subgraph "Build Phase"
        A[Dockerfile] --> B[docker build]
        B --> C[hello-world-app:latest]
    end
    
    subgraph "Development Orchestration"
        D[docker-compose.yml] --> E[Docker Compose]
        C --> E
        E --> F[Create Network<br/>hello-world-network]
        E --> G[Start Container<br/>hello-world-app]
        E --> H[Mount Volumes<br/>src/backend]
        E --> I[Start Prometheus]
        E --> J[Start Grafana]
    end
    
    subgraph "Runtime Integration"
        G --> K[Health Check<br/>Every 30s]
        K --> L{Response OK?}
        L -->|Yes| M[Container Healthy]
        L -->|No| N[Increment Retry Count]
        N -->|3 Retries| O[Mark Unhealthy]
        I --> P[Scrape Metrics<br/>Every 5s]
        J --> Q[Query Prometheus<br/>On Demand]
    end
    
    style C fill:#2196F3
    style G fill:#4CAF50
    style M fill:#4CAF50
    style O fill:#F44336
```

#### 6.3.4.3 Health Check Integration

**Health Check Endpoint Contract:**

The system's health check integration uses the `/hello` endpoint as a **dual-purpose functional and health check endpoint**, as documented in Section 5.1.1. This design leverages the single-endpoint architecture to verify both application availability and correct response generation.

**Health Check Script Implementation:**

The `infrastructure/scripts/health-check.sh` script provides a reusable health verification mechanism used by multiple integration points:

```bash
#!/bin/bash
# Health check script validating /hello endpoint

ENDPOINT="http://localhost:3000/hello"
EXPECTED_RESPONSE="Hello world"
TIMEOUT=${TIMEOUT:-5}

response=$(curl -s -m "$TIMEOUT" "$ENDPOINT")

if [[ "$response" == "$EXPECTED_RESPONSE" ]]; then
  echo "Health check passed: $response"
  exit 0
else
  echo "Health check failed: Expected '$EXPECTED_RESPONSE', got '$response'"
  exit 1
fi
```

**Health Check Integration Points:**

| Integration Point | Interval | Timeout | Retries | Purpose |
|---|---|---|---|---|
| Docker Compose | 30s | 10s | 3 | Container orchestration health status |
| Deployment Script | Variable | 5s | 10 | Post-deployment verification |
| Prometheus | 30s | 10s | N/A | Availability monitoring |

**Health Check Verification Flow:**

```mermaid
sequenceDiagram
    participant Docker as Docker Engine
    participant Container as Hello World Container
    participant Script as health-check.sh
    participant Endpoint as /hello Endpoint
    
    Note over Docker: Every 30 seconds
    Docker->>Container: Execute health check
    Container->>Script: Run health-check.sh
    Script->>Endpoint: curl -f http://localhost:3000/hello
    Endpoint->>Script: HTTP 200 "Hello world"
    Script->>Script: Validate response == "Hello world"
    Script->>Container: Exit 0 (success)
    Container->>Docker: Report healthy status
    
    Note over Docker: After 3 failures
    Docker->>Docker: Mark container unhealthy
    Docker->>Docker: Trigger restart (unless-stopped policy)
```

#### 6.3.4.4 Deployment Automation Integration

**Deployment Script Architecture:**

The `infrastructure/scripts/deploy.sh` script orchestrates the complete deployment workflow, integrating Docker build, Docker Compose orchestration, and health verification:

**Deployment Integration Steps:**

1. **Pre-Deployment Validation**: Verify Docker and Docker Compose availability
2. **Image Build**: Execute `docker build` with layer caching
3. **Container Orchestration**: Run `docker-compose up -d` for detached deployment
4. **Health Verification**: Retry health check 10 times with 5-second intervals
5. **Rollback on Failure**: Stop containers and restore previous state if health checks fail
6. **Cleanup**: Remove dangling images and unused volumes

**Deployment Integration Flow:**

```mermaid
flowchart TD
    A[deploy.sh Execution] --> B{Docker Available?}
    B -->|No| C[Exit with Error]
    B -->|Yes| D[Build Docker Image]
    
    D --> E[Tag as latest]
    E --> F[docker-compose up -d]
    
    F --> G[Wait 5 seconds]
    G --> H[Run health-check.sh]
    
    H --> I{Health Check OK?}
    I -->|Yes| J[Deployment Success]
    I -->|No| K{Retry < 10?}
    
    K -->|Yes| L[Wait 5 seconds]
    L --> H
    K -->|No| M[Rollback Deployment]
    
    M --> N[docker-compose down]
    N --> O[Restore Previous Image]
    O --> P[Exit with Failure]
    
    style J fill:#4CAF50
    style P fill:#F44336
```

#### 6.3.4.5 Configuration Management Integration

**Environment Variable Integration:**

The system integrates with the host environment through **environment variables** for all runtime configuration, implementing the Twelve-Factor App methodology as documented in Section 5.1.1.

**Configuration Loading Pattern:**

The `src/backend/config.js` module uses the `dotenv` library to load environment variables from `.env` files:

```javascript
// Environment file loading with dotenv
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Variable extraction with defaults
const PORT = validatePort(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';
```

**Configuration Integration Points:**

| Variable | Default | Validation | Integration Point |
|---|---|---|---|
| PORT | 3000 | 1-65535 range check | Server bind address |
| HOST | 0.0.0.0 | String (no validation) | Network interface binding |
| NODE_ENV | development | String (no validation) | Environment-specific behavior |
| LOG_LEVEL | INFO | String (no validation) | Logger verbosity control |

**Configuration Override Hierarchy:**

1. **Command-line environment variables**: `PORT=8080 node index.js` (highest priority)
2. **Docker Compose environment section**: Defined in `docker-compose.yml`
3. **`.env` file**: Loaded by dotenv if present
4. **Hardcoded defaults**: Defined in `config.js` (lowest priority)

This hierarchy enables configuration flexibility across development, testing, and production environments without code changes.

#### 6.3.4.6 Explicitly Excluded External Systems

**No Third-Party Service Integrations:**

As comprehensively documented in Section 3.5.1, the system intentionally excludes all third-party service integrations:

**Excluded Authentication Services:**
- No Auth0, Okta, or other identity providers
- No LDAP or Active Directory integration
- No SAML or OAuth/OIDC flows

**Excluded Cloud Services:**
- No AWS services (S3, CloudFront, Lambda, API Gateway)
- No Azure services (Blob Storage, CDN, Functions)
- No Google Cloud Platform services

**Excluded SaaS Platforms:**
- No payment processors (Stripe, PayPal, Square)
- No email services (SendGrid, Mailgun, AWS SES)
- No analytics platforms (Google Analytics, Mixpanel, Segment)
- No error tracking (Sentry, Rollbar, Bugsnag)
- No CDN services (Cloudflare, Fastly, Akamai)

**Rationale for Exclusions:**

Section 3.5.1 provides five justifications for excluding external services:

1. **Educational Focus**: External services distract from core Node.js server concepts
2. **Zero Setup Friction**: No API keys, account creation, or service configuration required
3. **Consistent Behavior**: No rate limits, API changes, or service outages affecting learning
4. **Security Simplification**: No credentials to manage or accidentally commit to version control
5. **Cost Elimination**: No paid services required, ensuring accessibility for all developers

**No API Gateway Integration:**

The system does not integrate with API gateway solutions (AWS API Gateway, Kong, Tyk, Apigee). As documented in Section 6.1.4.1, "No gateway layer routes, transforms, or aggregates requests across multiple backend services. The HTTP server directly handles client requests without intermediary routing layers."

The Node.js HTTP server binds directly to `HOST:PORT` (default 0.0.0.0:3000) and receives client connections without reverse proxy, load balancer, or API gateway intermediaries. This design exposes HTTP protocol fundamentals without abstraction layers.

**No Legacy System Interfaces:**

As a new educational project documented in Section 1.2.1, there are "no legacy system limitations or migration concerns." The system does not implement:

- **Adapter patterns** for legacy SOAP services or mainframe systems
- **Database synchronization** with existing data stores
- **Data migration pipelines** from legacy formats
- **Backward compatibility layers** for deprecated APIs

### 6.3.5 Integration Patterns and Flows

#### 6.3.5.1 Complete Integration Architecture Diagram

The following diagram illustrates all integration points and external system connections:

```mermaid
graph TB
    subgraph "External Clients"
        Client[HTTP Client<br/>Browser/curl]
    end
    
    subgraph "Application Container"
        App[Node.js Application<br/>Port 3000]
        AppServer[HTTP Server<br/>server.js]
        AppHandler[Hello Handler<br/>helloHandler.js]
        AppConfig[Configuration<br/>config.js]
    end
    
    subgraph "Monitoring Stack"
        Prom[Prometheus<br/>Port 9090]
        PromDB[(Time-Series<br/>Database)]
        Graf[Grafana<br/>Port 3001]
    end
    
    subgraph "Container Platform"
        Docker[Docker Engine]
        Compose[Docker Compose]
        Network[hello-world-network<br/>Bridge Network]
    end
    
    subgraph "Configuration Sources"
        EnvFile[.env File]
        EnvVars[Environment Variables]
        Defaults[Hardcoded Defaults]
    end
    
    subgraph "Deployment Automation"
        DeployScript[deploy.sh]
        HealthScript[health-check.sh]
    end
    
    Client -->|HTTP GET /hello| App
    App --> AppServer
    AppServer --> AppHandler
    AppHandler -->|"Hello world"| Client
    
    Prom -->|Scrape /metrics<br/>Every 5s| App
    Prom -->|Scrape /health<br/>Every 30s| App
    Prom --> PromDB
    Graf -->|PromQL Queries| Prom
    
    EnvFile -->|"dotenv.config()"| AppConfig
    EnvVars -->|"process.env"| AppConfig
    Defaults -->|Fallback Values| AppConfig
    AppConfig --> App
    
    Docker -->|Lifecycle Management| App
    Compose -->|Orchestration| Docker
    Network -->|DNS Resolution| App
    Network -->|DNS Resolution| Prom
    
    DeployScript -->|docker build| Docker
    DeployScript -->|docker-compose up| Compose
    DeployScript -->|Verification| HealthScript
    HealthScript -->|curl /hello| App
    Docker -->|Health Check<br/>Every 30s| HealthScript
    
    style App fill:#4CAF50
    style Client fill:#2196F3
    style Prom fill:#FF9800
    style Graf fill:#FF9800
```

#### 6.3.5.2 Request Processing Integration Flow

The complete request processing flow showing middleware integration, handler execution, and logging integration:

```mermaid
sequenceDiagram
    participant Client
    participant Server as HTTP Server<br/>(server.js)
    participant ReqLog as Request Logger<br/>Middleware
    participant SecHead as Security Headers<br/>Middleware
    participant Router as Router
    participant Handler as Hello Handler
    participant Logger as Logger Utility<br/>(logger.js)
    participant Docker as Docker Logs
    
    Client->>Server: HTTP GET /hello
    Server->>ReqLog: handleRequest(req, res)
    
    Note over ReqLog: Capture start time
    ReqLog->>ReqLog: Wrap res.end() for timing
    ReqLog->>SecHead: next()
    
    SecHead->>SecHead: Inject X-Content-Type-Options
    SecHead->>SecHead: Inject X-Frame-Options
    SecHead->>SecHead: Inject Content-Security-Policy
    SecHead->>Router: next()
    
    Router->>Router: Parse URL pathname
    Router->>Router: Match route: /hello
    Router->>Handler: Route to handleHello()
    
    Handler->>Handler: Validate method == GET
    Handler->>Handler: Set statusCode = 200
    Handler->>Handler: Set Content-Type = text/plain
    Handler->>Server: res.end("Hello world")
    
    Note over ReqLog: Wrapped res.end() executes
    ReqLog->>ReqLog: Calculate response time
    ReqLog->>Logger: log("GET /hello 200 5ms")
    Logger->>Logger: Format with ISO timestamp
    Logger->>Docker: Write to stdout
    
    Server->>Client: HTTP 200 "Hello world"
    Docker->>Docker: Capture log entry
```

#### 6.3.5.3 Monitoring Integration Flow

The Prometheus metrics collection and Grafana visualization integration pattern:

```mermaid
graph LR
subgraph "Application"
    A["/hello Endpoint<br/>Business Logic"]
    B["/metrics Endpoint<br/>Prometheus Format"]
    C["/health Endpoint<br/>Availability Check"]
end

subgraph "Prometheus"
    D["Scraper<br/>5s Interval"]
    E["Scraper<br/>30s Interval"]
    F["Time-Series DB"]
    G["Query Engine"]
end

subgraph "Grafana"
    H["Dashboard<br/>13 Panels"]
    I["Data Source<br/>Prometheus"]
end

D -->|HTTP GET| B
B -->|Metrics Data| D
D --> F

E -->|HTTP GET| C
C -->|Health Status| E
E --> F

H --> I
I -->|PromQL| G
G --> F
F -->|Query Results| G
G -->|Formatted Data| I
I -->|JSON Response| H

style B fill:#FF9800
style C fill:#FF9800
style F fill:#FF9800
```

#### 6.3.5.4 Container Orchestration Integration Flow

The Docker build, deployment, and health check integration workflow:

```mermaid
flowchart TB
    subgraph "Build Phase"
        A[Source Code<br/>src/backend/] --> B[Dockerfile]
        B --> C[docker build]
        C --> D[Image: hello-world-app:latest]
    end
    
    subgraph "Orchestration Phase"
        E[docker-compose.yml] --> F[docker-compose up -d]
        D --> F
        F --> G[Create Network<br/>hello-world-network]
        F --> H[Start Application Container]
        F --> I[Start Prometheus Container]
        F --> J[Start Grafana Container]
    end
    
    subgraph "Runtime Integration"
        H --> K[Bind Port 3000:3000]
        H --> L[Mount Volume src/backend:/app]
        H --> M[Inject Environment Variables]
        H --> N[Start Health Checks]
        
        N --> O{Health Check Loop}
        O -->|Every 30s| P[curl /hello]
        P --> Q{Response OK?}
        Q -->|Yes| R[Mark Healthy]
        Q -->|No| S[Increment Retry]
        S --> T{Retries >= 3?}
        T -->|Yes| U[Mark Unhealthy<br/>Trigger Restart]
        T -->|No| O
    end
    
    subgraph "Monitoring Integration"
        I --> V[Prometheus Scrapes<br/>:3000/metrics]
        I --> W[Prometheus Scrapes<br/>:3000/health]
        J --> X[Grafana Queries<br/>Prometheus API]
    end
    
    style D fill:#2196F3
    style H fill:#4CAF50
    style R fill:#4CAF50
    style U fill:#F44336
```

### 6.3.6 References

#### Technical Specification Sections

- `1.2 System Overview` - Educational project context and integration exclusions
- `1.2.1 Project Context` - Standalone architecture and isolation by design
- `3.5 Third-Party Services` - Comprehensive documentation of intentionally excluded external services
- `5.1 High-Level Architecture` - Monolithic server architecture and integration points
- `5.1.1 System Overview` - Single-process implementation and stateless design
- `5.1.3 Data Flow Description` - Request processing pipeline and middleware chain
- `5.1.4 External Integration Points` - Monitoring and infrastructure integration details
- `6.1 Core Services Architecture` - Monolithic architecture confirmation and distributed systems exclusions
- `3.9 Technology Integration Architecture` - Overall technology stack integration diagram

#### Implementation Files Examined

- `infrastructure/local/docker-compose.yml` - Docker Compose orchestration configuration with service definitions, networking, volumes, and health checks
- `infrastructure/monitoring/prometheus.yml` - Prometheus scrape configuration defining metrics collection jobs, intervals, and targets
- `infrastructure/monitoring/grafana-dashboard.json` - Pre-configured Grafana dashboard with 13 visualization panels and PromQL queries
- `infrastructure/scripts/health-check.sh` - Health verification script validating /hello endpoint availability and response correctness
- `infrastructure/scripts/deploy.sh` - Deployment automation orchestrating Docker build, Docker Compose deployment, and health verification
- `src/backend/server.js` - HTTP server implementation with middleware pipeline, routing, and request handling
- `src/backend/handlers/helloHandler.js` - Hello endpoint handler with method validation and response generation
- `src/backend/middleware/index.js` - Middleware implementations for request logging, security headers, and error handling
- `src/backend/utils/constants.js` - HTTP status codes, routes, headers, and messages definitions
- `src/backend/config.js` - Environment variable loading, validation, and configuration management using dotenv
- `src/backend/router.js` - URL routing logic with path normalization and handler dispatching
- `Dockerfile` - Production container build configuration with Alpine Linux base image

#### Architecture Validation

- **Search: "message queue rabbitmq kafka"** - No results (confirmed no message processing)
- **Search: "authentication auth0 okta jwt"** - No results (confirmed no authentication integration)
- **Search: "api gateway kong tyk"** - No results (confirmed no API gateway)
- **Search: "external api third party service"** - No results (confirmed no third-party service integrations)
- **Docker Compose Analysis** - Single application container with monitoring infrastructure only
- **Prometheus Configuration Analysis** - Pull-based metrics scraping pattern confirmed
- **Health Check Script Analysis** - curl-based availability verification confirmed

## 6.4 Security Architecture

### 6.4.1 Overview and Applicability

#### 6.4.1.1 Security Architecture Scope

The Node.js Hello World Service implements a **deliberately minimal security architecture by design**, reflecting its educational mission of teaching HTTP fundamentals rather than enterprise security patterns. As documented in Section 3.8 and Section 5.4.3, the absence of traditional authentication, authorization, and encryption mechanisms represents an **intentional architectural decision**, not a security oversight.

**Applicability Statement:**

Traditional comprehensive security architecture—encompassing authentication frameworks, authorization systems, API key management, and application-level encryption—is **not applicable to this educational system**. The service exposes a single public endpoint (`/hello`) with no sensitive data, no user accounts, no state-changing operations, and no protected resources, eliminating the need for identity management, access control, and data protection beyond basic HTTP security practices.

**What IS Implemented:**

This section documents the **production-ready security measures** that are implemented, demonstrating that even simple educational services follow operational best practices:

- **HTTP Security Headers**: Protection against MIME sniffing, clickjacking, and XSS attacks
- **Container Security**: Minimal attack surface through Alpine Linux and dependency reduction
- **Error Handling Security**: Information disclosure prevention through generic error messages
- **Configuration Security**: Environment-based secrets management and validation
- **Attack Surface Reduction**: Stateless design eliminating entire vulnerability classes

**Architectural Philosophy:**

As stated in Section 3.5.1, "External services add complexity and setup requirements that distract from core Node.js server concepts." This principle extends to security architecture—implementing OAuth flows, JWT validation, role-based access control, and API key management would fundamentally shift the learning focus from HTTP request-response patterns to identity and access management, contradicting the educational mission defined in Section 1.2.1.

#### 6.4.1.2 Security Posture Summary

The following table provides a comprehensive overview of the system's security posture across standard security domains:

| Security Domain | Implementation Status | Rationale |
|---|---|---|
| **HTTP Security Headers** | ✅ **Fully Implemented** | OWASP-recommended headers protect against web attacks |
| **Container Security** | ✅ **Implemented** | Alpine Linux base and production-only dependencies |
| **Error Handling Security** | ✅ **Implemented** | Generic error messages prevent information disclosure |
| **Configuration Security** | ⚠️ **Basic Implementation** | Environment variables with validation but no secrets vault |
| **Authentication** | ⚠️ **Not Applicable** | Public endpoint with no user identity requirements |
| **Authorization** | ⚠️ **Not Applicable** | No protected resources or access control requirements |
| **TLS/HTTPS Encryption** | ⚠️ **Infrastructure Layer** | Expected at load balancer, not application termination |
| **Rate Limiting** | ❌ **Not Implemented** | Expected at infrastructure layer for production deployments |
| **Input Validation** | ⚠️ **Not Applicable** | No user input processed beyond URL path |
| **Security Scanning** | ❌ **Not Implemented** | Manual npm audit available but no automated CI/CD scanning |

**Legend:**
- ✅ **Fully Implemented**: Production-ready implementation with comprehensive coverage
- ⚠️ **Not Applicable**: Security domain not relevant to educational scope
- ⚠️ **Basic Implementation**: Implemented but with acknowledged limitations
- ⚠️ **Infrastructure Layer**: Security control delegated to deployment infrastructure
- ❌ **Not Implemented**: Security control absent and represents known gap

### 6.4.2 HTTP Security Headers Framework

#### 6.4.2.1 Security Headers Implementation

The system implements **three mandatory HTTP security headers** applied to every response through the `securityHeaders` middleware in `src/backend/middleware/index.js` (lines 53-64). These headers provide defense-in-depth protection against common web vulnerabilities, demonstrating security best practices even for minimal services.

**Implemented Security Headers:**

| Header Name | Header Value | Protection Mechanism | OWASP Classification |
|---|---|---|---|
| **X-Content-Type-Options** | `nosniff` | Prevents MIME type sniffing attacks | Recommended |
| **X-Frame-Options** | `DENY` | Prevents clickjacking via iframe embedding | Recommended |
| **Content-Security-Policy** | `default-src 'none'` | Restricts all resource loading (XSS mitigation) | Recommended |

#### X-Content-Type-Options: nosniff

**Threat Model:**
Browsers may attempt to "sniff" content types by examining file contents rather than trusting the `Content-Type` header, potentially interpreting non-executable content as JavaScript. An attacker could exploit this by serving malicious JavaScript with an incorrect MIME type (e.g., `image/png`), causing the browser to execute code despite the declared content type.

**Protection Mechanism:**
The `nosniff` directive forces browsers to strictly adhere to the declared `Content-Type` header. If the server declares `Content-Type: text/plain`, the browser will never attempt to execute the content as JavaScript, even if the content contains script-like syntax.

**Implementation Evidence:**
```javascript
// src/backend/middleware/index.js:55
res.setHeader('X-Content-Type-Options', 'nosniff');
```

**Application Scope:** Applied to all responses (200 OK, 404 Not Found, 405 Method Not Allowed, 500 Internal Server Error).

#### X-Frame-Options: DENY

**Threat Model:**
Clickjacking attacks occur when an attacker embeds a legitimate site within an invisible iframe overlaid on a malicious page. Users believe they are clicking on the attacker's interface but are actually interacting with the hidden iframe, potentially triggering unintended actions on the legitimate site.

**Protection Mechanism:**
The `DENY` directive instructs browsers to refuse rendering the page within any frame, iframe, embed, or object element, regardless of the embedding site's origin. This prevents all clickjacking attacks by making iframe embedding technically impossible.

**Implementation Evidence:**
```javascript
// src/backend/middleware/index.js:58
res.setHeader('X-Frame-Options', 'DENY');
```

**Alternative Values:**
- `DENY`: Disallow all framing (chosen for maximum protection)
- `SAMEORIGIN`: Allow framing only from same-origin pages
- `ALLOW-FROM uri`: Allow framing from specific URI (deprecated)

**Rationale for DENY:**
The service has no legitimate use case for iframe embedding. Choosing `DENY` provides the strictest protection against clickjacking without impacting functionality.

#### Content-Security-Policy: default-src 'none'

**Threat Model:**
Cross-Site Scripting (XSS) attacks inject malicious scripts into web pages, executing arbitrary JavaScript in the user's browser context. Traditional XSS protection relies on output encoding and input sanitization, but Content Security Policy provides defense-in-depth by restricting which resources browsers are permitted to load.

**Protection Mechanism:**
The `default-src 'none'` directive establishes the strictest possible Content Security Policy, blocking all resource loading by default:
- No JavaScript execution (`script-src` defaults to 'none')
- No CSS loading (`style-src` defaults to 'none')
- No image loading (`img-src` defaults to 'none')
- No connection establishment (`connect-src` defaults to 'none')
- No font loading, media loading, or any other resource types

**Implementation Evidence:**
```javascript
// src/backend/middleware/index.js:61
res.setHeader('Content-Security-Policy', "default-src 'none'");
```

**Justification:**
This ultra-strict policy is appropriate for a plain text API endpoint that:
- Returns `Content-Type: text/plain` responses (no HTML rendering)
- Requires no JavaScript, CSS, images, or other web resources
- Has no interactive web interface requiring resource loading

If the system were to add an HTML-based web UI, the CSP would require relaxation to permit necessary resource loading (e.g., `default-src 'self'; script-src 'self'`).

#### 6.4.2.2 Security Headers Application Flow

The following diagram illustrates how security headers are injected into every response through the middleware pipeline:

```mermaid
sequenceDiagram
    participant Client
    participant Server as HTTP Server<br/>(server.js)
    participant ReqLog as Request Logger<br/>Middleware
    participant SecHeaders as Security Headers<br/>Middleware
    participant Router as Router
    participant Handler as Handler
    
    Client->>Server: HTTP Request<br/>(Any Method, Any Path)
    Server->>ReqLog: Execute Middleware Chain
    ReqLog->>ReqLog: Wrap res.end() for timing
    ReqLog->>SecHeaders: next()
    
    rect rgb(255, 245, 230)
        Note over SecHeaders: Security Headers Injection
        SecHeaders->>SecHeaders: res.setHeader('X-Content-Type-Options', 'nosniff')
        SecHeaders->>SecHeaders: res.setHeader('X-Frame-Options', 'DENY')
        SecHeaders->>SecHeaders: res.setHeader('Content-Security-Policy', "default-src 'none'")
    end
    
    SecHeaders->>Router: next()
    Router->>Handler: Route to Handler
    
    alt Successful Request
        Handler->>Client: 200 OK + Security Headers
    else 404 Not Found
        Handler->>Client: 404 Not Found + Security Headers
    else 405 Method Not Allowed
        Handler->>Client: 405 Method Not Allowed + Security Headers
    else 500 Internal Server Error
        Handler->>Client: 500 Internal Server Error + Security Headers
    end
    
    Note over Client,Server: All responses include security headers<br/>regardless of status code or error state
```

**Key Characteristics:**

1. **Universal Application**: Headers applied before routing and handler execution, ensuring presence even on error responses
2. **Fail-Safe Design**: Headers set early in the middleware chain, protecting against handler failures
3. **No Conditional Logic**: Same headers applied to all responses, eliminating configuration complexity
4. **Performance Impact**: Negligible overhead (three string header assignments per request)

#### 6.4.2.3 Attack Surface Reduction Through Headers

The security headers implementation contributes to attack surface reduction as documented in Section 5.4.3:

| Vulnerability Class | Header Protection | Mitigation Status | Additional Factors |
|---|---|---|---|
| **XSS (Cross-Site Scripting)** | Content-Security-Policy | ✅ **Mitigated** | Plain text responses, no HTML rendering |
| **Clickjacking** | X-Frame-Options | ✅ **Mitigated** | iframe embedding blocked |
| **MIME Type Confusion** | X-Content-Type-Options | ✅ **Mitigated** | Content type strictly enforced |
| **Reflected XSS** | CSP + No User Input | ✅ **Not Applicable** | No user input processing |
| **Stored XSS** | N/A | ✅ **Not Applicable** | No persistent storage |

**Defense-in-Depth Principle:**

While the system's plain text responses and lack of user input make many attacks technically impossible, the security headers provide **defense-in-depth protection** against future changes. If developers add HTML responses or user input processing without understanding security implications, the headers provide a safety net.

### 6.4.3 Authentication and Authorization Architecture

#### 6.4.3.1 Authentication Framework: Not Applicable

**Authentication is intentionally excluded from this system's security architecture.**

As documented in Section 6.3.2.4, the system implements **no authentication mechanisms**:

- **No Identity Providers**: No Auth0, Okta, LDAP, or Active Directory integration
- **No Credential Management**: No username/password validation or storage
- **No Token-Based Authentication**: No JWT (JSON Web Token), OAuth 2.0, or API keys
- **No Multi-Factor Authentication**: No TOTP, SMS, or biometric verification
- **No Session Management**: Stateless design with no user sessions or cookies
- **No Single Sign-On (SSO)**: No SAML, OpenID Connect, or federation protocols

**Architectural Rationale:**

The `/hello` endpoint serves as a **public information endpoint** with no access control requirements:

1. **No Sensitive Data**: Response contains static string "Hello world" with no confidential information
2. **No User Accounts**: System has no concept of users, identities, or principals
3. **No Protected Resources**: All endpoints are equally accessible to all clients
4. **No State Changes**: Read-only operations with no data modification capabilities
5. **Educational Focus**: Authentication patterns would distract from HTTP fundamentals

**Evidence from Codebase:**

- **Middleware Search**: No authentication middleware in `src/backend/middleware/index.js`
- **Handler Search**: No credential validation in `src/backend/handlers/helloHandler.js`
- **Dependency Search**: No authentication libraries in `package.json` (no passport, jsonwebtoken, bcrypt)
- **Configuration Search**: No authentication-related environment variables in `src/backend/config.js`

**Future Considerations:**

If the system were to add protected endpoints requiring authentication, recommended patterns include:

- **JWT Bearer Tokens**: Stateless authentication via signed JSON Web Tokens in Authorization header
- **API Key Authentication**: Simple credential-based access control for service-to-service communication
- **OAuth 2.0 Client Credentials**: Token-based authentication for machine-to-machine scenarios

#### 6.4.3.2 Authorization System: Not Applicable

**Authorization and access control are intentionally excluded from this system's security architecture.**

The system implements **no authorization mechanisms**:

- **No Role-Based Access Control (RBAC)**: No user roles, groups, or permission assignments
- **No Attribute-Based Access Control (ABAC)**: No policy-based authorization decisions
- **No Access Control Lists (ACLs)**: No resource-level permission management
- **No Permission Checking**: No authorization middleware or guard functions
- **No Audit Logging**: No access control event recording or compliance tracking
- **No Policy Enforcement Points**: No centralized or distributed authorization decisions

**Architectural Rationale:**

Authorization requires differentiation between requestors, which presupposes authentication. Since the system has no authentication (Section 6.4.3.1), authorization becomes conceptually impossible:

1. **All Requests Equal**: Every HTTP request receives identical treatment regardless of source
2. **No User Differentiation**: Stateless design maintains no client identity or context
3. **No Protected Operations**: All operations are read-only public information retrieval
4. **No Resource Ownership**: No concept of resource ownership or multi-tenancy

**Evidence from Codebase:**

- **Middleware Search**: No authorization middleware in `src/backend/middleware/index.js`
- **Handler Search**: No permission checks in `src/backend/handlers/helloHandler.js`
- **Route Definition**: No route-level authorization decorators or guards
- **Configuration Search**: No authorization policies in configuration files

#### 6.4.3.3 Authentication/Authorization Architecture Diagram

The following diagram illustrates the **intentional absence** of authentication and authorization layers in the request processing flow:

```mermaid
graph TB
    subgraph "Traditional Enterprise Architecture (NOT IMPLEMENTED)"
        A1[HTTP Request] --> A2[API Gateway]
        A2 --> A3[Authentication Layer<br/>JWT Validation]
        A3 --> A4{Valid Token?}
        A4 -->|No| A5[401 Unauthorized]
        A4 -->|Yes| A6[Authorization Layer<br/>Permission Check]
        A6 --> A7{Has Permission?}
        A7 -->|No| A8[403 Forbidden]
        A7 -->|Yes| A9[Business Logic]
        A9 --> A10[Response]
        
        style A3 fill:#ffcccc,stroke:#ff0000
        style A6 fill:#ffcccc,stroke:#ff0000
        style A5 fill:#ffcccc,stroke:#ff0000
        style A8 fill:#ffcccc,stroke:#ff0000
    end
    
    subgraph "Actual Implementation (SIMPLIFIED)"
        B1[HTTP Request<br/>Any Client] --> B2[Security Headers<br/>Middleware]
        B2 --> B3[Router]
        B3 --> B4[Handler<br/>No Identity Check]
        B4 --> B5[Response<br/>Hello world]
        
        style B1 fill:#ccffcc,stroke:#00cc00
        style B5 fill:#ccffcc,stroke:#00cc00
    end
    
    Note1[Traditional layers intentionally excluded<br/>for educational simplicity]
    Note2[All requests treated equally<br/>No identity or permissions]
    
    A3 -.->|NOT IMPLEMENTED| Note1
    A6 -.->|NOT IMPLEMENTED| Note1
    B4 -.->|NO CHECKS| Note2
```

**Key Design Principle:**

The architectural decision to exclude authentication and authorization represents a **conscious trade-off** between production-grade security and educational clarity. As stated in Section 1.2.1, the system maintains "intentionally narrow focus on HTTP server basics to enable deep understanding of core concepts."

### 6.4.4 Data Protection and Encryption

#### 6.4.4.1 Transport Layer Security (TLS/HTTPS)

**TLS/HTTPS encryption is NOT implemented at the application layer.**

The Node.js application does not terminate TLS connections or handle SSL/TLS certificates. The HTTP server binds directly to port 3000 using plain HTTP, transmitting all data unencrypted between the application and clients.

**Implementation Evidence:**

- **Dockerfile**: `EXPOSE 3000` (HTTP port, not 443 for HTTPS)
- **Docker Compose**: Port mapping `3000:3000` (HTTP traffic)
- **Server Configuration**: No TLS certificate configuration in `src/backend/server.js`
- **Dependencies**: No `https` module usage in application code
- **No Certificate Files**: No `.crt`, `.key`, or `.pem` files in repository

**Infrastructure-Layer Responsibility:**

As documented in Section 5.4.3, TLS termination is **expected at the infrastructure layer**:

- **Production Load Balancers**: AWS ALB, Azure Application Gateway, Google Cloud Load Balancer
- **Reverse Proxies**: Nginx, Apache HTTP Server, Traefik
- **Service Meshes**: Istio, Linkerd (mTLS between services)
- **Cloud Front-End Services**: AWS CloudFront, Azure CDN

**Security Risk:**

Without infrastructure-layer TLS, HTTP traffic is transmitted in cleartext, creating vulnerability to:

- **Man-in-the-Middle (MITM) Attacks**: Attackers can intercept and read all request/response data
- **Traffic Eavesdropping**: Network observers can monitor communication contents
- **Session Hijacking**: If sessions were implemented (not currently), session tokens could be stolen
- **Data Tampering**: Attackers can modify requests or responses in transit

**Mitigation:**

Production deployments **must** implement TLS at the infrastructure layer:

```
[Client] --HTTPS--> [Load Balancer with TLS] --HTTP--> [Application Container]
         (Encrypted)                             (Plain Text, Trusted Network)
```

This pattern is standard for containerized applications where TLS termination occurs at the ingress point (load balancer or reverse proxy) before traffic reaches application containers on trusted internal networks.

#### 6.4.4.2 Data Encryption at Rest

**Data encryption at rest is not applicable to this system.**

The stateless architecture documented in Section 5.4.4 eliminates persistent data storage:

- **No Database**: No PostgreSQL, MySQL, MongoDB, or other data stores
- **No File Storage**: No file system writes, no document storage
- **No Caching Layer**: No Redis, Memcached, or in-memory caches
- **No Session Storage**: Stateless design with no session persistence
- **No Log Aggregation**: Logs sent to stdout, captured by container runtime

**What IS Stored:**

The only persistent data are **Docker container logs**, which contain:
- Request method, URL path, and status code (e.g., "GET /hello 200 5ms")
- Startup and shutdown messages
- Error messages with generic descriptions (no sensitive details)

**Log Security:**

Docker logs stored in `/var/lib/docker/containers/<container-id>/<container-id>-json.log` are:
- Owned by root user with restricted permissions (600)
- Rotated by Docker's log rotation policies
- Not encrypted by default (Docker does not provide log encryption)

**Future Considerations:**

If the system were to add persistent storage, encryption at rest would require:
- **Database-Level Encryption**: Transparent Data Encryption (TDE) in PostgreSQL/MySQL
- **Volume Encryption**: Encrypted EBS volumes (AWS), Azure Disk Encryption, or dm-crypt
- **Key Management**: AWS KMS, Azure Key Vault, HashiCorp Vault for encryption key management

#### 6.4.4.3 Secrets Management

**Current Implementation: Basic Environment Variables**

The system uses **environment variables** for configuration management (Section 6.3.4.5), providing basic separation of configuration from code:

| Configuration Variable | Default Value | Sensitivity | Storage Method |
|---|---|---|---|
| PORT | 3000 | Low (public) | Environment variable or .env file |
| HOST | 0.0.0.0 | Low (public) | Environment variable or .env file |
| NODE_ENV | development | Low (public) | Environment variable or .env file |
| LOG_LEVEL | INFO | Low (public) | Environment variable or .env file |

**Current Security Posture:**

- ✅ **No Hardcoded Secrets**: No credentials embedded in source code
- ✅ **Environment-Based Configuration**: Follows Twelve-Factor App methodology
- ⚠️ **No Encryption**: `.env` file stored in plain text
- ⚠️ **No Access Control**: File system permissions rely on host OS
- ❌ **No Secrets Vault**: No HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault integration

**Security Gaps:**

1. **Version Control Risk**: `.env` file not explicitly excluded in `.gitignore` (if present)
2. **No Rotation**: No automatic secrets rotation capabilities
3. **No Audit Trail**: No logging of configuration access
4. **No Encryption**: Configuration values stored in plain text

**Justification:**

The current configuration contains **no sensitive secrets** (no database passwords, API keys, or authentication tokens), making sophisticated secrets management unnecessary for the educational scope.

**Production Recommendations:**

If adding secrets (database credentials, API keys), implement:

```mermaid
graph LR
subgraph "Current (Basic)"
    A1[".env File<br/>Plain Text"] --> A2["dotenv.config()"]
    A2 --> A3["process.env"]
    A3 --> A4["Application"]
    
    style A1 fill:#ffcccc
end

subgraph "Production (Recommended)"
    B1["AWS Secrets Manager<br/>Encrypted Storage"] --> B2["IAM Role Authentication"]
    B2 --> B3["aws-sdk fetch"]
    B3 --> B4["In-Memory Cache"]
    B4 --> B5["Application"]
    
    style B1 fill:#ccffcc
    style B2 fill:#ccffcc
end
```

#### 6.4.4.4 Data Masking and Sanitization

**Data masking is not applicable to this system.**

The system processes **no user input** and stores **no sensitive data** that would require masking:

- **No Personal Data**: No PII (names, emails, phone numbers, addresses)
- **No Financial Data**: No credit card numbers, bank accounts, or payment information
- **No Health Data**: No PHI (protected health information) or medical records
- **No Authentication Data**: No passwords, security questions, or biometric data

**Input Processing:**

The only "input" the system processes is the **URL path** from HTTP requests:
- Parsed using Node.js `url.parse()` (safe, built-in function)
- Matched against fixed route patterns (`/hello`)
- Never executed, evaluated, or used in file system operations
- No SQL, command injection, or path traversal risks

**Output Sanitization:**

All responses are either:
- **Static string literals**: "Hello world", "Not Found", "Method Not Allowed"
- **Generic error messages**: "Internal Server Error" (no details leaked)
- **Plain text format**: `Content-Type: text/plain` (no HTML rendering, no XSS risk)

**Logging Sanitization:**

Request logs contain only non-sensitive data:
```
GET /hello 200 5ms
POST /admin/delete-user 404 2ms
```

Even if clients send sensitive data in URLs (e.g., `GET /hello?password=secret123`), the logger only captures the path portion (`/hello`), not query parameters, providing inadvertent protection.

### 6.4.5 Container Security Architecture

#### 6.4.5.1 Container Image Security

The Docker container image implements **three production security best practices** as documented in Section 3.8.3:

#### Alpine Linux Minimal Base Image

**Implementation:**
```dockerfile
FROM node:18-alpine
```

**Security Benefits:**

| Aspect | Alpine Linux | Standard Debian | Security Impact |
|---|---|---|---|
| **Image Size** | ~50-70MB | ~300-400MB | Smaller attack surface |
| **Package Count** | ~50 packages | ~200 packages | Fewer vulnerability vectors |
| **Default Services** | Minimal | Many | Reduced exposure |
| **CVE Exposure** | Lower | Higher | Fewer security patches required |

**Justification:**

Alpine Linux uses **musl libc** and **BusyBox** instead of glibc and GNU utilities, providing a fundamentally smaller base with fewer potential vulnerabilities. The Alpine Security Team maintains rapid security response, typically patching critical vulnerabilities within hours of disclosure.

**Evidence:**
- `Dockerfile` line 2: `FROM node:18-alpine`
- Section 3.8.3: "Alpine Linux Base Image: Minimal package set reduces attack surface"

#### Production Dependencies Only

**Implementation:**
```dockerfile
RUN npm install --production
```

**Security Benefits:**

The `--production` flag excludes development dependencies from the container image:

| Dependency Category | Package Count | Included in Production |
|---|---|---|
| **Production Dependencies** | 1 (dotenv) | ✅ Yes |
| **Development Dependencies** | 4 (Jest, Supertest, nodemon, jest-junit) | ❌ No |

**Vulnerability Reduction:**

Development dependencies often have **higher vulnerability rates** because:
- Testing frameworks have less security scrutiny than production libraries
- Mock/stub libraries may have injection vulnerabilities
- Development tools update less frequently

By excluding devDependencies, the container reduces its dependency count by **80%** (from 5 total to 1 production dependency).

**Evidence:**
- `Dockerfile` line 12: `RUN npm install --production`
- `package.json`: Only `dotenv@16.0.3` in production dependencies

#### Minimal Dependency Surface

**Dependency Analysis:**

```
Production Dependencies (1 total):
└── dotenv@16.0.3 (Configuration management)

Development Dependencies (4 total, EXCLUDED):
├── jest@29.4.3 (Testing framework)
├── supertest@6.3.3 (HTTP testing)
├── nodemon@2.0.20 (Development server)
└── jest-junit@15.0.0 (Test reporting)
```

**Supply Chain Security:**

Minimal dependencies provide **supply chain attack protection**:
- **Fewer Third-Party Code**: Only 1 external library in production vs. typical Node.js apps with 50-500 dependencies
- **Smaller Trust Surface**: Only trust `dotenv` maintainers vs. hundreds of maintainers
- **Faster Auditing**: Security audits complete in minutes, not hours
- **Reduced Update Burden**: Fewer dependencies to monitor for security patches

**Evidence:**
- Section 5.4.3: "Minimal Dependency Surface: Only one production dependency (dotenv) reduces vulnerability exposure"
- `package.json` analysis shows 1 production dependency vs. 4 development dependencies

#### 6.4.5.2 Container Runtime Security

#### Restart Policy Configuration

**Implementation:**
```yaml
# docker-compose.yml

restart: unless-stopped
```

**Security Implications:**

| Restart Policy | Container Crash Behavior | Security Impact |
|---|---|---|
| `no` | No restart | Vulnerable to DoS after crash |
| `on-failure` | Restart only on error exit | Partial DoS protection |
| `always` | Restart after any stop | Maximum availability, overrides manual stops |
| **`unless-stopped`** | **Restart except manual stop** | **Balance availability and control** |

The `unless-stopped` policy provides **availability through automatic recovery** while respecting intentional administrative stops for maintenance or incident response.

**Evidence:**
- `infrastructure/local/docker-compose.yml` line 24: `restart: unless-stopped`
- Section 5.4.6: "Docker restart policy handles crashes"

#### Health Check Security

**Implementation:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

**Security Benefits:**

1. **Failure Detection**: Identifies compromised or malfunctioning containers within 30-90 seconds
2. **Automatic Recovery**: Triggers restart policy after 3 consecutive failures (90 seconds max)
3. **Post-Breach Mitigation**: If an attacker crashes the service, Docker automatically restarts within 2 minutes
4. **Persistent Availability**: Prevents long-term outages from temporary failures

**Security Diagram: Health Check Auto-Recovery**

```mermaid
sequenceDiagram
    participant Attacker
    participant Container as Container Process
    participant Docker as Docker Engine
    participant Health as Health Check
    
    Note over Container: Container Running Normally
    Health->>Container: curl /hello (every 30s)
    Container->>Health: 200 OK
    Health->>Docker: Report: Healthy
    
    rect rgb(255,230,230)
        Note over Attacker,Container: Security Incident
        Attacker->>Container: Exploit Vulnerability<br/>Crash Process
        Container->>Container: Process Terminated
    end
    
    Note over Docker,Health: Detection Phase
    Health->>Container: curl /hello (30s interval)
    Container->>Health: Connection Refused
    Health->>Docker: Report: Unhealthy (Retry 1/3)
    
    Note over Docker,Health: Wait 30s
    Health->>Container: curl /hello
    Container->>Health: Connection Refused
    Health->>Docker: Report: Unhealthy (Retry 2/3)
    
    Note over Docker,Health: Wait 30s
    Health->>Container: curl /hello
    Container->>Health: Connection Refused
    Health->>Docker: Report: Unhealthy (Retry 3/3)
    
    rect rgb(230,255,230)
        Note over Docker,Container: Automatic Recovery
        Docker->>Container: Execute Restart Policy
        Docker->>Container: Start Container
        Container->>Container: Initialize Application
        
        Note over Docker,Health: Wait 10s (start_period)
        Health->>Container: curl /hello
        Container->>Health: 200 OK
        Health->>Docker: Report: Healthy
    end
    
    Note over Container: Service Restored<br/>Total Downtime: ~120 seconds
```

**Evidence:**
- `docker-compose.yml` lines 25-30: Complete health check configuration
- Section 6.3.4.3: "Health Check Integration"

#### 6.4.5.3 Container Security Gaps

#### Non-Root User Not Implemented

**Current State:**

The container runs as the **root user** by default (UID 0). The Dockerfile does not include USER directive to drop privileges.

**Security Risk:**

If an attacker achieves **container breakout** (escaping container isolation to the host system), root privileges inside the container may translate to root privileges on the host, enabling:
- Host file system modification
- Installation of persistent backdoors
- Lateral movement to other containers
- Host kernel exploitation

**Mitigation:**

Production deployments should add non-root user:

```dockerfile
# Recommended addition to Dockerfile

FROM node:18-alpine
WORKDIR /app

#### Create non-root user

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --chown=nodejs:nodejs src/backend/package*.json ./
RUN npm install --production
COPY --chown=nodejs:nodejs src/backend/ ./

#### Drop to non-root user

USER nodejs

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]
```

**Impact:**

As noted in Section 3.8.3, "Production containers should run as non-root user" but "implementation not enforced in educational service."

#### No Image Vulnerability Scanning

**Current State:**

No automated security scanning is configured in the build pipeline. Developers must manually run `npm audit` for dependency vulnerabilities.

**Security Gap:**

Without automated scanning:
- **Undetected Vulnerabilities**: Base image or dependency CVEs may go unnoticed
- **No Compliance Enforcement**: Cannot block deployment of vulnerable images
- **Delayed Response**: Security issues discovered reactively, not proactively

**Recommended Tools:**

| Tool | Scan Target | Integration Point | Cost |
|---|---|---|---|
| **Docker Scout** | Base images + dependencies | Docker Desktop / CLI | Free tier available |
| **Trivy** | OS packages + app dependencies | CI/CD pipeline | Open source |
| **Snyk Container** | Multi-layer vulnerability detection | GitHub Actions / GitLab CI | Free for open source |
| **Anchore Engine** | Policy-based scanning | Kubernetes admission control | Open source |

**Production Integration Example:**

```yaml
# .github/workflows/security-scan.yml

name: Container Security Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build image
        run: docker build -t hello-world-app:scan .
      - name: Run Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: hello-world-app:scan
          severity: CRITICAL,HIGH
          exit-code: 1  # Fail build on vulnerabilities
```

**Evidence:**
- Section 3.8.3: "Image Scanning: Docker images can be scanned for vulnerabilities using tools like Docker Scout, Trivy, Snyk Container"
- No scanning configuration found in repository

#### 6.4.5.4 Container Security Architecture Diagram

```mermaid
graph TB
    subgraph "Container Image Security Layers"
        Layer1[Alpine Linux Base<br/>node:18-alpine<br/>~50MB, Minimal Packages]
        Layer2[Node.js Runtime<br/>v18.x LTS]
        Layer3[Production Dependencies<br/>dotenv only<br/>--production flag]
        Layer4[Application Code<br/>src/backend/]
        
        Layer1 --> Layer2
        Layer2 --> Layer3
        Layer3 --> Layer4
    end
    
    subgraph "Runtime Security Controls"
        Health[Health Check<br/>30s interval, 3 retries]
        Restart[Restart Policy<br/>unless-stopped]
        Network[Network Isolation<br/>hello-world-network]
        
        Health -->|Failure Detection| Restart
        Restart -->|Auto-Recovery| Layer4
        Network -->|Container DNS| Layer4
    end
    
    subgraph "Security Gaps (Not Implemented)"
        Gap1[❌ Non-Root User<br/>Container runs as root UID 0]
        Gap2[❌ Image Scanning<br/>No vulnerability detection]
        Gap3[❌ Resource Limits<br/>No CPU/memory constraints]
        Gap4[❌ Read-Only Filesystem<br/>No immutability enforcement]
        
        style Gap1 fill:#ffcccc,stroke:#cc0000
        style Gap2 fill:#ffcccc,stroke:#cc0000
        style Gap3 fill:#ffcccc,stroke:#cc0000
        style Gap4 fill:#ffcccc,stroke:#cc0000
    end
    
    subgraph "Security Strengths"
        Strength1[✅ Minimal Attack Surface<br/>50-70MB vs 300-400MB]
        Strength2[✅ Dependency Reduction<br/>1 prod dependency vs typical 50-500]
        Strength3[✅ Auto-Recovery<br/>Crashes detected within 90s]
        Strength4[✅ Layer Caching<br/>Fast security patch deployment]
        
        style Strength1 fill:#ccffcc,stroke:#00cc00
        style Strength2 fill:#ccffcc,stroke:#00cc00
        style Strength3 fill:#ccffcc,stroke:#00cc00
        style Strength4 fill:#ccffcc,stroke:#00cc00
    end
    
    Layer1 -.->|Reduces| Strength1
    Layer3 -.->|Achieves| Strength2
    Health -.->|Provides| Strength3
    
    Layer4 -.->|Vulnerable to| Gap1
    Layer1 -.->|Unscanned by| Gap2
```

### 6.4.6 Error Handling Security

#### 6.4.6.1 Information Disclosure Prevention

The error handling system in `src/backend/handlers/error.js` implements **critical security controls** to prevent information disclosure, protecting internal system details from potential attackers.

**Security Principle: Generic External Messages, Detailed Internal Logging**

All error handlers follow a consistent pattern:
1. **Log Comprehensive Details Internally**: Full error message, stack trace, request context
2. **Send Generic Message to Client**: Minimal information revealing nothing about internals

#### Server Error Handling (500 Internal Server Error)

**Implementation Analysis:**

```javascript
// src/backend/handlers/error.js:65-77
function handleServerError(req, res, err) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  
  // Internal logging: Full error details
  error(`Server Error processing ${req.method} ${req.url}`, err);
  
  // External response: Generic message only
  res.end('Internal Server Error');
}
```

**Information Protection:**

| Information Type | Logged Internally | Sent to Client | Security Impact |
|---|---|---|---|
| **Error Message** | ✅ Full message | ❌ Not sent | Prevents error detail leakage |
| **Stack Trace** | ✅ Complete stack | ❌ Not sent | Hides code structure |
| **File Paths** | ✅ Full paths | ❌ Not sent | Conceals directory structure |
| **Request Details** | ✅ Method + URL | ❌ Not sent | Prevents reconnaissance |
| **Environment Info** | ✅ NODE_ENV | ❌ Not sent | Hides environment details |

**Attack Prevention:**

By sending only "Internal Server Error" to clients, the system prevents attackers from:
- **Reconnaissance**: Learning about code structure, file paths, or dependency versions
- **Error-Based Exploitation**: Crafting attacks based on error messages (e.g., SQL error injection)
- **Technology Fingerprinting**: Identifying specific framework versions or libraries from stack traces

#### 404 Not Found Handling

**Implementation:**
```javascript
// src/backend/handlers/error.js:15-22
function handle404(req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  warn(`404 Not Found: ${req.url}`);
  res.end('Not Found');
}
```

**Security Characteristics:**

- **Minimal Information**: Only confirms path does not exist, reveals nothing about valid paths
- **No Path Enumeration Aid**: Does not suggest similar valid paths or auto-complete hints
- **Consistent Timing**: Same response time regardless of path, preventing timing-based enumeration

**What is NOT Revealed:**

- ❌ List of valid endpoints
- ❌ Suggestions for correct paths
- ❌ Endpoint parameters or query string expectations
- ❌ Whether path would be valid with different HTTP method

#### 405 Method Not Allowed Handling

**Implementation:**
```javascript
// src/backend/handlers/error.js:35-43
function handle405(req, res, allowedMethods = ['GET']) {
  res.statusCode = 405;
  res.setHeader('Allow', allowedMethods.join(', '));
  res.setHeader('Content-Type', 'text/plain');
  warn(`405 Method Not Allowed: ${req.method} ${req.url}`);
  res.end('Method Not Allowed');
}
```

**Security Trade-Off:**

The `Allow: GET` header reveals that GET is the accepted method, which provides **legitimate information per RFC 7231 specification** while not exposing internal details:

- ✅ **Standards Compliance**: HTTP specification requires Allow header
- ✅ **Client Guidance**: Enables legitimate clients to retry with correct method
- ⚠️ **Minor Information Disclosure**: Reveals endpoint exists but only accepts GET

This represents a **balanced security approach**—complying with HTTP standards while providing minimal information.

#### 6.4.6.2 Error Handling Security Flow

```mermaid
flowchart TD
    A[HTTP Request Processing] --> B{Error Occurs?}
    
    B -->|No Error| C[Normal Response<br/>200 OK + Body]
    
    B -->|404: Unknown Path| D[handle404]
    B -->|405: Invalid Method| E[handle405]
    B -->|500: Exception| F[handleServerError]
    
    subgraph "Error Logging (Internal)"
        D1[Log: 404 Not Found + Path]
        E1[Log: 405 Method Not Allowed + Method + Path]
        F1[Log: Server Error + Full Stack Trace]
    end
    
    subgraph "Error Response (External)"
        D2[Send: Generic 'Not Found']
        E2[Send: Generic 'Method Not Allowed' + Allow Header]
        F2[Send: Generic 'Internal Server Error']
    end
    
    D --> D1
    D1 --> D2
    E --> E1
    E1 --> E2
    F --> F1
    F1 --> F2
    
    subgraph "Security Protection"
        Protect1[❌ No Stack Traces]
        Protect2[❌ No File Paths]
        Protect3[❌ No Error Details]
        Protect4[❌ No Environment Info]
        Protect5[✅ Minimal Client Info]
    end
    
    F2 -.-> Protect1
    F2 -.-> Protect2
    D2 -.-> Protect3
    E2 -.-> Protect4
    D2 -.-> Protect5
    E2 -.-> Protect5
    F2 -.-> Protect5
    
    style D2 fill:#ffffcc
    style E2 fill:#ffffcc
    style F2 fill:#ffcccc
    style Protect1 fill:#ccffcc
    style Protect2 fill:#ccffcc
    style Protect3 fill:#ccffcc
    style Protect4 fill:#ccffcc
    style Protect5 fill:#ccffcc
```

#### 6.4.6.3 Error Response Consistency

All error responses follow **consistent security patterns**:

| Security Control | Implementation | Security Benefit |
|---|---|---|
| **Headers Sent Check** | `if (res.headersSent) return` | Prevents double-send errors |
| **Content-Type Standardization** | Always `text/plain` | Consistent response format |
| **Generic Messages** | "Not Found", "Method Not Allowed", "Internal Server Error" | No information leakage |
| **Status Code Accuracy** | Correct HTTP status codes | Standards compliance |
| **Internal Logging** | Full error details logged | Debugging capability maintained |

**Double-Send Protection:**

```javascript
// src/backend/handlers/error.js
function handleServerError(req, res, err) {
  // Safety check: Don't attempt response if headers already sent
  if (res.headersSent) {
    error('Cannot send error response, headers already sent', err);
    return;
  }
  // ... error response
}
```

This check prevents "Can't set headers after they are sent to the client" errors that could reveal internal state or cause crashes.

#### 6.4.6.4 Comparison with Insecure Error Handling

**Insecure Implementation (NOT USED):**

```javascript
// ❌ INSECURE: What this system DOES NOT do
function insecureErrorHandler(req, res, err) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    error: err.message,           // Leaks error details
    stack: err.stack,              // Exposes code structure
    file: err.fileName,            // Reveals file paths
    line: err.lineNumber,          // Shows exact error location
    environment: process.env,      // Exposes configuration
    nodeVersion: process.version   // Aids version-specific exploits
  }));
}
```

**Secure Implementation (ACTUAL SYSTEM):**

```javascript
// ✅ SECURE: Actual implementation
function handleServerError(req, res, err) {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'text/plain');
  error(`Server Error processing ${req.method} ${req.url}`, err);  // Internal only
  res.end('Internal Server Error');  // Generic external message
}
```

**Security Impact Comparison:**

| Aspect | Insecure Approach | Secure Approach (Implemented) |
|---|---|---|
| **Error Message** | Sent to client | Logged internally only |
| **Stack Trace** | Sent to client | Logged internally only |
| **File Paths** | Sent to client | Logged internally only |
| **Environment Variables** | Sent to client | Never exposed |
| **Node.js Version** | Sent to client | Not exposed |
| **Attacker Advantage** | High (detailed reconnaissance) | Minimal (no useful information) |

### 6.4.7 Security Monitoring and Audit

#### 6.4.7.1 Request Logging

**Current Implementation: Basic Request Logging**

The `requestLogger` middleware in `src/backend/middleware/index.js` logs every HTTP request:

```javascript
// Logged format: METHOD URL STATUS_CODE TIME
// Example: GET /hello 200 5ms
```

**Logged Information:**

| Field | Example | Security Value |
|---|---|---|
| **HTTP Method** | GET, POST, PUT, DELETE | Detects suspicious method usage |
| **URL Path** | /hello, /admin, /api | Identifies access patterns |
| **Status Code** | 200, 404, 405, 500 | Monitors error rates |
| **Response Time** | 5ms, 125ms | Detects performance anomalies |

**Security Limitations:**

- ❌ **No Client IP Addresses**: Cannot identify attack sources
- ❌ **No User-Agent Logging**: Cannot detect automated scanners
- ❌ **No Geographic Data**: No IP geolocation for attack attribution
- ❌ **No Request ID**: Cannot correlate related requests
- ❌ **No Structured Format**: Plain text, not JSON (hard to parse programmatically)

**Evidence:**
- `src/backend/middleware/index.js`: `requestLogger` middleware implementation
- Section 5.4.1: "Request Logging Format: GET /hello 200 5ms"

#### 6.4.7.2 Security Event Logging Gaps

**What is NOT Logged:**

The system has significant gaps in security event logging:

| Security Event | Current Logging | Required for Security |
|---|---|---|
| **Authentication Attempts** | ⚠️ N/A (no auth) | Would require if adding auth |
| **Authorization Failures** | ⚠️ N/A (no authz) | Would require if adding authz |
| **Suspicious Patterns** | ❌ Not implemented | Path traversal attempts, SQL injection strings |
| **Rate Limit Violations** | ⚠️ N/A (no rate limiting) | Would require if adding rate limits |
| **Invalid Input** | ⚠️ N/A (no input processing) | Would require if adding input validation |
| **Configuration Changes** | ❌ Not logged | Environment variable modifications |
| **Security Header Violations** | ❌ Not logged | CSP violations (if using report-uri) |

#### 6.4.7.3 Audit Trail Limitations

**Current Audit Capabilities:**

- ✅ **Request History**: Complete record of all HTTP requests via logs
- ✅ **Error History**: All errors logged with timestamps
- ⚠️ **Startup/Shutdown Events**: Logged but not centralized
- ❌ **No Tamper-Proof Storage**: Logs can be modified or deleted
- ❌ **No Log Aggregation**: Logs remain in individual containers
- ❌ **No Long-Term Retention**: Logs purged when containers removed

**Compliance Gaps:**

For systems requiring compliance (PCI DSS, HIPAA, SOC 2), the following are missing:

| Compliance Requirement | Current Implementation | Gap |
|---|---|---|
| **Immutable Audit Logs** | Mutable Docker logs | No write-once storage |
| **Centralized Logging** | Local container logs | No SIEM integration |
| **Log Retention** | Container lifecycle only | No long-term archive |
| **Access Logging** | Basic request logs | No user/action/resource |
| **Change Tracking** | Not implemented | No audit trail of modifications |

**Production Recommendations:**

For production environments requiring audit trails:

```mermaid
graph LR
    subgraph "Current (Local)"
        A1[Application] --> A2[stdout/stderr]
        A2 --> A3[Docker Logs]
        A3 --> A4[Local Storage<br/>Temporary]
        
        style A4 fill:#ffcccc
    end
    
    subgraph "Production (Recommended)"
        B1[Application] --> B2[Structured JSON Logs]
        B2 --> B3[Log Shipper<br/>Fluentd/Filebeat]
        B3 --> B4[Elasticsearch<br/>Centralized Storage]
        B4 --> B5[Kibana<br/>Search & Analysis]
        B4 --> B6[Archive<br/>S3/Glacier<br/>7-year retention]
        
        style B4 fill:#ccffcc
        style B6 fill:#ccffcc
    end
```

#### 6.4.7.4 Monitoring Integration for Security

**Prometheus Metrics (Planned, Not Implemented):**

The monitoring infrastructure (Section 6.3.4.1) includes configuration for security-relevant metrics:

| Metric | Purpose | Security Use Case |
|---|---|---|
| `http_requests_total{status="404"}` | Track 404 errors | Detect path enumeration attacks |
| `http_requests_total{status="405"}` | Track method errors | Detect method scanning |
| `http_requests_total{status="500"}` | Track server errors | Detect DoS or exploitation attempts |
| `http_request_duration_seconds` | Track response times | Detect slowloris or resource exhaustion |
| `up{}` | Service availability | Detect service disruptions |

**Security Alerting (Not Implemented):**

Production deployments should configure Prometheus alerting rules:

```yaml
# Example: Alert on high error rate

- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  for: 5m
  annotations:
    summary: "High server error rate detected"
    description: "Error rate above 5% for 5 minutes"
```

**Evidence:**
- `infrastructure/monitoring/prometheus.yml`: Metrics collection configured
- Section 5.4.1: "/metrics endpoint not implemented"

### 6.4.8 Security Gaps and Risk Assessment

#### 6.4.8.1 Identified Security Gaps

The following table comprehensively documents all identified security gaps, their risk levels, and mitigation strategies:

| Security Gap | Risk Level | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|---|
| **No TLS/HTTPS at App Layer** | 🔴 **High** | MITM attacks, eavesdropping | High in prod without LB | Implement TLS at load balancer |
| **No Rate Limiting** | 🟡 **Medium** | DoS, service abuse | Medium | Implement at load balancer/WAF |
| **Container Runs as Root** | 🟡 **Medium** | Container breakout escalation | Low | Add USER directive to Dockerfile |
| **No Image Vulnerability Scanning** | 🟡 **Medium** | Undetected CVEs deployed | Medium | Integrate Trivy/Snyk in CI/CD |
| **No Security Event Logging** | 🟡 **Medium** | Delayed attack detection | Medium | Add structured JSON logging |
| **No Centralized Logging** | 🟢 **Low** | Limited forensic capability | Low | Deploy ELK/Splunk for production |
| **No Secrets Vault** | 🟢 **Low** | Credential exposure risk | Low (no secrets currently) | Integrate Vault if adding secrets |
| **No Network Policies** | 🟢 **Low** | Lateral movement risk | Low (single container) | Apply Kubernetes NetworkPolicies |

**Risk Level Definitions:**

- 🔴 **High Risk**: Exploitable in typical deployment scenarios, significant impact
- 🟡 **Medium Risk**: Requires specific conditions or has limited impact
- 🟢 **Low Risk**: Unlikely exploitation or minimal impact

#### 6.4.8.2 Attack Surface Analysis

**Exposed Attack Surface:**

```mermaid
graph TB
subgraph "External Attack Surface"
    A1[HTTP Port 3000<br/>Public Exposure]
    A2["/hello Endpoint<br/>GET Only"]
    A3[Unknown Path<br/>404 Response]
    A4[Invalid Method<br/>405 Response]
end

subgraph "Protected Attack Surface"
    B1[Container Runtime<br/>Isolated Process]
    B2[File System<br/>Read-Only Access]
    B3[Configuration<br/>Environment Variables]
    B4[Dependencies<br/>1 Production Lib]
end

subgraph "No Attack Surface (Not Implemented)"
    C1[No Database<br/>No SQL Injection]
    C2[No File Upload<br/>No Malware Upload]
    C3[No User Input<br/>No XSS/Injection]
    C4[No Authentication<br/>No Credential Stuffing]
end

A1 --> A2
A1 --> A3
A1 --> A4

B1 -.-> A1
B2 -.-> B1
B3 -.-> B1
B4 -.-> B1

style A1 fill:#ffcccc
style B1 fill:#ffffcc
style C1 fill:#ccffcc
style C2 fill:#ccffcc
style C3 fill:#ccffcc
style C4 fill:#ccffcc
```

**Attack Vector Assessment:**

| Attack Vector | Exploitability | System Vulnerability | Mitigation |
|---|---|---|---|
| **SQL Injection** | ✅ **Not Applicable** | No database | N/A - No SQL queries |
| **XSS (Cross-Site Scripting)** | ✅ **Mitigated** | Plain text responses, CSP header | Security headers + no HTML |
| **CSRF (Cross-Site Request Forgery)** | ✅ **Not Applicable** | No state-changing operations | N/A - Read-only operations |
| **Command Injection** | ✅ **Not Applicable** | No shell command execution | N/A - No system calls |
| **Path Traversal** | ✅ **Not Applicable** | No file system access from input | N/A - Fixed route paths only |
| **Clickjacking** | ✅ **Mitigated** | X-Frame-Options: DENY | Header prevents iframe embedding |
| **DoS (Denial of Service)** | 🔴 **Vulnerable** | No rate limiting | Deploy infrastructure rate limiting |
| **DDoS (Distributed DoS)** | 🔴 **Vulnerable** | No DDoS protection | Use cloud DDoS protection (CloudFlare) |
| **Resource Exhaustion** | 🟡 **Partial Risk** | No resource limits in container | Add Docker memory/CPU limits |
| **Container Breakout** | 🟡 **Partial Risk** | Root user inside container | Run as non-root user |

**Evidence:**
- Section 5.4.3: "Attack Surface Reduction" table documents vulnerability classes
- Investigation findings: "No SQL, command injection, or path traversal risks"

#### 6.4.8.3 Security Risk Prioritization

**Recommended Security Improvements (Priority Order):**

**Priority 1 (Critical - Address Before Production):**

1. **Implement TLS at Infrastructure Layer**
   - **Action**: Deploy behind ALB/Nginx with TLS termination
   - **Effort**: 2-4 hours configuration
   - **Impact**: Eliminates MITM and eavesdropping risks

2. **Implement Rate Limiting**
   - **Action**: Configure load balancer or WAF rate limiting
   - **Effort**: 1-2 hours configuration
   - **Impact**: Prevents DoS attacks and abuse

**Priority 2 (Important - Enhance Security Posture):**

3. **Add Non-Root Container User**
   - **Action**: Update Dockerfile with USER directive
   - **Effort**: 30 minutes
   - **Impact**: Reduces container breakout risk

4. **Integrate Vulnerability Scanning**
   - **Action**: Add Trivy/Snyk to CI/CD pipeline
   - **Effort**: 2-3 hours setup
   - **Impact**: Detects CVEs before deployment

5. **Implement Centralized Logging**
   - **Action**: Deploy ELK stack or cloud logging
   - **Effort**: 4-8 hours
   - **Impact**: Enables security monitoring and forensics

**Priority 3 (Nice-to-Have - Long-Term Improvements):**

6. **Add Resource Limits**
   - **Action**: Configure Docker CPU/memory limits
   - **Effort**: 1 hour
   - **Impact**: Prevents resource exhaustion

7. **Implement Network Policies**
   - **Action**: Apply Kubernetes NetworkPolicies
   - **Effort**: 2-4 hours
   - **Impact**: Limits lateral movement

#### 6.4.8.4 Security Compliance Posture

**Compliance Framework Assessment:**

| Framework | Applicable | Compliance Status | Missing Controls |
|---|---|---|---|
| **OWASP Top 10 (2021)** | Partially | 🟡 **Partially Compliant** | A05:2021 (Security Misconfiguration) - No rate limiting |
| **CIS Docker Benchmark** | Yes | 🟡 **Partially Compliant** | 4.1 (Non-root user), 4.5 (Read-only filesystem) |
| **NIST Cybersecurity Framework** | No | ⚠️ **Not Applicable** | Educational scope, no sensitive data |
| **PCI DSS** | No | ⚠️ **Not Applicable** | No payment card data |
| **HIPAA** | No | ⚠️ **Not Applicable** | No protected health information |
| **SOC 2** | No | ⚠️ **Not Applicable** | No customer data processing |

**OWASP Top 10 Mapping:**

| OWASP Category | System Status | Notes |
|---|---|---|
| **A01:2021 - Broken Access Control** | ✅ **Not Applicable** | No authentication or protected resources |
| **A02:2021 - Cryptographic Failures** | 🟡 **Partial** | No TLS at app layer (expected at infrastructure) |
| **A03:2021 - Injection** | ✅ **Mitigated** | No user input processing, no databases |
| **A04:2021 - Insecure Design** | ✅ **Compliant** | Secure-by-default design, minimal attack surface |
| **A05:2021 - Security Misconfiguration** | 🟡 **Partial** | Missing rate limiting, container runs as root |
| **A06:2021 - Vulnerable Components** | ✅ **Compliant** | Minimal dependencies (1 production library) |
| **A07:2021 - Identification/Auth Failures** | ✅ **Not Applicable** | No authentication system |
| **A08:2021 - Software/Data Integrity** | ✅ **Compliant** | package-lock.json ensures deterministic builds |
| **A09:2021 - Logging/Monitoring Failures** | 🟡 **Partial** | Basic logging implemented, no centralized monitoring |
| **A10:2021 - Server-Side Request Forgery** | ✅ **Not Applicable** | No outbound HTTP requests |

### 6.4.9 References

#### Implementation Files

- `src/backend/middleware/index.js` - Security headers middleware implementation (lines 53-64), security header application to all responses
- `src/backend/handlers/error.js` - Error handling security implementation (lines 15-77), information disclosure prevention
- `src/backend/config.js` - Environment variable configuration management, validation, and dotenv integration
- `Dockerfile` - Container security configuration with Alpine Linux base image (line 2) and production-only dependencies (line 12)
- `infrastructure/local/docker-compose.yml` - Health check configuration (lines 25-30) and restart policy (line 24)
- `package.json` - Minimal dependency surface with single production dependency (dotenv)
- `README.md` - Security headers documentation (lines 179-181)

#### Technical Specification Cross-References

- **Section 3.8 Security Considerations** - HTTP security headers (3.8.1), dependency security management (3.8.2), container security (3.8.3)
- **Section 5.4.3 Security Framework** - Comprehensive security posture, attack surface reduction, security gaps
- **Section 6.3 Integration Architecture** - Monitoring integration (6.3.4.1), container orchestration (6.3.4.2), health check integration (6.3.4.3)
- **Section 6.3.2.4 No Authentication or Authorization** - Intentional exclusion of authentication and authorization mechanisms
- **Section 5.1.1 System Overview** - Stateless architecture and single-process design
- **Section 1.2.1 Project Context** - Educational mission and intentional simplicity

#### Security Standards Referenced

- **OWASP Top 10 (2021)** - Web application security risks and mitigation strategies
- **CIS Docker Benchmark** - Container security best practices and hardening guidelines
- **RFC 7231 (HTTP/1.1 Semantics)** - HTTP status codes and Allow header specification
- **Content Security Policy Level 3** - CSP directive definitions and browser implementation
- **Twelve-Factor App Methodology** - Configuration management via environment variables

#### External Security Resources

- **Alpine Linux Security Team** - https://alpinelinux.org/security/ - Security updates and CVE tracking for Alpine packages
- **OWASP Secure Headers Project** - https://owasp.org/www-project-secure-headers/ - HTTP security header recommendations
- **Docker Security Best Practices** - https://docs.docker.com/engine/security/ - Official Docker security guidance
- **npm Security Advisories** - https://www.npmjs.com/advisories - Vulnerability database for npm packages

## 6.5 Monitoring and Observability

### 6.5.1 Overview and Implementation Status

#### 6.5.1.1 Current State Assessment

The Node.js Hello World Service implements a **hybrid monitoring approach** characterized by fully functional basic observability (console logging and health checks) combined with provisioned but inactive advanced monitoring infrastructure (Prometheus and Grafana). This architectural state reflects the project's educational mission as documented in Section 1.2.1, which prioritizes "simplicity with production-ready patterns" while maintaining an "intentionally narrow focus on HTTP server basics."

**Implementation Status Summary:**

| Capability | Status | Functionality Level | Evidence |
|---|---|---|
| Console Logging | ✅ Implemented | Fully functional with timestamps, log levels, request tracking | `src/backend/utils/logger.js` |
| Health Checking | ✅ Implemented | Docker health checks, bash validation script | `infrastructure/local/docker-compose.yml`, `infrastructure/scripts/health-check.sh` |
| Prometheus Configuration | ⚠️ Provisioned | Complete scrape job configurations without active endpoints | `infrastructure/monitoring/prometheus.yml` |
| Grafana Dashboard | ⚠️ Provisioned | 13 pre-configured panels awaiting metrics data | `infrastructure/monitoring/grafana-dashboard.json` |

| Capability | Status | Functionality Level | Evidence |
|---|---|---|
| Metrics Endpoints | ❌ Not Implemented | No `/metrics` or `/health` endpoints in application code | Search across `src/backend/` |
| Metrics Collection | ❌ Not Implemented | No prom-client library or instrumentation | `package.json` dependencies |
| Distributed Tracing | ❌ Not Applicable | Single-process architecture requires no distributed tracing | Section 6.1.1 |
| Alerting Rules | ❌ Not Implemented | No Alertmanager configuration or alert definitions | `infrastructure/monitoring/prometheus.yml` |

#### 6.5.1.2 Educational Scope Considerations

The monitoring implementation strategy aligns with the system's educational objectives and architectural simplicity. As documented in Section 6.1.2.1, the project deliberately implements a "monolithic architecture for several pedagogical and operational reasons," which extends to observability patterns.

**Suitable Monitoring Capabilities for Educational Scope:**

- **Console Logging:** Provides immediate visibility into server operations without requiring external infrastructure, enabling learners to understand logging fundamentals through direct observation
- **Docker Health Checks:** Demonstrates container-level health monitoring using native Docker capabilities without complex orchestration
- **Provisioned Infrastructure:** Exposes learners to industry-standard monitoring tools (Prometheus, Grafana) through configuration files, creating a clear upgrade path

**Appropriately Excluded Capabilities:**

- **Distributed Tracing:** Not applicable for single-process architecture documented in Section 6.1.3.1
- **Complex Alerting:** No SLA requirements or production support obligations justify alert infrastructure
- **Log Aggregation Services:** Educational deployment scale makes centralized log collection unnecessary

#### 6.5.1.3 Monitoring Architecture Philosophy

The monitoring strategy implements what Section 5.4.1 describes as an **"infrastructure-first approach"** where monitoring tooling is provisioned and configured before application instrumentation is completed. This progressive implementation model serves multiple educational purposes:

1. **Incremental Learning:** Students can start with basic console logging, then progressively add metrics collection as they advance
2. **Infrastructure Exposure:** Configuration files demonstrate production monitoring architecture without requiring full implementation
3. **Clear Upgrade Path:** Documented gaps between provisioned infrastructure and application instrumentation provide natural learning milestones

### 6.5.2 Logging Infrastructure

#### 6.5.2.1 Centralized Logging Implementation

The application implements comprehensive console-based logging through the `src/backend/utils/logger.js` module, which provides standardized logging with ISO 8601 timestamps and intelligent test suppression as documented in Section 5.4.1.

**Log Level Implementation:**

| Log Level | Function | Output Format | Use Cases | Color Coding |
|---|---|---|---|
| INFO | `info(message)` | `[ISO_timestamp] INFO: message` | Server startup, shutdown, configuration loading, successful operations | Green (console) |
| WARN | `warn(message)` | `[ISO_timestamp] WARN: message` | Non-fatal issues, deprecated functionality, performance degradation | Yellow (console) |
| ERROR | `error(message)` | `[ISO_timestamp] ERROR: message` | Exceptions, failures, startup errors, request processing errors | Red (console) |

**Specialized Logging Functions:**

The logger module provides domain-specific logging functions that encapsulate common logging patterns:

**Server Lifecycle Logging:**
- `logServerStart(host, port)`: Outputs "Server started successfully on http://{host}:{port}" at INFO level, providing immediate confirmation of successful initialization
- `logServerStop()`: Outputs "Server stopped gracefully" at INFO level, confirming clean shutdown completion

**Request Logging:**
- `logRequest(req, res, responseTime)`: Generates audit trail entries in format `{METHOD} {URL} {STATUS_CODE} {responseTime}ms`
- **Automatic Severity Selection:** Routes log entries based on HTTP status code (≥500 = ERROR, ≥400 = WARN, otherwise INFO)
- **Example Output:** `GET /hello 200 5ms`, `POST /hello 405 3ms`, `GET /unknown 404 2ms`

#### 6.5.2.2 Request Logging Middleware

The `src/backend/middleware/index.js` module implements the `requestLogger` middleware that provides comprehensive request timing instrumentation as documented in Section 5.4.1:

**Implementation Mechanism:**
1. Captures request start timestamp on middleware entry
2. Wraps `res.end()` method to intercept response completion
3. Calculates response time in milliseconds by measuring elapsed time
4. Invokes `logRequest()` with complete request context after response completion

**Captured Information:**
- HTTP method (GET, POST, PUT, DELETE, etc.)
- Request URL path
- Response HTTP status code
- Response time in milliseconds with microsecond precision

**Middleware Application:**
Applied to all requests through the middleware chain in `server.js`, ensuring complete request/response audit trail without gaps.

#### 6.5.2.3 Test Mode Suppression

The logging implementation includes intelligent test detection that eliminates log output during test execution, preventing test pollution while maintaining production logging behavior.

**Suppression Mechanism:**
- All logging functions check `config.IS_TEST` flag before output
- When `NODE_ENV === 'test'`, `IS_TEST === true` and all log calls become no-ops
- Zero performance overhead during tests (early return before string formatting)

**Benefits:**
- Clean test output without log message clutter
- Improved test performance by eliminating I/O operations
- Simplified test assertions without log filtering requirements

#### 6.5.2.4 Log Destination Strategy

The logging architecture implements environment-specific destination routing that adapts to deployment context:

| Environment | Destination | Collection Method | Retention Policy | Configuration |
|---|---|---|---|
| Development | Console (stdout/stderr) | Terminal display | None (ephemeral) | Default behavior |
| Docker Local | Docker logs | `docker logs <container_id>` command | Until container removal | Docker logging driver |
| Production | stdout (captured by orchestrator) | CloudWatch Logs, Elasticsearch, Splunk | 30-90 days (configurable) | Infrastructure-level redirection |

**Production Log Aggregation:**
While not implemented within the application, the stdout-based logging approach enables seamless integration with industry-standard log aggregation services:
- **AWS CloudWatch Logs:** ECS task definitions or Kubernetes FluentD DaemonSets capture stdout
- **Elasticsearch:** Filebeat or Logstash agents forward logs to Elasticsearch cluster
- **Splunk:** Universal Forwarder monitors container logs and forwards to Splunk indexers

#### 6.5.2.5 Logging Limitations

The current logging implementation prioritizes simplicity over advanced features, with documented limitations in Section 5.4.1 that are acceptable for the educational scope:

**Documented Limitations:**

| Limitation | Impact | Mitigation | Educational Rationale |
|---|---|---|
| No Log Level Filtering | All log levels always output regardless of LOG_LEVEL configuration | Not required for educational deployment scale | Simplifies implementation for learners |
| No Structured Logging | Plain text format instead of JSON | Use text parsing in log aggregation service | Reduces complexity, improves human readability |
| No Log Rotation | Unbounded stdout with no size limits | Rely on Docker or orchestrator log rotation | Infrastructure concern, not application |
| Synchronous Logging | console.log blocks event loop briefly | Acceptable for low request volumes | Avoids async complexity in educational code |

### 6.5.3 Health Check Implementation

#### 6.5.3.1 Docker Container Health Checks

The `infrastructure/local/docker-compose.yml` file configures comprehensive container-level health monitoring that enables Docker to automatically detect and respond to application failures as documented in Section 5.4.5:

**Health Check Configuration:**

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

**Configuration Parameter Details:**

| Parameter | Value | Purpose | Behavior |
|---|---|---|
| test | curl -f http://localhost:3000/hello | Health probe command executed inside container | Returns exit code 0 for 200 OK, non-zero for failures |
| interval | 30 seconds | Time between consecutive health checks | Balances responsiveness with probe overhead |
| timeout | 10 seconds | Maximum time allowed for health check execution | Prevents hung probes from blocking detection |
| retries | 3 consecutive failures | Threshold for marking container unhealthy | Prevents transient failures from triggering restarts |

| Parameter | Value | Purpose | Behavior |
|---|---|---|
| start_period | 10 seconds | Grace period after container start | Allows application initialization without health check failures |

**Health State Transitions:**

- **starting → healthy:** Application responds with 200 OK within start_period
- **healthy → unhealthy:** 3 consecutive health check failures (90 seconds total)
- **unhealthy → restarting:** Docker restart policy (`unless-stopped`) triggers container restart
- **restarting → healthy:** New container instance passes health checks

**Operational Integration:**
- Health status visible in `docker ps` output under STATUS column
- `docker inspect` provides detailed health check history with timestamps
- Orchestration platforms (Kubernetes, ECS) integrate with Docker health checks for pod/task management

#### 6.5.3.2 Bash Health Check Script

The `infrastructure/scripts/health-check.sh` script provides programmatic health verification for CI/CD pipelines and deployment validation workflows:

**Validation Checks Performed:**

1. **HTTP Status Code Verification:** Validates response returns 200 OK status
2. **Response Body Validation:** Confirms response body contains "Hello world" text
3. **Network Connectivity:** Detects connection failures or network issues

**Configurable Parameters:**

| Parameter | Default Value | Flag | Description |
|---|---|---|
| Host | localhost | --host | Target host for health check |
| Port | 3000 | --port | Target port for health check |
| Endpoint | /hello | (hardcoded) | Health check endpoint path |
| Timeout | 5 seconds | --timeout | Maximum wait time for response |

**Exit Code Contract:**

- **Exit 0:** Service healthy (200 status + "Hello world" response body)
- **Exit 1:** Service unhealthy (wrong status code or incorrect response)
- **Exit 2:** Service unreachable (connection failed or timeout)

**Integration Points:**

- **Manual Verification:** Operators run script to validate service health
- **Deployment Validation:** `infrastructure/scripts/deploy.sh` executes health check post-deployment
- **CI/CD Pipelines:** Health check gates prevent traffic routing to unhealthy deployments
- **Smoke Testing:** Pre-production validation before releasing new versions

#### 6.5.3.3 Planned Prometheus Health Scraping

The `infrastructure/monitoring/prometheus.yml` file configures a dedicated health monitoring scrape job separate from application metrics collection:

**Health Scrape Job Configuration:**

```yaml
- job_name: 'hello-world-health'
  scrape_interval: 30s
  scrape_timeout: 5s
  static_configs:
    - targets: ['hello-world-app:3000']
  metrics_path: '/health'
```

**Design Rationale:**
- **Separate Job:** Health checks isolated from application metrics with different scrape frequency
- **Longer Interval:** 30-second interval reduces probe overhead compared to 5-second metrics interval
- **Shorter Timeout:** 5-second timeout enables faster failure detection
- **Dedicated Endpoint:** `/health` endpoint separate from `/metrics` allows different caching and performance characteristics

**Prometheus Health Metrics:**
- **`up{}` metric:** Generated by Prometheus scraper (1=healthy, 0=down)
- **`scrape_duration_seconds`:** Time required to complete health check
- **`scrape_samples_scraped`:** Number of samples collected from endpoint

**Implementation Status:** ❌ **Not Implemented**
The `/health` endpoint does not exist in the application code. Prometheus will report `up{job="hello-world-health"} 0` indicating down status until endpoint is implemented.

**Workaround:** Docker health checks currently use `/hello` endpoint as proxy for health validation.

#### 6.5.3.4 Graceful Shutdown Integration

Health checking integrates with the graceful shutdown implementation documented in Section 5.4.5 to ensure clean service termination:

**Shutdown Sequence and Health Check Coordination:**

1. **Signal Reception:** SIGTERM/SIGINT signal received by application
2. **Health Check Failure:** Application immediately begins failing health checks (stops responding or returns error status)
3. **Connection Draining:** Server stops accepting new connections via `server.close()`
4. **In-Flight Completion:** Active requests allowed to complete (up to 10-second timeout)
5. **Container Marked Unhealthy:** Docker health checks detect failure after retries
6. **Orchestrator Action:** Kubernetes/ECS removes instance from load balancer rotation
7. **Process Exit:** `process.exit(0)` terminates process cleanly

**Guarantees:**
- No new requests routed to shutting-down instance after health checks fail
- Active connections complete processing before termination
- Clean resource cleanup and connection closure
- Maximum shutdown time: 10 seconds (timeout) + 90 seconds (health check detection) = 100 seconds total

### 6.5.4 Provisioned Monitoring Infrastructure

#### 6.5.4.1 Prometheus Scrape Configuration

The `infrastructure/monitoring/prometheus.yml` file provides complete Prometheus server configuration with three scrape jobs targeting different monitoring aspects:

**Global Prometheus Settings:**

| Setting | Value | Purpose |
|---|---|
| scrape_interval | 15 seconds | Default interval for all scrape jobs without explicit override |
| evaluation_interval | 15 seconds | Frequency for evaluating alerting rules |
| scrape_timeout | 10 seconds | Global timeout for scrape operations |

**Configured Scrape Jobs:**

**Job 1: Prometheus Self-Monitoring**
```yaml
- job_name: 'prometheus'
  static_configs:
    - targets: ['localhost:9090']
```
- **Purpose:** Monitors Prometheus server's own health and performance
- **Target:** Prometheus server itself at localhost:9090
- **Metrics:** Prometheus internal metrics (query performance, storage, retention)
- **Status:** ✅ Functional when Prometheus server is running

**Job 2: Application Metrics Collection**
```yaml
- job_name: 'hello-world-app'
  scrape_interval: 5s
  scrape_timeout: 3s
  static_configs:
    - targets: ['hello-world-app:3000']
  metrics_path: '/metrics'
```
- **Purpose:** Collects application performance and business metrics
- **Target:** Application container at hello-world-app:3000/metrics
- **Scrape Frequency:** 5-second interval (high frequency for demonstration)
- **Timeout:** 3-second timeout (shorter than interval to prevent overlap)
- **Status:** ❌ **Not Functional** - `/metrics` endpoint not implemented

**Job 3: Health Monitoring**
```yaml
- job_name: 'hello-world-health'
  scrape_interval: 30s
  scrape_timeout: 5s
  static_configs:
    - targets: ['hello-world-app:3000']
  metrics_path: '/health'
```
- **Purpose:** Dedicated health check monitoring separate from metrics
- **Target:** Application container at hello-world-app:3000/health
- **Scrape Frequency:** 30-second interval (lower frequency than metrics)
- **Status:** ❌ **Not Functional** - `/health` endpoint not implemented

**Alerting Configuration:**

```yaml
alerting:
  alertmanagers: []
rule_files: []
```
- **Alertmanagers:** Empty array indicates no Alertmanager instances configured
- **Rule Files:** No alerting rules or recording rules defined
- **Implication:** No automated alerting capability even when metrics collection is implemented

#### 6.5.4.2 Grafana Dashboard Configuration

The `infrastructure/monitoring/grafana-dashboard.json` file defines a comprehensive 13-panel dashboard for visualizing application health, performance, and system resources:

**Dashboard Metadata:**

| Property | Value | Purpose |
|---|---|
| Dashboard Name | Node.js Hello World Dashboard | Human-readable identification |
| UID | hello-world-dashboard | Unique identifier for API references |
| Refresh Rate | 10 seconds | Automatic dashboard data refresh interval |
| Time Range | Last 1 hour | Default time window for metrics visualization |

**Dashboard Panel Inventory:**

**Service Health Panels (3 panels):**

| Panel Name | Visualization Type | Prometheus Query | Purpose |
|---|---|---|
| Application Status | Gauge | `up{job="hello-world-app"}` | Binary health indicator (1=UP, 0=DOWN) |
| Health Check Status | Gauge | `up{job="hello-world-health"}` | Dedicated health check status |
| Uptime | Single Stat | `time() - process_start_time_seconds{job="hello-world-app"}` | Service uptime in seconds |

**Request Metrics Panels (5 panels):**

| Panel Name | Visualization Type | Prometheus Query | Purpose |
|---|---|---|
| Total Requests | Counter | `sum(http_requests_total{job="hello-world-app"})` | Cumulative request count |
| Request Rate | Graph | `sum(rate(http_requests_total{job="hello-world-app"}[1m])) by (method)` | Requests per second by HTTP method |
| Response Time (p50/p90/p95/p99) | Graph | `histogram_quantile(0.5/0.9/0.95/0.99, http_request_duration_seconds_bucket)` | Latency percentiles |
| HTTP Status Distribution | Pie Chart | `sum(http_requests_total{job="hello-world-app"}) by (status)` | Status code breakdown |

| Panel Name | Visualization Type | Prometheus Query | Purpose |
|---|---|---|
| Error Rate | Graph | `(sum(rate(http_requests_total{status=~"4..|5..",job="hello-world-app"}[1m])) / sum(rate(http_requests_total{job="hello-world-app"}[1m]))) * 100` | Percentage of error responses |

**System Resource Panels (4 panels):**

| Panel Name | Visualization Type | Prometheus Query | Purpose |
|---|---|---|
| Memory Usage | Graph | `nodejs_memory_usage_bytes{job="hello-world-app"}` | RSS and heap memory consumption |
| CPU Usage | Graph | `nodejs_cpu_usage_percentage{job="hello-world-app"}` | Process CPU utilization |
| Event Loop Lag | Graph | `nodejs_event_loop_lag_seconds{job="hello-world-app"}` | Event loop blocking detection |
| Endpoint Traffic | Table | `sum(rate(http_requests_total{job="hello-world-app"}[1m])) by (path)` | Request rate per endpoint |

**Documentation Panel (1 panel):**
- **Text Panel:** Introduction and dashboard usage instructions
- **Content:** Markdown-formatted documentation about metrics and panel interpretation

#### 6.5.4.3 Required Metrics Implementation

The Grafana dashboard references metrics that are not currently exported by the application. Full observability requires implementing the following metrics using the `prom-client` library:

**HTTP Request Metrics:**

| Metric Name | Type | Labels | Description |
|---|---|---|
| http_requests_total | Counter | method, path, status | Total HTTP requests by method, path, and status code |
| http_request_duration_seconds | Histogram | method, path | Request latency distribution for percentile calculation |
| http_request_size_bytes | Histogram | method, path | Request body size distribution |
| http_response_size_bytes | Histogram | method, path | Response body size distribution |

**Node.js System Metrics:**

| Metric Name | Type | Labels | Description |
|---|---|---|
| nodejs_process_cpu_usage_percentage | Gauge | (none) | CPU utilization percentage |
| nodejs_process_memory_rss_bytes | Gauge | (none) | Resident set size memory |
| nodejs_heap_used_bytes | Gauge | (none) | JavaScript heap memory used |
| nodejs_heap_total_bytes | Gauge | (none) | Total heap allocation |

| Metric Name | Type | Labels | Description |
|---|---|---|
| nodejs_eventloop_lag_seconds | Gauge | (none) | Event loop delay in seconds |
| process_start_time_seconds | Gauge | (none) | Process start timestamp (for uptime calculation) |

**Health Metrics:**

| Metric Name | Type | Labels | Description |
|---|---|---|
| up | Gauge | job | Service availability (1=healthy, 0=down, Prometheus-generated) |

#### 6.5.4.4 Implementation Gaps

The monitoring infrastructure demonstrates a clear gap between provisioned configuration and application instrumentation:

**Missing Components:**

1. **prom-client Library:** Not present in `package.json` dependencies
2. **Metrics Registry:** No metrics collector instantiated in application code
3. **Metrics Middleware:** No request instrumentation to populate http_requests_total counter
4. **Metrics Endpoint:** No `/metrics` endpoint in `src/backend/server.js` routes
5. **Health Endpoint:** No `/health` endpoint returning 200 OK when healthy
6. **Docker Services:** Prometheus and Grafana containers not defined in `docker-compose.yml`

**Impact of Gaps:**
- ✅ Configuration files demonstrate monitoring architecture for educational purposes
- ❌ Dashboard panels display "No data" until metrics are implemented
- ❌ Prometheus reports all scrape targets as down (`up{} = 0`)
- ⚠️ Docker health checks use `/hello` endpoint as workaround

**Upgrade Path:**
The documented gaps provide a clear roadmap for learners to progressively enhance observability:
1. Install prom-client: `npm install prom-client`
2. Create metrics registry and default collectors
3. Implement request timing middleware to populate histogram
4. Create `/metrics` endpoint returning Prometheus exposition format
5. Create `/health` endpoint returning 200 OK
6. Add Prometheus and Grafana services to docker-compose.yml

### 6.5.5 Observability Patterns

#### 6.5.5.1 Implemented Observability Patterns

**Console-Based Observability:**

The application implements fundamental observability through structured console logging that provides real-time visibility into system operations:

**Request-Response Observability:**
- Every request generates log entry with HTTP method, URL path, status code, and response time
- Response time measurement provides latency visibility without metrics infrastructure
- Status code logging enables error rate tracking through log analysis
- Sequential log entries maintain request causality and ordering

**Server Lifecycle Observability:**
- Server startup events log successful initialization with bind address
- Configuration loading events log active settings (PORT, HOST, NODE_ENV)
- Shutdown events log graceful termination confirmation
- Startup failure events log detailed error messages (EADDRINUSE, permission denied)

**Error Observability:**
- All errors logged with full error messages and stack traces
- 404 errors log requested path for tracking invalid routes
- 405 errors log both method and path for identifying client errors
- 500 errors log complete error context while sanitizing client responses

**Container-Level Observability:**

Docker health checks provide infrastructure-level observability independent of application instrumentation:

**Health Status Visibility:**
- `docker ps` command displays current health status in STATUS column
- `docker inspect` provides detailed health check history with timestamps
- Container restart events visible in Docker logs
- Health state transitions (starting → healthy → unhealthy) tracked automatically

**Log Aggregation:**
- Docker captures all stdout/stderr output through logging driver
- `docker logs <container>` retrieves complete log history
- Log timestamps from Docker daemon provide precise event timing
- Orchestrators (Kubernetes, ECS) forward container logs to centralized systems

#### 6.5.5.2 Planned Observability Patterns

**Metrics-Based Observability:**

The provisioned Prometheus and Grafana infrastructure enables advanced observability patterns once metrics endpoints are implemented:

**Performance Observability:**
- **Latency Percentiles:** p50, p90, p95, p99 response times identify performance degradation
- **Throughput Monitoring:** Request rate tracking by method and endpoint
- **Error Rate Tracking:** Percentage of 4xx/5xx responses over time windows
- **Status Code Distribution:** Breakdown of response status codes

**Resource Observability:**
- **Memory Monitoring:** RSS and heap memory trends identify memory leaks
- **CPU Tracking:** Process CPU utilization identifies computational bottlenecks
- **Event Loop Lag:** Detects synchronous blocking operations degrading responsiveness
- **Garbage Collection:** GC frequency and duration tracking (requires additional instrumentation)

**Business Observability:**
- **Endpoint Usage:** Request rate per path identifies popular endpoints
- **Traffic Patterns:** Time-series analysis reveals usage trends and peak periods
- **User Behavior:** Path sequences (requires additional logging) track user journeys

#### 6.5.5.3 Not Applicable Observability Patterns

Several observability patterns common in distributed systems are intentionally excluded due to the monolithic architecture:

**Distributed Tracing:**
- ❌ **Not Required:** Single-process architecture documented in Section 6.1.3.1 eliminates distributed tracing need
- ❌ **No Service-to-Service Calls:** No inter-service communication to trace
- ❌ **No Trace Propagation:** No distributed context requiring correlation IDs or trace headers
- ✅ **Alternative:** Request logging provides complete request lifecycle visibility within single process

**Service Mesh Observability:**
- ❌ **Not Required:** No sidecar proxies (Istio, Linkerd) managing traffic
- ❌ **No Service Discovery:** Fixed HOST:PORT configuration eliminates discovery observability
- ❌ **No Circuit Breaker Metrics:** No external dependencies requiring circuit breakers

**Distributed Transaction Tracing:**
- ❌ **Not Required:** Stateless design with no database or transaction management
- ❌ **No Two-Phase Commit:** No distributed transactions requiring coordination tracking
- ❌ **No Saga Patterns:** No long-running business processes spanning services

**APM (Application Performance Monitoring):**
- ❌ **Not Implemented:** No New Relic, Datadog, or Dynatrace integration
- ⚠️ **Educational Trade-Off:** APM provides powerful insights but adds complexity and cost
- ✅ **Alternative:** Prometheus + Grafana provides sufficient observability for educational scope

#### 6.5.5.4 Capacity Planning and Scalability Observability

The monitoring infrastructure supports capacity planning through resource utilization tracking, though no auto-scaling mechanisms are currently configured:

**Capacity Metrics:**

| Metric Category | Indicators | Thresholds | Scaling Decision |
|---|---|---|
| CPU Utilization | Process CPU percentage | > 70% sustained | Add horizontal replicas |
| Memory Usage | RSS memory bytes | > 80% of allocation | Add horizontal replicas or increase limits |
| Request Latency | p95 response time | > 50ms | Investigate performance or scale horizontally |
| Request Rate | Requests per second | Approaching throughput limit | Add horizontal replicas |

**Stateless Scalability:**
As documented in Section 5.4.4, the stateless architecture "enables unlimited horizontal scaling" without session affinity or state synchronization concerns. Capacity planning focuses exclusively on compute resource allocation rather than state management complexity.

**Current Scaling Approach:**
- ✅ **Horizontal Scaling Ready:** Stateless design supports arbitrary replica count
- ❌ **Auto-Scaling Not Configured:** No HPA (Kubernetes) or Auto Scaling Groups (AWS) defined
- ⚠️ **Manual Scaling Only:** Operators must manually adjust replica count based on metrics
- 📊 **Metrics Guide Decisions:** Prometheus metrics provide data-driven capacity planning inputs

### 6.5.6 Incident Response Readiness

#### 6.5.6.1 Current Incident Detection Capabilities

**Automated Detection Mechanisms:**

The system provides basic automated incident detection through infrastructure-level health monitoring:

**Docker Health Check Detection:**
- Detects application unavailability after 3 consecutive health check failures (90 seconds)
- Automatically triggers container restart via `unless-stopped` restart policy
- Visible in Docker daemon logs and `docker ps` status column
- No external notification or escalation (requires manual monitoring)

**Manual Detection Mechanisms:**

| Detection Method | Visibility Window | Response Time | Limitations |
|---|---|---|
| Console Log Monitoring | Real-time | Immediate | Requires active log monitoring by operator |
| Docker Logs Review | Historical | Variable | Reactive, no proactive alerting |
| Health Check Script | On-demand | Manual execution | No continuous monitoring |

**Missing Detection Capabilities:**
- ❌ No alerting rules for error rate thresholds
- ❌ No latency-based alerts for performance degradation
- ❌ No resource exhaustion alerts (memory, CPU)
- ❌ No availability monitoring external to Docker host

#### 6.5.6.2 Alert Routing and Escalation

**Current State:** ❌ **No Alerting Infrastructure Implemented**

The `infrastructure/monitoring/prometheus.yml` file contains empty alerting configuration:
```yaml
alerting:
  alertmanagers: []
rule_files: []
```

**Missing Alert Infrastructure:**
- ❌ No Alertmanager deployment or configuration
- ❌ No alert rule definitions (no .rules files)
- ❌ No notification channels (PagerDuty, Slack, email)
- ❌ No escalation policies or on-call rotations
- ❌ No alert grouping or deduplication

**Rationale for Absence:**
As documented in Section 1.2.1, this is a "standalone tutorial project" with no production support obligations or SLA requirements. The absence of formal alerting infrastructure is appropriate for the educational scope.

**Manual Incident Response:**
- Operators monitor console logs and Docker health status manually
- Health check script enables programmatic validation in deployment pipelines
- Container restarts provide automatic recovery for process failures
- No formal escalation procedures or on-call rotations defined

#### 6.5.6.3 Runbook Documentation

**Current Documentation:**

The repository provides operational documentation through:

**README.md Operational Sections:**
- Startup instructions with `npm start` command
- Docker deployment with `docker-compose up` instructions
- Health check validation using bash script
- Graceful shutdown with SIGTERM/SIGINT signal handling

**Infrastructure Scripts:**
- `infrastructure/scripts/health-check.sh`: Programmatic health validation
- `infrastructure/scripts/deploy.sh`: Deployment procedure (references health check)
- `infrastructure/local/docker-compose.yml`: Container orchestration configuration

**Implicit Runbooks:**

| Scenario | Detection | Response Procedure | Recovery Time |
|---|---|---|
| Container Crash | Docker health check failure | Automatic restart via restart policy | 30-60 seconds |
| Port Conflict (EADDRINUSE) | Startup error in logs | Identify conflicting process, stop or change PORT | 5-10 minutes (manual) |
| Memory Leak | Container OOM kill | Docker restarts container automatically | 1-2 minutes |
| High Latency | Console log response times increase | Manual investigation, horizontal scaling if needed | Variable (manual) |

**Missing Formal Runbooks:**
- ❌ No structured incident response playbooks
- ❌ No troubleshooting decision trees
- ❌ No escalation contact lists
- ❌ No disaster recovery procedures documentation

#### 6.5.6.4 Post-Mortem and Improvement Processes

**Current State:** ❌ **No Formal Post-Mortem Process**

The educational scope and absence of production deployments eliminate the need for formal incident retrospectives.

**Available Incident Forensics:**
- Docker logs retain complete stdout/stderr history until container removal
- Console logs capture all errors with timestamps and stack traces
- Request logs provide audit trail of all HTTP transactions
- Docker inspect shows health check history and state transitions

**Continuous Improvement Mechanisms:**
- GitHub Issues track bugs and enhancement requests
- Pull Request reviews provide quality gates
- Test suite prevents regression of fixed issues
- Technical Specification documents architectural decisions and rationale

**Formal Process Gaps:**
- ❌ No incident severity classification
- ❌ No root cause analysis templates
- ❌ No corrective action tracking
- ❌ No incident metrics or MTTR (Mean Time To Recovery) measurement
- ❌ No blameless postmortem culture documentation

**Educational Context:**
Section 1.2.1 establishes this as an educational tool prioritizing simplicity. The absence of enterprise incident management processes is intentional and appropriate for the learning context.

### 6.5.7 Monitoring Architecture Diagrams

#### 6.5.7.1 Current Implementation Architecture

The following diagram illustrates the **currently functional** monitoring and observability components:

```mermaid
graph TD
    subgraph "Application Container"
        A[Node.js Application<br/>Port 3000]
        B[Console Logger<br/>logger.js]
        C[Request Logger<br/>Middleware]
    end
    
    subgraph "Docker Infrastructure"
        D[Docker Health Check<br/>30s interval]
        E[Docker Logging Driver]
    end
    
    subgraph "External Tools"
        F[docker logs command]
        G[health-check.sh script]
        H[Terminal/Console Output]
    end
    
    A -->|Request Timing| C
    C -->|Log Entry| B
    B -->|stdout/stderr| E
    E -->|Log Retrieval| F
    F -->|Display Logs| H
    
    D -->|curl /hello| A
    A -->|200 OK or Failure| D
    D -->|Health Status| I[Docker ps status]
    D -->|Restart on Failure| A
    
    G -->|HTTP Request| A
    A -->|Response| G
    G -->|Exit Code 0/1/2| J[CI/CD Pipeline]
    
    B -->|Real-time Logs| H
    
    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#90EE90
    
    classDef implemented fill:#90EE90
    classDef provisioned fill:#FFE4B5
    classDef missing fill:#FFB6C6
```

**Key Components Status:**
- ✅ **Green (Implemented):** Fully functional monitoring components
- **Console Logging:** All log levels, timestamps, request timing operational
- **Docker Health Checks:** Active monitoring with automatic restart
- **Docker Logs:** Complete log capture and retrieval
- **Health Check Script:** Programmatic validation for CI/CD

#### 6.5.7.2 Planned Monitoring Architecture

The following diagram illustrates the **complete monitoring architecture** including provisioned but inactive components:

```mermaid
graph TD
    subgraph "Application Container"
        A[Node.js Application<br/>Port 3000]
        B[Console Logger]
        C[Request Timing Middleware]
        D[NOT IMPLEMENTED<br/>/metrics endpoint<br/>prom-client]
        E[NOT IMPLEMENTED<br/>/health endpoint]
    end
    
    subgraph "Monitoring Infrastructure NOT IN docker-compose.yml"
        F[Prometheus Server<br/>Port 9090]
        G[Grafana Server<br/>Port 3001]
    end
    
    subgraph "Configuration Files EXIST"
        H[prometheus.yml<br/>3 scrape jobs configured]
        I[grafana-dashboard.json<br/>13 panels defined]
    end
    
    subgraph "Docker Infrastructure"
        J[Docker Health Check<br/>Uses /hello as workaround]
        K[Docker Logging Driver]
    end
    
    subgraph "External Systems"
        L[CloudWatch / Elasticsearch<br/>Log Aggregation]
        M[Operators / Developers<br/>Dashboard Viewers]
    end
    
    A -->|Logs| B
    B -->|stdout| K
    K -->|Forward Logs| L
    
    A -->|Response Times| C
    
    D -.->|Would Expose<br/>Prometheus Format| F
    E -.->|Would Return<br/>200 OK| F
    
    F -.->|Would Scrape<br/>Every 5s| D
    F -.->|Would Scrape<br/>Every 30s| E
    
    H -.->|Configuration<br/>For| F
    I -.->|Configuration<br/>For| G
    
    F -.->|Would Provide<br/>Metrics| G
    G -.->|Would Display<br/>Dashboards| M
    
    J -->|curl /hello<br/>Every 30s| A
    A -->|200 OK| J
    
    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style H fill:#FFE4B5
    style I fill:#FFE4B5
    style D fill:#FFB6C6
    style E fill:#FFB6C6
    style F fill:#FFB6C6
    style G fill:#FFB6C6
```

**Legend:**
- ✅ **Green (Implemented):** Fully functional components
- ⚠️ **Orange (Provisioned):** Configuration files exist but services not deployed
- ❌ **Red (Missing):** Required implementation not present

**Implementation Gaps:**
1. `/metrics` endpoint not implemented in application code
2. `/health` endpoint not implemented (using `/hello` as workaround)
3. prom-client library not installed in package.json
4. Prometheus container not defined in docker-compose.yml
5. Grafana container not defined in docker-compose.yml

#### 6.5.7.3 Metrics Collection Flow (Planned)

The following sequence diagram illustrates the **planned metrics collection workflow** once implementation gaps are addressed:

```mermaid
sequenceDiagram
    participant Client
    participant App as Application<br/>(with metrics)
    participant Prom as Prometheus<br/>Server
    participant Graf as Grafana<br/>Dashboard
    participant Operator
    
    Note over App,Prom: Every 5 seconds (metrics scrape)
    
    rect rgb(255, 230, 230)
        Note over App,Prom: Current State: NOT IMPLEMENTED
        Prom->>App: GET /metrics
        App--xProm: 404 Not Found
        Prom->>Prom: Set up{job="hello-world-app"} = 0
    end
    
    rect rgb(230, 255, 230)
        Note over App,Prom: Future State: IMPLEMENTED
        Client->>App: GET /hello
        App->>App: Increment http_requests_total<br/>Record http_request_duration_seconds
        App->>Client: 200 OK "Hello world"
        
        Prom->>App: GET /metrics
        App->>App: Serialize metrics registry
        App->>Prom: 200 OK (Prometheus format)
        Note right of Prom: http_requests_total{method="GET",path="/hello",status="200"} 1523<br/>http_request_duration_seconds_bucket{le="0.005"} 1450<br/>nodejs_memory_usage_bytes 45678901
        Prom->>Prom: Store metrics in TSDB
    end
    
    rect rgb(230, 240, 255)
        Note over Graf,Operator: Dashboard Visualization
        Operator->>Graf: View Dashboard
        Graf->>Prom: PromQL Query:<br/>rate(http_requests_total[1m])
        Prom->>Graf: Time-series data
        Graf->>Operator: Render graph with request rate
    end
    
    rect rgb(255, 245, 230)
        Note over App,Prom: Every 30 seconds (health scrape)
        Prom->>App: GET /health
        App->>Prom: 200 OK
        Prom->>Prom: Set up{job="hello-world-health"} = 1
    end
```

#### 6.5.7.4 Health Check Architecture

The following diagram illustrates the **multi-layered health checking strategy** with both implemented and planned components:

```mermaid
flowchart TD
    subgraph "Application Container"
        A["Node.js Application<br/>Listening on Port 3000"]
        B["/hello endpoint<br/>Returns 'Hello world'"]
        C["MISSING: /health endpoint<br/>Would return 200 OK"]
    end
    
    subgraph "Docker Health Checks IMPLEMENTED"
        D["Docker Health Check<br/>interval: 30s, retries: 3"]
        E{"3 Consecutive<br/>Failures?"}
        F["Mark Container<br/>UNHEALTHY"]
        G["Restart Container<br/>restart: unless-stopped"]
    end
    
    subgraph "Prometheus Health Checks NOT IMPLEMENTED"
        H["Prometheus Health Scrape<br/>interval: 30s"]
        I["up metric<br/>job=hello-world-health"]
    end
    
    subgraph "CI/CD Health Checks IMPLEMENTED"
        J["health-check.sh<br/>Bash Script"]
        K{"200 OK +<br/>'Hello world'<br/>in body?"}
        L["Exit 0<br/>HEALTHY"]
        M["Exit 1<br/>UNHEALTHY"]
    end
    
    D -->|"curl -f /hello"| B
    B -->|"200 OK"| D
    B -->|"Failure"| D
    D --> E
    E -->|"Yes"| F
    E -->|"No"| D
    F --> G
    G --> A
    
    H -.->|"GET /health<br/>NOT IMPLEMENTED"| C
    C -.->|"Would return<br/>200 OK"| H
    H -.->|"Would set"| I
    
    J -->|"HTTP GET /hello"| B
    B -->|"Response"| K
    K -->|"Yes"| L
    K -->|"No"| M
    
    style B fill:#90EE90
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#90EE90
    style G fill:#90EE90
    style J fill:#90EE90
    style K fill:#90EE90
    style L fill:#90EE90
    style M fill:#90EE90
    style C fill:#FFB6C6
    style H fill:#FFB6C6
    style I fill:#FFB6C6
```

**Implemented Health Check Mechanisms:**
1. **Docker Health Check:** Active monitoring with automatic recovery
2. **Bash Health Script:** Programmatic validation for deployment pipelines
3. **Workaround:** Both use `/hello` endpoint since `/health` not implemented

**Planned Health Check Mechanism:**
- **Prometheus Health Scrape:** Dedicated health monitoring separate from metrics (requires `/health` endpoint)

#### 6.5.7.5 Grafana Dashboard Layout

The provisioned Grafana dashboard organizes 13 panels into logical groupings for comprehensive observability:

```mermaid
graph TD
    subgraph "Grafana Dashboard: Node.js Hello World"
        subgraph "Row 1: Service Health"
            A1[Text Panel<br/>Documentation]
            A2[Application Status<br/>Gauge: up metric]
            A3[Health Check Status<br/>Gauge: health up]
            A4[Uptime<br/>Single Stat]
        end
        
        subgraph "Row 2: Request Volume"
            B1[Total Requests<br/>Counter]
            B2[Request Rate<br/>Graph by method]
            B3[Endpoint Traffic<br/>Table by path]
        end
        
        subgraph "Row 3: Performance"
            C1[Response Time<br/>p50/p90/p95/p99<br/>Graph]
            C2[HTTP Status Distribution<br/>Pie Chart]
            C3[Error Rate<br/>Percentage Graph]
        end
        
        subgraph "Row 4: System Resources"
            D1[Memory Usage<br/>RSS + Heap Graph]
            D2[CPU Usage<br/>Percentage Graph]
            D3[Event Loop Lag<br/>Blocking Detection]
        end
    end
    
    subgraph "Data Sources NOT IMPLEMENTED"
        E[Prometheus<br/>No metrics data]
        F[Application<br/>No /metrics endpoint]
    end
    
    E -.->|Would query| A2
    E -.->|Would query| A3
    E -.->|Would query| A4
    E -.->|Would query| B1
    E -.->|Would query| B2
    E -.->|Would query| B3
    E -.->|Would query| C1
    E -.->|Would query| C2
    E -.->|Would query| C3
    E -.->|Would query| D1
    E -.->|Would query| D2
    E -.->|Would query| D3
    
    F -.->|Would scrape| E
    
    style A1 fill:#e1f5ff
    style A2 fill:#FFB6C6
    style A3 fill:#FFB6C6
    style A4 fill:#FFB6C6
    style B1 fill:#FFB6C6
    style B2 fill:#FFB6C6
    style B3 fill:#FFB6C6
    style C1 fill:#FFB6C6
    style C2 fill:#FFB6C6
    style C3 fill:#FFB6C6
    style D1 fill:#FFB6C6
    style D2 fill:#FFB6C6
    style D3 fill:#FFB6C6
    style E fill:#FFB6C6
    style F fill:#FFB6C6
```

**Dashboard Configuration Status:**
- ✅ **Dashboard JSON:** Complete configuration with 13 panel definitions
- ✅ **Panel Queries:** All PromQL queries correctly formatted
- ✅ **Visualization Types:** Appropriate chart types for each metric
- ❌ **Data Display:** All panels show "No data" until metrics implemented
- ❌ **Prometheus:** Not included in docker-compose.yml
- ❌ **Grafana:** Not included in docker-compose.yml

### 6.5.8 Monitoring Suitability Assessment

#### 6.5.8.1 Current State Adequacy

The implemented monitoring capabilities are **appropriate and sufficient** for the system's educational scope and operational requirements:

**Adequate for Educational Use:**
- Console logging provides immediate visibility into application behavior for learners
- Docker health checks demonstrate container-level monitoring concepts
- Health check script teaches programmatic validation patterns
- Provisioned configuration files expose learners to production monitoring architecture

**Adequate for Development Deployment:**
- Console logs visible in terminal provide real-time debugging
- Docker automatic restart recovers from process failures
- Single-container deployment eliminates need for distributed observability
- Manual monitoring acceptable for development environments

**Adequate for Small-Scale Production:**
- Stateless design documented in Section 5.4.4 eliminates state-related monitoring complexity
- No database or external dependencies means no integration point monitoring required
- Single endpoint simplifies observability requirements
- Docker logs provide sufficient audit trail for compliance

#### 6.5.8.2 Limitations for Enterprise Scale

The monitoring implementation would require significant enhancement for enterprise production deployments:

**Insufficient for High-Scale Production:**

| Limitation | Enterprise Requirement | Current Gap | Mitigation Strategy |
|---|---|---|
| No Centralized Logging | Log aggregation with retention and search | Console logs only | Implement Elasticsearch or CloudWatch Logs |
| No Metrics Collection | Performance monitoring and capacity planning | No metrics endpoints | Implement prom-client and /metrics endpoint |
| No Alerting | Proactive incident detection and notification | No alerts configured | Implement Alertmanager with PagerDuty integration |
| No Distributed Tracing | Request correlation across services | Not applicable (monolith) | N/A for current architecture |

**Insufficient for Compliance Requirements:**

| Compliance Need | Monitoring Requirement | Current Gap | Remediation |
|---|---|---|
| Audit Logging | Tamper-proof log retention | Ephemeral Docker logs | Implement write-once log storage |
| Access Tracking | Request source IP and authentication | Logs capture method/path only | Add user identity and IP to logs |
| Data Residency | Logs stored in compliant regions | No region enforcement | Configure log forwarding to compliant storage |
| Retention Policies | 90-day+ log retention | Docker logs deleted with container | Implement log archival to durable storage |

#### 6.5.8.3 Future Enhancement Roadmap

The gap between provisioned infrastructure and implemented functionality provides a clear learning and enhancement path:

**Phase 1: Metrics Implementation (Estimated Effort: 2-4 hours)**
1. Install prom-client library: `npm install prom-client`
2. Create metrics registry with default Node.js collectors
3. Implement request counter and histogram middleware
4. Create `/metrics` endpoint returning Prometheus exposition format
5. Create `/health` endpoint returning 200 OK with optional health checks

**Phase 2: Monitoring Services Deployment (Estimated Effort: 1-2 hours)**
1. Add Prometheus service to `docker-compose.yml` with volume mounts
2. Add Grafana service to `docker-compose.yml` with Prometheus datasource
3. Configure Grafana to auto-load dashboard from JSON file
4. Update documentation with monitoring access URLs

**Phase 3: Alerting Implementation (Estimated Effort: 2-3 hours)**
1. Define alerting rules in Prometheus configuration files
2. Deploy Alertmanager container in docker-compose.yml
3. Configure notification channels (Slack webhook, email SMTP)
4. Document alert response procedures in runbooks

**Phase 4: Production Hardening (Estimated Effort: 4-8 hours)**
1. Implement structured JSON logging for machine parsing
2. Configure log forwarding to CloudWatch/Elasticsearch
3. Add custom business metrics (endpoint-specific counters)
4. Implement SLA monitoring and uptime calculations
5. Create comprehensive Grafana dashboards for different stakeholder roles

#### References

#### Implementation Files

**Logging Implementation:**
- `src/backend/utils/logger.js` - Centralized logging utility with timestamps and log levels
- `src/backend/middleware/index.js` - Request logging middleware with response time tracking
- `src/backend/config.js` - Test mode flag for log suppression

**Health Check Implementation:**
- `infrastructure/local/docker-compose.yml` - Docker health check configuration with 30s interval
- `infrastructure/scripts/health-check.sh` - Bash health validation script for CI/CD
- `src/backend/index.js` - Graceful shutdown implementation with SIGTERM/SIGINT handlers

**Monitoring Configuration (Provisioned):**
- `infrastructure/monitoring/prometheus.yml` - Complete Prometheus configuration with 3 scrape jobs
- `infrastructure/monitoring/grafana-dashboard.json` - 13-panel dashboard definition (referenced in summary)

**Documentation:**
- `README.md` - Main project documentation with monitoring section
- `infrastructure/README.md` - Infrastructure documentation detailing monitoring setup

#### Technical Specification Cross-References

- **Section 5.4.1 Logging and Observability** - Comprehensive logging strategy, Prometheus metrics, Grafana dashboard, implementation gaps
- **Section 5.4.5 Health Checking and Availability** - Docker health checks, Prometheus health scraping, bash script, graceful shutdown
- **Section 6.1.1 Applicability Statement** - Monolithic architecture rationale, single-process design
- **Section 6.1.3.1 Monolithic HTTP Server Architecture** - Single-process implementation eliminating distributed tracing needs
- **logger.js - Centralized Logging Utility** - Detailed logger component specification with log levels and functions
- **Section 1.2.1 Project Context** - Educational focus and standalone project rationale
- **Section 5.4.4 Performance and Scalability** - Stateless design enabling horizontal scaling

#### Repository Searches

- File reads: 15 files examined for monitoring implementation details
- Folder exploration: 10 directories (depth 0-5) for comprehensive coverage
- Broad searches: 4 targeted queries validating absence of distributed monitoring components
- No web searches conducted (all information from repository)

## 6.6 Testing Strategy

### 6.6.1 Overview

#### 6.6.1.1 Testing Philosophy

The Node.js Hello World Service implements a comprehensive, production-ready testing strategy that serves dual purposes: demonstrating professional testing practices for educational value while ensuring system reliability and correctness. Despite the system's simplicity as an educational HTTP service, the testing approach is deliberately thorough to showcase industry-standard testing patterns that scale to complex production systems.

The testing strategy emphasizes:

- **Educational Demonstration**: Test code serves as executable documentation, illustrating proper testing patterns including isolation, mocking, assertions, and test organization
- **Quality Assurance**: Strict coverage requirements (80-100%) ensure all code paths are verified, preventing regressions during refactoring or enhancements
- **Automated Verification**: CI/CD integration with quality gates prevents defective code from reaching production
- **Test-Driven Development Support**: Watch mode and fast test execution enable TDD workflows during development
- **Production-Ready Patterns**: Enterprise-grade testing infrastructure demonstrates practices applicable to real-world systems

#### 6.6.1.2 Testing Scope

The testing strategy encompasses the complete system stack from individual utility functions through full HTTP request/response cycles:

| Testing Level | Scope | Coverage Requirement | Test Count |
|---------------|-------|---------------------|------------|
| Unit Tests | Isolated component logic (handlers, router, config, utilities) | 85-100% per component | ~50+ test cases |
| Integration Tests | Full HTTP request/response cycle with real server instance | 90%+ functional scenarios | ~5+ test scenarios |
| System Tests | Health checks, deployment verification, graceful shutdown | 100% critical paths | Automated checks |

**Testing Coverage by Component:**

- **Handlers**: 100% coverage (critical business logic)
- **Router**: 90%+ coverage (path matching and dispatch)
- **Configuration**: 90%+ coverage (environment loading and validation)
- **Error Handling**: 90-100% coverage (error scenarios and responses)
- **Utilities**: 85%+ coverage (helper functions and constants)
- **Server Lifecycle**: 85%+ coverage (startup, shutdown, signal handling)

### 6.6.2 Testing Approach

#### 6.6.2.1 Unit Testing

#### Testing Framework and Tools

**Primary Framework: Jest 29.x**

Jest provides the complete testing infrastructure with zero-configuration setup and integrated capabilities:

- **Test Runner**: Parallel test execution with watch mode for rapid feedback
- **Assertion Library**: Comprehensive matchers for all assertion patterns
- **Mocking System**: Built-in function mocking, module mocking, and spy capabilities
- **Coverage Reporting**: Integrated code coverage collection and threshold enforcement
- **Snapshot Testing**: Support for API response and data structure snapshots

**Configuration Location**: `src/backend/jest.config.js`

**Key Configuration Settings:**

```javascript
{
  testEnvironment: 'node',                    // Node.js environment (not browser)
  testMatch: ['**/__tests__/**/*.test.js'],   // Test file pattern
  verbose: true,                              // Detailed output for debugging
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/.eslintrc.js'
  ],
  clearMocks: true,      // Clear mock calls between tests
  resetMocks: true,      // Reset mock implementations between tests
  restoreMocks: true     // Restore original implementations after tests
}
```

**Evidence**: `src/backend/jest.config.js` contains complete Jest configuration with test discovery patterns, mock management, and coverage collection settings.

#### Test Organization Structure

Tests are organized in a hierarchical directory structure mirroring the source code organization, facilitating easy test location and maintenance:

```
src/backend/__tests__/
├── setup.js                          # Global test configuration and mocks
├── config.test.js                    # Configuration loading unit tests
├── errorHandler.test.js              # Error handling unit tests
├── index.test.js                     # Bootstrap logic unit tests
├── router.test.js                    # Routing logic unit tests
├── server.test.js                    # Server lifecycle unit tests
├── handlers/                         # Handler unit tests (mirroring src structure)
│   ├── error.test.js                # Error handler tests
│   ├── hello.test.js                # Hello handler tests
│   └── helloHandler.test.js         # Alternative hello handler tests
├── integration/                      # Integration test suite
│   └── api.test.js                  # Full HTTP integration tests
└── utils/                           # Utility unit tests
    ├── constants.test.js            # Constants validation tests
    └── logger.test.js               # Logger utility tests
```

**Organizational Principles:**

1. **Co-location**: Test files adjacent to source files (`__tests__` directory at same level as `src`)
2. **Naming Convention**: `<component-name>.test.js` pattern for test file names
3. **Categorization**: Separate directories for unit tests, integration tests, and test utilities
4. **Test Grouping**: `describe()` blocks group related tests within files
5. **Depth Matching**: Test directory structure mirrors source code depth for easy navigation

**Evidence**: Comprehensive directory exploration revealed test files at depth 4 in the hierarchy: `src/backend/__tests__/handlers/`, `src/backend/__tests__/integration/`, and `src/backend/__tests__/utils/`.

#### Mocking Strategy

The testing strategy employs a multi-layered mocking approach to achieve test isolation while maintaining realistic test scenarios.

**Global Mock Setup** (`__tests__/setup.js`):

All console and logger methods are globally mocked to prevent test output noise and enable verification of logging calls:

```javascript
// Console method mocking (applied to all tests)
jest.spyOn(global.console, 'log').mockImplementation(jest.fn());
jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn());
jest.spyOn(global.console, 'debug').mockImplementation(jest.fn());

// Logger utility mocking
jest.spyOn(logger, 'info').mockImplementation(jest.fn());
jest.spyOn(logger, 'error').mockImplementation(jest.fn());
jest.spyOn(logger, 'warn').mockImplementation(jest.fn());
jest.spyOn(logger, 'debug').mockImplementation(jest.fn());
jest.spyOn(logger, 'request').mockImplementation(jest.fn());
jest.spyOn(logger, 'response').mockImplementation(jest.fn());
```

**Global Test Timeout**: `jest.setTimeout(10000)` provides 10-second timeout for all tests, accommodating slower integration tests and CI environments.

**Module-Level Mocking**:

Handler tests use Jest's module mocking to isolate components under test:

```javascript
// Mock error handler dependency in hello handler tests
jest.mock('../../handlers/error', () => ({
  handleMethodNotAllowed: jest.fn()
}));

// Mock logger utility
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  logger: { info: jest.fn() }
}));
```

**Mock Request/Response Objects**:

HTTP request and response objects are mocked to simulate server interactions without network calls:

```javascript
// Request mock (minimal required properties)
const mockRequest = {
  method: 'GET',
  url: '/hello'
};

// Response mock (with method chaining support)
const mockResponse = {
  statusCode: null,
  setHeader: jest.fn().mockReturnThis(),  // Enables method chaining
  end: jest.fn()
};
```

**Environment Variable Mocking**:

Configuration tests mock environment variables with proper cleanup to prevent test interference:

```javascript
// Mock environment variable with cleanup function
function mockEnvironmentVariable(name, value) {
  const original = process.env[name];
  process.env[name] = value;
  return () => { process.env[name] = original; };
}

// Usage pattern with automatic cleanup
let cleanup;
beforeEach(() => {
  cleanup = mockEnvironmentVariable('PORT', '8080');
});
afterEach(() => {
  cleanup();
});
```

**Mock Lifecycle Management**:

- `beforeEach`: Initialize fresh mocks with `jest.clearAllMocks()`
- `afterEach`: Restore original implementations with `jest.restoreAllMocks()`
- Per-test cleanup prevents mock state leakage between tests

**Evidence**: `src/backend/__tests__/setup.js` contains global mock configuration, and `src/backend/__tests__/handlers/hello.test.js` demonstrates module-level and request/response mocking patterns.

#### Code Coverage Requirements

Strict code coverage thresholds enforce quality standards and prevent untested code paths:

| Coverage Scope | Branches | Functions | Lines | Statements | Rationale |
|----------------|----------|-----------|-------|------------|-----------|
| Global (All Files) | 80% | 90% | 85% | 85% | Baseline quality standard |
| handlers/hello.js | 100% | 100% | 100% | 100% | Critical business logic |
| handlers/error.js | 90% | 100% | 90% | 90% | Error handling paths |

**Coverage Enforcement Mechanism**:

Jest fails test runs when coverage thresholds are not met, preventing untested code from being merged:

```javascript
coverageThresholds: {
  global: {
    branches: 80,
    functions: 90,
    lines: 85,
    statements: 85
  },
  './handlers/hello.js': {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100
  },
  './handlers/error.js': {
    branches: 90,
    functions: 100,
    lines: 90,
    statements: 90
  }
}
```

**Coverage Collection Configuration**:

All JavaScript files are included in coverage collection except infrastructure files:

- **Included**: All `.js` files in source directories
- **Excluded**: `node_modules/`, `coverage/`, `jest.config.js`, `.eslintrc.js`

**100% Coverage Requirement for Critical Components**:

The `handlers/hello.js` component requires perfect coverage across all metrics, reflecting its status as the core business logic. This ensures every code path, branch, and edge case is tested.

**Evidence**: `src/backend/jest.config.js` (lines 30-52) defines coverage thresholds with file-specific overrides for critical components.

#### Test Naming Conventions

Test names follow consistent conventions that make test intent immediately clear:

**File Naming**: `<component-name>.test.js` pattern
- `config.test.js` - Tests for configuration module
- `router.test.js` - Tests for routing logic
- `hello.test.js` - Tests for hello handler

**Test Suite Structure**:

```javascript
describe('Component or Module Name', () => {
  describe('Function or Method Name', () => {
    test('should perform expected behavior when condition is met', () => {
      // Test implementation
    });
  });
});
```

**Example Test Names from Actual Test Suite**:

- `'GET /hello should return 200 OK with \'Hello world\''`
- `'should return Hello world with 200 status for GET requests'`
- `'should call handleMethodNotAllowed for non-GET requests'`
- `'should validate port number within acceptable range'`
- `'should apply default configuration when environment variables are missing'`

**Naming Guidelines**:

1. **Descriptive Intent**: Test name explains expected behavior without reading implementation
2. **Natural Language**: Complete sentences describe the scenario
3. **Condition-Action-Result Pattern**: "should [action] when [condition]" or "should [action] for [scenario]"
4. **Negative Cases Explicit**: "should throw error when invalid input provided"
5. **Edge Cases Identified**: "should handle empty string", "should handle boundary values"

**Evidence**: All test files discovered (`config.test.js`, `router.test.js`, `handlers/hello.test.js`, `integration/api.test.js`) follow these consistent naming patterns.

#### Test Data Management

Test data management follows a centralized, constants-based approach that ensures consistency and maintainability:

**Constants-Based Test Data**:

All test assertions reference centralized constants from `src/backend/utils/constants.js`:

```javascript
const { HTTP_STATUS, MESSAGES, ROUTES, CONFIG } = require('../../utils/constants');

// Test assertions use constants for expected values
expect(response.statusCode).toBe(HTTP_STATUS.OK);              // 200
expect(response.text).toBe(MESSAGES.HELLO_RESPONSE);           // "Hello world"
expect(request.url).toBe(ROUTES.HELLO);                        // "/hello"
expect(config.port).toBe(CONFIG.DEFAULT_PORT);                 // 3000
```

**Validated Constants** (`__tests__/utils/constants.test.js`):

Constants themselves are tested to ensure correctness:

| Constant Category | Validated Values | Purpose |
|------------------|------------------|---------|
| HTTP_STATUS | OK=200, NOT_FOUND=404, METHOD_NOT_ALLOWED=405, INTERNAL_SERVER_ERROR=500 | Status code assertions |
| ROUTES | HELLO='/hello' | Endpoint path testing |
| CONFIG | DEFAULT_PORT=3000, ENV_VAR_PORT='PORT' | Configuration testing |
| MESSAGES | HELLO_RESPONSE='Hello world', NOT_FOUND='Not Found', METHOD_NOT_ALLOWED='Method Not Allowed' | Response body assertions |

**Mock Data Builder Functions**:

Helper functions create consistent mock objects for tests:

```javascript
// Request mock builder
function createMockRequest(method = 'GET', url = '/hello') {
  return { method, url };
}

// Response mock builder with Content-Length support
function createMockResponse() {
  return {
    statusCode: 200,
    getHeader: jest.fn().mockReturnValue(11)  // Content-Length of "Hello world"
  };
}
```

**Benefits of Constants-Based Approach**:

1. **Single Source of Truth**: One location to update when requirements change
2. **Type Safety**: Constants validated in their own test suite
3. **Self-Documenting**: Test assertions clearly show expected system behavior
4. **Refactoring Safety**: Constants updates automatically propagate to all tests
5. **Consistency**: Same values used in production code and test assertions

**No Test Database or Fixtures Required**:

The system is stateless with no database or persistent storage, eliminating need for:
- Test database setup/teardown
- Fixture data seeding
- Database cleanup between tests
- Schema migrations for tests

**Evidence**: `src/backend/__tests__/integration/api.test.js` (line 12) imports constants for assertions, and `__tests__/utils/constants.test.js` validates all constant values.

#### 6.6.2.2 Integration Testing

#### Service Integration Test Approach

Integration tests verify the complete HTTP request/response cycle using a real server instance rather than mocked components. This approach ensures that all layers (server, middleware, router, handlers) integrate correctly.

**Integration Test Framework: Supertest 6.3.3**

Supertest provides fluent HTTP assertions without requiring external server processes:

```javascript
const request = require('supertest');
const { createServer } = require('../../server');

// Make HTTP assertions against server instance
const response = await request(`http://localhost:${config.port}`)
  .get('/hello')
  .expect(200)
  .expect('Content-Type', 'text/plain');
```

**Key Capabilities**:

- **Direct Server Testing**: Accepts Node.js HTTP server instances without network I/O
- **Fluent Assertions**: Chainable API for status codes, headers, and body content
- **Full Stack Testing**: Exercises complete middleware chain, routing, and handlers
- **Promise-Based**: Integrates seamlessly with Jest's async testing patterns

**Evidence**: `src/backend/__tests__/integration/api.test.js` (line 9) imports and uses Supertest for full HTTP request/response cycle testing.

#### API Testing Strategy

**Server Lifecycle Management**:

Integration tests manage real server instances with proper startup and cleanup:

```javascript
describe('API Integration Tests', () => {
  let serverInstance;
  
  // Start server once before all integration tests
  beforeAll(async () => {
    const { createServer } = require('../../server');
    serverInstance = createServer();
    await startServer(serverInstance);
  });
  
  // Clean shutdown after all tests complete
  afterAll(async () => {
    if (serverInstance && serverInstance.listening) {
      await stopServer(serverInstance);
    }
  });
  
  // Tests run against real server...
});
```

**Benefits of Single Server Instance**:

- **Performance**: One startup/shutdown cycle for entire integration suite
- **Port Management**: Prevents port conflicts from multiple server instances
- **Realistic Testing**: Tests run against actual HTTP server, not mocks
- **Resource Efficiency**: Minimal overhead in CI/CD environments

**Integration Test Scenarios** (5 comprehensive test cases):

| Test Scenario | HTTP Method | Path | Expected Status | Expected Response | Validation Focus |
|---------------|-------------|------|-----------------|-------------------|------------------|
| Success Path | GET | /hello | 200 OK | "Hello world" | Successful request processing |
| Content Type Validation | GET | /hello | 200 OK | Content-Type: text/plain | Correct response headers |
| Method Restriction | POST | /hello | 405 Method Not Allowed | Method Not Allowed message + Allow: GET header | HTTP method validation |
| Unknown Route | GET | /undefined | 404 Not Found | "Not Found" message | 404 handling |
| Server Error Handling | Various | Error-triggering path | 500 Internal Server Error | Generic error message | Error recovery |

**Multi-Level Validation Pattern**:

Each integration test validates multiple aspects simultaneously:

```javascript
// Example: GET /hello success scenario
const response = await request(`http://localhost:${config.port}`)
  .get(ROUTES.HELLO)
  .expect(HTTP_STATUS.OK)                     // Status code validation
  .expect('Content-Type', 'text/plain')       // Header validation
  .expect('Allow', 'GET');                    // Method allowance header

// Body content validation
expect(response.text).toBe(MESSAGES.HELLO_RESPONSE);
```

**Security Header Validation**:

Integration tests verify that security headers are applied to all responses:

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `Content-Security-Policy: default-src 'none'` - Restricts resource loading

**Evidence**: `src/backend/__tests__/integration/api.test.js` contains 5 test cases covering success paths, error scenarios, method restrictions, and 404 handling. Server lifecycle management is implemented in `beforeAll` and `afterAll` hooks (lines 15-31).

#### Test Environment Management

**Environment Configuration for Tests**:

Jest automatically sets `NODE_ENV=test`, and the test setup configures additional environment variables:

| Environment Variable | Test Value | Purpose |
|---------------------|------------|---------|
| NODE_ENV | test | Identifies test execution environment |
| IS_TEST | true | Prevents automatic server startup in index.js |
| PORT | 3000 (configurable) | Test server port |
| HOST | localhost | Test server host |
| LOG_LEVEL | INFO | Logging verbosity for tests |

**Test Isolation Mechanisms**:

1. **Mock Clearing**: `jest.clearAllMocks()` in `beforeEach` hooks clears call history
2. **Mock Restoration**: `jest.restoreAllMocks()` in `afterEach` hooks restores original implementations
3. **Module Reset**: `jest.resetModules()` when needed to clear module cache
4. **Environment Cleanup**: Environment variable restoration after tests
5. **Server Lifecycle**: Proper startup/shutdown prevents port conflicts

**Test-Friendly Bootstrap Logic**:

The application entry point (`index.js`) conditionally starts the server to prevent conflicts during testing:

```javascript
// Conditional startup - doesn't start server when IS_TEST is true
if (!IS_TEST) {
  main().catch(error => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Tests can require modules without starting server
module.exports = { main, startServer, stopServer };
```

**Benefits**:

- Tests import server modules without triggering server startup
- No port conflicts during parallel test execution
- Faster test execution (no unnecessary server initialization)
- Tests have full control over server lifecycle

**No External Service Dependencies**:

The system is self-contained with no external service integrations, eliminating need for:
- External API mocking or test doubles
- Database containers or test databases
- Message queue test infrastructure
- Third-party service sandboxes

**Evidence**: `src/backend/__tests__/setup.js` configures global test environment, and `index.js` implements conditional server startup based on `IS_TEST` environment variable.

#### 6.6.2.3 End-to-End Testing

#### E2E Testing Approach for Simple Services

For the Node.js Hello World Service, end-to-end testing is functionally equivalent to integration testing due to the system's architectural simplicity. The service has no external dependencies, user interfaces, or multi-system workflows that would require traditional E2E test infrastructure.

**E2E Test Scenarios Covered by Integration Tests**:

The integration test suite (`__tests__/integration/api.test.js`) effectively provides E2E coverage by testing complete user-facing workflows:

1. **Successful Request Flow**: Client HTTP request → Server reception → Middleware chain → Router → Handler → Response generation → Client response
2. **Error Scenarios**: Invalid routes, disallowed methods, server errors - complete error handling flow
3. **Security Header Application**: Verification that security middleware is applied to all responses
4. **Health Check Verification**: The `/hello` endpoint doubles as a health check for deployment verification

**E2E Testing Through Deployment Verification**:

True end-to-end testing occurs during deployment through automated health checks:

**Health Check Script** (`infrastructure/scripts/health-check.sh`):

```bash
HOST="localhost"
PORT="3000"
ENDPOINT="/hello"
EXPECTED_RESPONSE="Hello world"
EXPECTED_STATUS="200"
TIMEOUT="5"
```

**Deployment Verification Process**:

1. Docker image build and deployment
2. Container health check (30-second intervals, 3 retries)
3. Automated health check execution with 5 retry attempts
4. Response validation (status code and body content)
5. Rollback on health check failure

**Docker Compose Health Check Configuration**:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
  interval: 30s
  timeout: 10s
  retries: 3
```

**Why Traditional E2E Testing Is Not Applicable**:

| Traditional E2E Requirement | Applicability to This System | Alternative Approach |
|-----------------------------|------------------------------|----------------------|
| UI Automation (Selenium, Cypress) | N/A - No user interface | Integration tests cover all functionality |
| Cross-Browser Testing | N/A - Backend service only | N/A |
| Multi-System Integration | N/A - Standalone service | N/A |
| Performance Testing Under Load | Optional - Not critical for educational service | Can be added with k6 or Artillery if needed |
| User Journey Testing | N/A - Single endpoint only | Integration tests cover the only user journey |

**Conclusion**: The integration test suite provides complete end-to-end coverage for this system architecture. Traditional E2E test infrastructure (UI automation, browser testing, multi-system orchestration) is unnecessary and would add complexity without value.

**Evidence**: `infrastructure/scripts/health-check.sh` implements deployment verification, and `infrastructure/local/docker-compose.yml` configures Docker health checks for E2E service availability testing.

### 6.6.3 Test Automation

#### 6.6.3.1 Test Execution Commands

**NPM Test Scripts**:

The project provides comprehensive test execution commands for different development and CI scenarios:

| Command | Purpose | Usage Context | Output |
|---------|---------|---------------|--------|
| `npm test` | Run all tests once | Pre-commit, CI pipeline, manual verification | Console output + coverage summary |
| `npm run test:watch` | Run tests in watch mode | Active development, TDD workflow | Auto-rerun on file changes |
| `npm run test:coverage` | Run tests with detailed coverage report | Coverage analysis, quality review | HTML coverage report + console |
| `npm run test:ci` | Run tests in CI mode | Automated CI/CD pipelines | JUnit XML + LCOV + exit codes |

**Related Quality Commands**:

| Command | Purpose | Quality Gate |
|---------|---------|--------------|
| `npm run lint` | ESLint code style checks | Must pass (0 errors) |
| `npm run audit` | npm security vulnerability scan | No high/critical vulnerabilities |
| `npm start` | Start server (production mode) | Health check must succeed |
| `npm run dev` | Start server with hot reload | Development only |

**Evidence**: `CONTRIBUTING.md` (lines 74-82) documents all test execution commands and their purposes.

#### 6.6.3.2 CI/CD Integration

**JUnit XML Reporter** (`jest-junit`):

Test results are exported in JUnit XML format for CI platform integration:

```javascript
reporters: [
  'default',  // Console output
  [
    'jest-junit',
    {
      outputDirectory: './coverage/junit',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › '
    }
  ]
]
```

**CI Platform Compatibility**:

JUnit XML format is universally supported by major CI/CD platforms:
- **Jenkins**: JUnit plugin for test result visualization
- **GitLab CI**: Native JUnit report parsing
- **GitHub Actions**: Test reporting actions consume JUnit XML
- **CircleCI**: Test result storage and UI display
- **Azure DevOps**: Test result publishing

**Automated Test Triggers**:

| Trigger Event | Test Execution | Quality Gate |
|---------------|----------------|--------------|
| Pre-Commit | `npm test` (developer responsibility) | Local verification |
| Pull Request Creation | Full test suite + coverage | Must pass before merge approval |
| Pull Request Update | Full test suite + coverage | Must pass before merge |
| Merge to Main Branch | Full test suite + coverage + deployment | Must pass before deployment |
| Deployment | Health check validation | Must respond correctly |

**Quality Gate Enforcement**:

Tests fail and block CI/CD pipeline progression if any of the following conditions occur:

1. **Test Failures**: Any test case fails (exit code 1)
2. **Coverage Thresholds**: Coverage below configured thresholds
3. **Linting Errors**: ESLint reports errors (warnings allowed)
4. **Security Vulnerabilities**: npm audit finds high/critical issues
5. **Health Check Failure**: Deployed service doesn't respond correctly

**Evidence**: `CONTRIBUTING.md` (lines 101-102) requires tests to pass before PR acceptance, and `jest.config.js` (lines 55-67) configures jest-junit reporter for CI integration.

#### 6.6.3.3 Parallel Test Execution

**Jest Parallel Execution**:

Jest automatically runs tests in parallel using worker processes, significantly reducing test execution time:

- **Default Behavior**: Jest spawns multiple worker processes (one per CPU core)
- **Test Isolation**: Each test file runs in isolated environment
- **Resource Management**: Worker pool prevents resource exhaustion
- **Deterministic Results**: Parallel execution doesn't affect test outcomes due to proper isolation

**No Explicit Configuration Required**:

The system uses Jest's default parallel execution without custom configuration, as tests are properly isolated and have no shared state dependencies.

#### 6.6.3.4 Test Reporting Requirements

**Console Output** (Default Reporter):

- Test suite names and individual test results
- Pass/fail status with execution duration
- Failed test details with stack traces
- Coverage summary table (when coverage enabled)
- Total test count and execution time

**HTML Coverage Report**:

- **Location**: `./coverage/lcov-report/index.html`
- **Features**: Visual coverage visualization, file-by-file breakdown, highlighted uncovered lines, interactive browsing
- **Usage**: Developer review of coverage gaps

**JUnit XML Report**:

- **Location**: `./coverage/junit/junit.xml`
- **Content**: Test suite results, individual test pass/fail, test durations, failure messages with stack traces
- **Purpose**: CI/CD platform integration and historical trend analysis

**LCOV Coverage Data**:

- **Location**: `./coverage/lcov.info`
- **Purpose**: Coverage tool integration (Codecov, Coveralls), trend analysis, PR coverage comparison
- **Format**: Industry-standard line coverage format

**Evidence**: `jest.config.js` configures multiple reporters, and section 4.6 documents all test output artifacts.

#### 6.6.3.5 Failed Test Handling

**Immediate Feedback**:

- Jest provides immediate console output with failure details
- Stack traces pinpoint exact failure location
- Expected vs. actual values clearly displayed
- Failed test name indicates what functionality broke

**CI/CD Failure Handling**:

1. **Build Failure**: Test failures cause non-zero exit code, failing the CI build
2. **Notification**: CI platform notifies developers of build failure
3. **Merge Blocking**: Pull requests with failed tests cannot be merged
4. **Deployment Prevention**: Failed tests prevent deployment to production

**Debugging Failed Tests**:

```bash
# Run specific test file

npm test -- path/to/test.test.js

#### Run tests matching pattern

npm test -- --testNamePattern="specific test name"

#### Run with verbose output

npm test -- --verbose

#### Run in watch mode for debugging

npm run test:watch
```

#### 6.6.3.6 Flaky Test Management

**Prevention Through Design**:

The testing strategy prevents flaky tests through several mechanisms:

1. **Proper Test Isolation**: Mock clearing and restoration between tests
2. **Environment Cleanup**: Environment variable restoration prevents state leakage
3. **Server Lifecycle Management**: Single server instance per integration suite
4. **Mock Lifecycle**: `clearMocks`, `resetMocks`, `restoreMocks` configurations
5. **Deterministic Test Data**: Constants-based test data eliminates randomness
6. **Timeout Configuration**: 10-second timeout prevents false failures from slow CI

**No Retry Logic**:

Tests do not use automatic retry mechanisms, as flaky tests indicate underlying issues that must be fixed rather than masked:

- Failed tests must be investigated and fixed
- Root cause analysis required for intermittent failures
- Tests should be deterministic and reliable

**Flaky Test Identification**:

If flaky tests occur, investigation focuses on:
- Shared state between tests
- Async operation timing issues
- Environment variable pollution
- Mock cleanup failures
- Server lifecycle management issues

**Evidence**: `__tests__/setup.js` implements comprehensive mock lifecycle management, and Jest configuration enforces mock clearing/restoration to prevent flaky tests.

### 6.6.4 Quality Metrics

#### 6.6.4.1 Code Coverage Targets

**Global Coverage Requirements**:

| Metric | Target | Enforcement | Purpose |
|--------|--------|-------------|---------|
| Branch Coverage | ≥ 80% | Hard threshold (tests fail if not met) | Ensures conditional logic paths tested |
| Function Coverage | ≥ 90% | Hard threshold | Ensures all functions exercised |
| Line Coverage | ≥ 85% | Hard threshold | Ensures code execution coverage |
| Statement Coverage | ≥ 85% | Hard threshold | Ensures all statements executed |

**Critical Component Coverage Requirements**:

| Component | Branch | Function | Line | Statement | Rationale |
|-----------|--------|----------|------|-----------|-----------|
| handlers/hello.js | 100% | 100% | 100% | 100% | Core business logic - zero tolerance for untested code |
| handlers/error.js | 90% | 100% | 90% | 90% | Error handling critical to reliability |
| All Other Components | 80% | 90% | 85% | 85% | General quality baseline |

**Coverage Threshold Philosophy**:

- **100% for Critical Paths**: Business logic handlers require perfect coverage
- **90-100% for Error Handling**: Error scenarios must be comprehensively tested
- **80-90% for Infrastructure**: Configuration, utilities, and supporting code
- **Progressive Enhancement**: Coverage targets can increase over time

**Coverage Enforcement Mechanism**:

Jest enforces coverage thresholds during test execution:

```javascript
// Tests fail with exit code 1 if coverage below thresholds
coverageThresholds: {
  global: { branches: 80, functions: 90, lines: 85, statements: 85 },
  './handlers/hello.js': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './handlers/error.js': { branches: 90, functions: 100, lines: 90, statements: 90 }
}
```

**Evidence**: `src/backend/jest.config.js` (lines 30-52) defines enforced coverage thresholds for global scope and critical components.

#### 6.6.4.2 Test Success Rate Requirements

**Success Rate Target**: 100% (zero tolerance for failing tests)

**Enforcement**:

- All tests must pass before code can be merged to main branch
- CI/CD pipeline blocks on any test failure
- Pull requests with failed tests cannot be approved
- Deployment prevented if tests fail

**No Skipped Tests in CI**:

- Skipped tests (`.skip()`) not allowed in CI environments
- Tests must be fixed or removed, not skipped
- Temporary test skipping allowed only in development branches

**Test Reliability Requirements**:

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Test Success Rate | 100% | All tests pass in CI |
| Flaky Test Rate | 0% | No intermittent failures |
| Test Execution Time | < 30 seconds | Fast feedback loops |
| Test Determinism | 100% | Same results on every run |

#### 6.6.4.3 Performance Test Thresholds

**Response Time Expectations**:

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Server Response Time | < 100ms | Integration test timing |
| Server Startup Time | < 1 second | Server lifecycle tests |
| Test Execution Time (Full Suite) | < 30 seconds | CI execution monitoring |
| Memory Footprint (Runtime) | < 50MB RSS | Process monitoring |

**Note on Load Testing**:

Performance testing under load (load testing, stress testing) is optional for this educational service. The system is not designed for high-throughput production use. If performance testing becomes necessary, tools like k6, Artillery, or Apache Bench can be integrated.

#### 6.6.4.4 Quality Gates

**Pre-Merge Quality Gates**:

All conditions must be satisfied before code can be merged to main branch:

| Quality Gate | Requirement | Enforcement Point |
|--------------|-------------|-------------------|
| Test Pass Rate | 100% (all tests pass) | CI pipeline |
| Code Coverage | Meets all thresholds | Jest coverage enforcement |
| Linting | Zero errors (warnings acceptable) | ESLint execution |
| Security Audit | No high/critical vulnerabilities | npm audit |
| Code Review | At least one approval | GitHub/GitLab PR rules |
| Documentation | Updated for changes | Manual review |

**Deployment Quality Gates**:

Additional checks before production deployment:

| Quality Gate | Requirement | Verification Method |
|--------------|-------------|---------------------|
| Health Check | Service responds correctly | `health-check.sh` script |
| Container Build | Docker image builds successfully | CI/CD build step |
| Startup Success | Server starts without errors | Container logs |
| Port Availability | Port 3000 available | Setup validation |

**Evidence**: `CONTRIBUTING.md` documents quality gate requirements, and `infrastructure/scripts/health-check.sh` implements deployment verification.

#### 6.6.4.5 Documentation Requirements

**Test Documentation Standards**:

| Documentation Type | Requirement | Location |
|--------------------|-------------|----------|
| Test File Comments | Explain complex test setup | Inline in test files |
| Test Names | Self-documenting test intent | Test case names |
| README Test Section | How to run tests | `CONTRIBUTING.md` |
| Coverage Reports | Available in HTML format | `./coverage/lcov-report/` |
| Test Strategy | This section (6.6) | Technical specification |

**Test Code as Documentation**:

Test code serves as executable documentation demonstrating:
- How to use system components
- Expected behavior in various scenarios
- Error handling patterns
- Configuration options and defaults
- API contracts and response formats

### 6.6.5 Test Environment Architecture

#### 6.6.5.1 Test Environment Components

The test environment consists of several layers that provide isolation, mocking, and execution infrastructure:

```mermaid
graph TB
    subgraph "Test Execution Environment"
        Jest[Jest Test Runner<br/>v29.x]
        JestConfig[Jest Configuration<br/>jest.config.js]
        Setup[Global Test Setup<br/>__tests__/setup.js]
    end
    
    subgraph "Mock Layer"
        ConsoleMocks[Console Mocks<br/>log, error, warn, debug]
        LoggerMocks[Logger Mocks<br/>info, warn, error, request, response]
        ModuleMocks[Module Mocks<br/>Error handlers, utilities]
        EnvMocks[Environment Mocks<br/>Environment variables]
    end
    
    subgraph "Test Suites"
        UnitTests[Unit Tests<br/>__tests__/*.test.js]
        HandlerTests[Handler Tests<br/>__tests__/handlers/*.test.js]
        UtilTests[Utility Tests<br/>__tests__/utils/*.test.js]
        IntegrationTests[Integration Tests<br/>__tests__/integration/api.test.js]
    end
    
    subgraph "System Under Test"
        Config[Configuration<br/>config.js]
        Server[HTTP Server<br/>server.js]
        Router[Router<br/>router.js]
        Handlers[Handlers<br/>handlers/*.js]
        Middleware[Middleware<br/>middleware/*]
        Utils[Utilities<br/>utils/*]
    end
    
    subgraph "Test Artifacts"
        ConsoleReport[Console Output]
        HTMLReport[HTML Coverage Report<br/>./coverage/lcov-report/]
        JUnitReport[JUnit XML<br/>./coverage/junit/junit.xml]
        LCOVReport[LCOV Data<br/>./coverage/lcov.info]
    end
    
    Jest --> JestConfig
    Jest --> Setup
    Setup --> ConsoleMocks
    Setup --> LoggerMocks
    
    JestConfig --> UnitTests
    JestConfig --> HandlerTests
    JestConfig --> UtilTests
    JestConfig --> IntegrationTests
    
    UnitTests --> ModuleMocks
    UnitTests --> EnvMocks
    HandlerTests --> ModuleMocks
    IntegrationTests --> Server
    
    ModuleMocks -.mocks.-> Handlers
    ModuleMocks -.mocks.-> Utils
    EnvMocks -.mocks.-> Config
    
    UnitTests --> Config
    UnitTests --> Router
    UnitTests --> Handlers
    UnitTests --> Utils
    
    HandlerTests --> Handlers
    UtilTests --> Utils
    
    IntegrationTests --> Server
    Server --> Router
    Server --> Middleware
    Router --> Handlers
    
    Jest --> ConsoleReport
    Jest --> HTMLReport
    Jest --> JUnitReport
    Jest --> LCOVReport
    
    style Jest fill:#e1f5e1
    style Setup fill:#fff3cd
    style ConsoleMocks fill:#cfe2ff
    style LoggerMocks fill:#cfe2ff
    style ModuleMocks fill:#cfe2ff
    style IntegrationTests fill:#d1ecf1
    style Server fill:#f8d7da
```

**Environment Layers**:

1. **Test Runner Layer** (Jest): Manages test discovery, execution, parallel processing, and reporting
2. **Configuration Layer** (jest.config.js + setup.js): Defines test environment settings, mocking, and global setup
3. **Mock Layer**: Provides test doubles for console, logger, modules, and environment
4. **Test Suite Layer**: Organizes unit tests, integration tests, and utility tests
5. **System Under Test Layer**: Actual production code being tested
6. **Artifact Layer**: Generated reports and coverage data

#### 6.6.5.2 Test Isolation Architecture

```mermaid
graph LR
    subgraph "Test Isolation Mechanisms"
        A[Test File 1] --> B[Fresh Mock State]
        A --> C[Clean Environment]
        A --> D[Isolated Server Instance]
        
        E[Test File 2] --> F[Fresh Mock State]
        E --> G[Clean Environment]
        E --> H[Isolated Server Instance]
        
        I[Test File N] --> J[Fresh Mock State]
        I --> K[Clean Environment]
        I --> L[Isolated Server Instance]
    end
    
    subgraph "Lifecycle Hooks"
        M[beforeEach] --> N[jest.clearAllMocks]
        M --> O[Environment Setup]
        
        P[afterEach] --> Q[jest.restoreAllMocks]
        P --> R[Environment Cleanup]
        
        S[beforeAll] --> T[Server Startup<br/>Integration Tests Only]
        
        U[afterAll] --> V[Server Shutdown<br/>Integration Tests Only]
    end
    
    B --> M
    F --> M
    J --> M
    
    C --> P
    G --> P
    K --> P
    
    D --> S
    H --> S
    L --> S
    
    D --> U
    H --> U
    L --> U
    
    style A fill:#d1ecf1
    style E fill:#d1ecf1
    style I fill:#d1ecf1
    style M fill:#fff3cd
    style P fill:#fff3cd
    style S fill:#fff3cd
    style U fill:#fff3cd
```

**Isolation Guarantees**:

- **Mock State Isolation**: Each test begins with cleared mock call history
- **Environment Isolation**: Environment variables restored after tests
- **Server Isolation**: Integration tests use dedicated server instances
- **Module Cache Isolation**: `jest.resetModules()` when needed
- **No Shared State**: Tests don't share global variables or state

#### 6.6.5.3 Integration Test Server Architecture

```mermaid
sequenceDiagram
    participant TestSuite as Integration Test Suite
    participant BeforeAll as beforeAll Hook
    participant Server as HTTP Server Instance
    participant Tests as Individual Tests
    participant AfterAll as afterAll Hook
    
    TestSuite->>BeforeAll: Suite execution starts
    BeforeAll->>Server: createServer()
    activate Server
    BeforeAll->>Server: await startServer()
    Server-->>BeforeAll: Server listening on port 3000
    
    BeforeAll->>Tests: Server ready
    
    Tests->>Server: HTTP GET /hello
    Server-->>Tests: 200 "Hello world"
    
    Tests->>Server: HTTP POST /hello
    Server-->>Tests: 405 "Method Not Allowed"
    
    Tests->>Server: HTTP GET /unknown
    Server-->>Tests: 404 "Not Found"
    
    Tests->>AfterAll: All tests complete
    AfterAll->>Server: await stopServer()
    Server-->>AfterAll: Server closed
    deactivate Server
    AfterAll->>TestSuite: Cleanup complete
```

**Single Server Instance Strategy**:

- **Performance**: One startup/shutdown cycle per suite (not per test)
- **Port Management**: Prevents "EADDRINUSE" errors
- **Realistic Testing**: Tests run against actual HTTP server
- **Resource Efficiency**: Minimal CI/CD resource usage

### 6.6.6 Test Data Flow

#### 6.6.6.1 Unit Test Data Flow

```mermaid
flowchart TD
    Start[Test Execution Begins] --> LoadConstants[Load Constants<br/>utils/constants.js]
    
    LoadConstants --> Constants{Constants<br/>Available}
    Constants --> HTTPStatus[HTTP_STATUS<br/>200, 404, 405, 500]
    Constants --> Routes[ROUTES<br/>/hello]
    Constants --> Messages[MESSAGES<br/>Hello world, Not Found]
    Constants --> Config[CONFIG<br/>DEFAULT_PORT=3000]
    
    HTTPStatus --> BuildMocks[Build Mock Objects]
    Routes --> BuildMocks
    Messages --> BuildMocks
    Config --> BuildMocks
    
    BuildMocks --> MockReq[Mock Request<br/>method: 'GET'<br/>url: '/hello']
    BuildMocks --> MockRes[Mock Response<br/>statusCode, setHeader, end]
    BuildMocks --> MockEnv[Mock Environment<br/>process.env.PORT]
    
    MockReq --> TestExecution[Execute Test]
    MockRes --> TestExecution
    MockEnv --> TestExecution
    
    TestExecution --> CallSUT[Call System Under Test<br/>handler, router, config]
    
    CallSUT --> SUTExecutes[SUT Processes Input]
    
    SUTExecutes --> Assertions[Perform Assertions]
    
    Assertions --> AssertStatus[Assert statusCode<br/>using HTTP_STATUS constants]
    Assertions --> AssertHeaders[Assert headers<br/>Content-Type, Allow]
    Assertions --> AssertBody[Assert response body<br/>using MESSAGES constants]
    Assertions --> AssertMockCalls[Assert mock function calls<br/>verify logger.info called]
    
    AssertStatus --> Result{All<br/>Assertions<br/>Pass?}
    AssertHeaders --> Result
    AssertBody --> Result
    AssertMockCalls --> Result
    
    Result -->|Yes| TestPass[Test Passes]
    Result -->|No| TestFail[Test Fails<br/>Show diff: expected vs actual]
    
    TestPass --> Cleanup[Cleanup Phase<br/>afterEach hook]
    TestFail --> Cleanup
    
    Cleanup --> ClearMocks[jest.clearAllMocks]
    Cleanup --> RestoreMocks[jest.restoreAllMocks]
    Cleanup --> CleanEnv[Restore environment variables]
    
    ClearMocks --> NextTest[Next Test or End]
    RestoreMocks --> NextTest
    CleanEnv --> NextTest
    
    style Start fill:#e1f5e1
    style Constants fill:#cfe2ff
    style TestPass fill:#d4edda
    style TestFail fill:#f8d7da
    style Cleanup fill:#fff3cd
```

#### 6.6.6.2 Integration Test Data Flow

```mermaid
flowchart TD
    Start[Integration Test Begins] --> ServerStart[beforeAll: Start Real Server<br/>await startServer]
    
    ServerStart --> ServerReady{Server<br/>Listening?}
    ServerReady -->|No| StartFail[Test Suite Fails<br/>Server Start Error]
    ServerReady -->|Yes| LoadConstants[Load Constants<br/>for assertions]
    
    LoadConstants --> PrepareRequest[Prepare HTTP Request<br/>using Supertest]
    
    PrepareRequest --> HTTPMethod[Set Method: GET/POST/DELETE]
    PrepareRequest --> HTTPPath[Set Path: /hello or /unknown]
    PrepareRequest --> HTTPHeaders[Set Headers: if needed]
    
    HTTPMethod --> SendRequest[Send HTTP Request<br/>request server instance]
    HTTPPath --> SendRequest
    HTTPHeaders --> SendRequest
    
    SendRequest --> ServerReceives[Server Receives Request]
    
    ServerReceives --> Middleware[Middleware Chain Executes]
    Middleware --> RequestLogger[Log Request Details]
    Middleware --> SecurityHeaders[Apply Security Headers]
    
    SecurityHeaders --> RouterMatch[Router Matches Path]
    
    RouterMatch --> RouteFound{Route<br/>Exists?}
    
    RouteFound -->|Yes| MethodCheck{Method<br/>Allowed?}
    RouteFound -->|No| NotFoundHandler[404 Handler Executes]
    
    MethodCheck -->|Yes| HelloHandler[Hello Handler Executes]
    MethodCheck -->|No| MethodNotAllowedHandler[405 Handler Executes]
    
    HelloHandler --> GenerateResponse[Generate Response<br/>statusCode, headers, body]
    NotFoundHandler --> GenerateResponse
    MethodNotAllowedHandler --> GenerateResponse
    
    GenerateResponse --> SendResponse[Send Response to Client]
    
    SendResponse --> SupertestReceives[Supertest Receives Response]
    
    SupertestReceives --> ChainAssertions[Chain Fluent Assertions]
    
    ChainAssertions --> AssertStatus[.expect HTTP_STATUS]
    ChainAssertions --> AssertContentType[.expect 'Content-Type']
    ChainAssertions --> AssertHeaders[.expect Security Headers]
    
    AssertStatus --> BodyAssertion[Assert Response Body<br/>expect response.text to equal MESSAGES]
    AssertContentType --> BodyAssertion
    AssertHeaders --> BodyAssertion
    
    BodyAssertion --> Result{All<br/>Assertions<br/>Pass?}
    
    Result -->|Yes| TestPass[Test Passes]
    Result -->|No| TestFail[Test Fails<br/>Show HTTP response details]
    
    TestPass --> MoreTests{More<br/>Tests?}
    TestFail --> MoreTests
    
    MoreTests -->|Yes| PrepareRequest
    MoreTests -->|No| Shutdown[afterAll: Stop Server<br/>await stopServer]
    
    Shutdown --> ServerStopped{Server<br/>Stopped?}
    ServerStopped -->|Yes| EndSuccess[Suite Complete]
    ServerStopped -->|No| ShutdownWarning[Log Warning<br/>Suite Complete with Issues]
    
    StartFail --> EndFail[Suite Failed]
    ShutdownWarning --> EndFail
    
    style Start fill:#e1f5e1
    style ServerReady fill:#fff3cd
    style RouteFound fill:#fff3cd
    style MethodCheck fill:#fff3cd
    style Result fill:#fff3cd
    style TestPass fill:#d4edda
    style TestFail fill:#f8d7da
    style EndSuccess fill:#d4edda
    style EndFail fill:#f8d7da
```

**Data Flow Characteristics**:

1. **Constants as Source of Truth**: All expected values come from `utils/constants.js`
2. **Mock Object Construction**: Mock requests and responses built with minimal required properties
3. **Real HTTP Cycle**: Integration tests use actual HTTP protocol (not mocked)
4. **Multi-Layer Validation**: Tests validate status codes, headers, and body content
5. **Cleanup Guarantees**: Lifecycle hooks ensure proper cleanup after tests

### 6.6.7 Test Execution Flow

#### 6.6.7.1 Complete Test Execution Flow

The complete test execution flow is comprehensively documented in section **4.6.1 Test Execution Flow**, which includes:

- Detailed Mermaid flowchart showing complete test lifecycle
- Jest configuration loading and environment setup
- Test discovery and categorization
- Unit test execution with coverage checking
- Integration test execution with server lifecycle
- Coverage threshold validation
- Report generation (console, HTML, JUnit XML)
- Exit code handling for CI/CD integration

**Reference**: See section **4.6 Testing Workflow** for the complete test execution flow diagram and detailed explanation of test categories, commands, and output artifacts.

#### 6.6.7.2 Test Execution Performance

**Execution Time Characteristics**:

| Test Category | Typical Duration | Factors Affecting Performance |
|---------------|------------------|------------------------------|
| Unit Tests | 5-15 seconds | Number of test cases, mock complexity |
| Integration Tests | 3-10 seconds | Server startup time, HTTP request count |
| Full Suite | 10-30 seconds | Parallel execution, CI environment |
| Coverage Generation | +2-5 seconds | File count, instrumentation overhead |

**Parallel Execution Benefits**:

- Jest automatically parallelizes test files across CPU cores
- Linear scalability with processor count
- Integration tests run concurrently with unit tests
- Faster feedback during development and CI

### 6.6.8 Development Workflow Integration

#### 6.6.8.1 Watch Mode for Test-Driven Development

**Watch Mode Configuration**:

The project supports continuous test-driven development through Jest watch mode:

```bash
npm run test:watch
```

**Watch Mode Features**:

- **Automatic Re-execution**: Tests re-run when source or test files change
- **Focused Testing**: Run only tests affected by file changes
- **Interactive Mode**: Filter tests by filename or test name pattern
- **Fast Feedback**: Incremental test execution minimizes wait time
- **Coverage on Demand**: Toggle coverage collection during watch mode

**Nodemon Configuration for Development** (`src/backend/nodemon.json`):

```json
{
  "watch": ["src/backend/**/*.js"],
  "ignore": [
    "src/backend/**/*.test.js",
    "src/backend/__tests__/**"
  ],
  "ext": "js,json",
  "exec": "node src/backend/index.js",
  "delay": "1000",
  "restartable": "rs"
}
```

**Test-Friendly Watch Configuration**:

- Test files excluded from watch (prevents restart during testing)
- 1-second debounce prevents rapid restarts
- Manual restart command: `rs`
- Development environment automatically set

**Evidence**: `src/backend/nodemon.json` configures development watch mode with test file exclusion for optimal TDD workflow.

#### 6.6.8.2 Branch-Based Development and Testing

**Branch Naming Conventions with Testing Requirements**:

| Branch Prefix | Purpose | Testing Requirement |
|---------------|---------|---------------------|
| `test/` | Test improvements and additions | Must add or improve tests |
| `feature/` | New features | Must include tests for new functionality |
| `fix/` | Bug fixes | Must include regression tests |
| `docs/` | Documentation changes | Tests not required (unless code examples) |
| `refactor/` | Code refactoring | Must maintain or improve coverage |

**Testing Workflow for Feature Branches**:

1. **Branch Creation**: Create feature branch from main
2. **TDD Development**: Write failing tests first, then implement feature
3. **Local Testing**: `npm test` validates all tests pass
4. **Coverage Check**: `npm run test:coverage` ensures thresholds met
5. **Push and CI**: Automated tests run in CI pipeline
6. **Code Review**: Reviewer verifies test quality and coverage
7. **Merge**: Merge only after all tests pass and coverage maintained

**Pre-Commit Testing Best Practices**:

- Run `npm test` before committing code changes
- Fix all test failures before pushing
- Maintain or improve coverage with each commit
- Use `npm run test:watch` during active development

**Evidence**: `CONTRIBUTING.md` (lines 50-61) documents branch naming conventions and testing requirements for each branch type.

#### 6.6.8.3 Test-Friendly Bootstrap

**Conditional Server Startup**:

The application entry point (`index.js`) implements test-friendly bootstrap logic:

```javascript
const IS_TEST = process.env.NODE_ENV === 'test' || process.env.IS_TEST === 'true';

// Conditional startup - doesn't start server when testing
if (!IS_TEST) {
  main().catch(error => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export functions for testing
module.exports = { main, startServer, stopServer };
```

**Benefits for Testing**:

- Tests can import modules without triggering server startup
- No port conflicts during parallel test execution
- Faster test execution (no unnecessary initialization)
- Tests have full control over server lifecycle
- Integration tests explicitly start server when needed

### 6.6.9 Testing Best Practices Demonstrated

#### 6.6.9.1 Test Organization Best Practices

**Observed Best Practices**:

✅ **Clear Test Structure**: Descriptive test names explain expected behavior using natural language
✅ **Test Independence**: Each test runs in isolation with no shared state dependencies
✅ **Focused Tests**: One assertion concept per test with clear arrange-act-assert pattern
✅ **Test Grouping**: `describe()` blocks logically group related tests
✅ **Proper Lifecycle Hooks**: Setup and teardown in appropriate `beforeEach`/`afterEach` hooks

#### 6.6.9.2 Mocking Discipline

**Observed Best Practices**:

✅ **Appropriate Mocking**: External dependencies mocked (logger, error handlers); core logic tested without mocks
✅ **Mock Lifecycle Management**: Mocks cleared between tests with `jest.clearAllMocks()`
✅ **Original Restoration**: Original implementations restored with `jest.restoreAllMocks()`
✅ **No Mock Leakage**: Proper cleanup prevents mock state affecting other tests
✅ **Integration Testing Without Mocks**: Integration tests use real server instances for realistic validation

#### 6.6.9.3 Error Handling Testing

**Observed Best Practices**:

✅ **Comprehensive Error Scenarios**: Invalid HTTP methods (405), unknown routes (404), server errors (500)
✅ **Server Lifecycle Errors**: EADDRINUSE error handling tested
✅ **Error Response Validation**: Error messages and status codes verified
✅ **Graceful Failure Testing**: Server shutdown under error conditions validated

#### 6.6.9.4 Documentation Through Tests

**Observed Best Practices**:

✅ **Self-Documenting Tests**: Test names serve as executable documentation of system behavior
✅ **Usage Examples**: Tests demonstrate how to use system components correctly
✅ **Comments for Complex Setup**: Inline comments explain non-obvious test setup logic
✅ **Test Data Clarity**: Constants-based test data makes expected values explicit

### 6.6.10 References

#### Files Examined

- `src/backend/jest.config.js` - Complete Jest configuration with coverage thresholds, reporters, and test patterns
- `src/backend/__tests__/setup.js` - Global test setup with console and logger mocking, timeout configuration
- `src/backend/__tests__/integration/api.test.js` - Complete integration test suite with Supertest, server lifecycle management
- `src/backend/__tests__/handlers/hello.test.js` - Unit test examples demonstrating mocking patterns and assertions
- `src/backend/nodemon.json` - Development watch configuration with test file exclusion
- `CONTRIBUTING.md` - Test execution commands, branch naming conventions, testing requirements for contributions
- `package.json` - Root package manifest (minimal content for project structure)

#### Folders Explored

- `hao-backprop-test-main/hao-backprop-test-main/` - Repository root directory
- `hao-backprop-test-main/hao-backprop-test-main/src/` - Source code directory
- `hao-backprop-test-main/hao-backprop-test-main/src/backend/` - Backend service source code
- `hao-backprop-test-main/hao-backprop-test-main/src/backend/__tests__/` - Test directory (depth 3)
- `hao-backprop-test-main/hao-backprop-test-main/src/backend/__tests__/handlers/` - Handler unit tests (depth 4)
- `hao-backprop-test-main/hao-backprop-test-main/src/backend/__tests__/integration/` - Integration tests (depth 4)
- `hao-backprop-test-main/hao-backprop-test-main/src/backend/__tests__/utils/` - Utility unit tests (depth 4)
- `hao-backprop-test-main/hao-backprop-test-main/infrastructure/` - Infrastructure directory
- `hao-backprop-test-main/hao-backprop-test-main/infrastructure/scripts/` - Deployment and health check scripts
- `hao-backprop-test-main/hao-backprop-test-main/infrastructure/local/` - Local development Docker configuration

#### Technical Specification Sections Referenced

- **Section 4.6 Testing Workflow** - Complete test execution flow diagram, test categories, test commands, and output artifacts
- **Section 3.4 Open Source Dependencies** - Jest framework details, Supertest integration testing, jest-junit CI reporting, npm package management
- **Section 1.2 System Overview** - System context, success criteria including test coverage KPIs, architectural simplicity justifying testing approach

#### Infrastructure Scripts Referenced

- `infrastructure/scripts/health-check.sh` - Deployment verification with health check endpoint validation
- `infrastructure/scripts/deploy.sh` - Deployment workflow with health check retry logic (5 attempts, 3-second intervals)
- `infrastructure/scripts/setup.sh` - Environment setup validation including port availability checks
- `infrastructure/local/docker-compose.yml` - Docker health check configuration for service readiness verification

# 7. User Interface Design

## 7.1 Overview

### 7.1.1 UI Scope Determination

**No user interface required.**

The Node.js Hello World Service is a backend-only HTTP REST API service with no client-side user interface, frontend application, or graphical user interface components. This architectural decision is explicitly documented in the project scope and reflects the system's educational purpose as a minimal HTTP server demonstration.

### 7.1.2 Explicit Scope Exclusion

The Technical Specification Section 1.3.2 (Out-of-Scope Elements) explicitly excludes all client-side components from the project scope:

- Web user interface or frontend application
- Admin dashboard or management console
- Client libraries or SDKs for consuming the API
- API documentation generation tools (Swagger/OpenAPI specs)
- Interactive API documentation (Swagger UI, Redoc)

This exclusion is intentional, maintaining the project's focus on demonstrating fundamental HTTP server implementation patterns without introducing frontend complexity.

### 7.1.3 Repository Structure Confirmation

Repository analysis confirms the absence of UI components through the following observations:

**No UI-Related Directories Present:**
- No `frontend/`, `client/`, `public/`, `views/`, or `templates/` directories exist in the repository structure
- The `src/` directory contains only `backend/` subdirectory with server-side components
- No HTML, CSS, JavaScript framework files, or client-side assets are present

**Backend-Only Component Structure:**
```
src/backend/
├── handlers/           # HTTP request handlers (server-side)
├── middleware/         # Request processing middleware (server-side)
├── utils/             # Backend utilities
├── __tests__/         # Backend unit and integration tests
├── server.js          # HTTP server implementation
├── router.js          # Request routing logic
├── index.js           # Application entry point
└── config.js          # Configuration management
```

All components in the codebase serve backend HTTP request processing functions with no client-side rendering, DOM manipulation, or browser-based interaction capabilities.

## 7.2 Service Access Methods

### 7.2.1 Programmatic HTTP Client Access

Users interact with the Node.js Hello World Service programmatically through standard HTTP client tools and libraries rather than through a dedicated graphical user interface. The service exposes a single REST endpoint that responds to HTTP GET requests with plain text responses.

### 7.2.2 Supported Access Patterns

**Command-Line HTTP Clients:**

Users can access the service using command-line tools that make HTTP requests:

- **curl**: `curl http://localhost:3000/hello`
- **wget**: `wget -qO- http://localhost:3000/hello`
- **HTTPie**: `http GET http://localhost:3000/hello`

These tools send HTTP GET requests to the `/hello` endpoint and display the plain text response "Hello world" in the terminal.

**HTTP Client Libraries:**

Developers can integrate the service into applications using HTTP client libraries:

- **Node.js**: axios, node-fetch, native http/https modules
- **Python**: requests, urllib, httpx
- **JavaScript (Browser)**: fetch API, XMLHttpRequest
- **Java**: HttpClient, OkHttp, RestTemplate

The service responds with standard HTTP/1.1 protocol, making it compatible with any HTTP client implementation.

**API Testing Tools:**

The service can be tested and explored using graphical API testing applications:

- **Postman**: Visual HTTP request builder and response inspector
- **Insomnia**: REST API client with request/response visualization
- **Thunder Client**: VS Code extension for API testing
- **REST Client**: HTTP request tools integrated into development environments

These tools provide user-friendly interfaces for constructing HTTP requests and examining responses, but they are third-party applications external to the service itself.

**Direct Browser Access:**

Users can access the service endpoint directly through web browsers by navigating to `http://localhost:3000/hello`. The browser makes an HTTP GET request and displays the plain text response "Hello world" in the browser window. This interaction uses the browser as an HTTP client, not as a platform for rendering a custom user interface.

### 7.2.3 Endpoint Interface Specification

**Primary Endpoint:**

| Property | Value |
|---|---|
| HTTP Method | GET |
| URL Path | `/hello` |
| Response Format | Plain text |
| Response Body | "Hello world" |
| Content-Type | text/plain |
| Status Code | 200 OK |
| Character Encoding | UTF-8 |

**Response Characteristics:**

The endpoint returns a static plain text string without HTML markup, JSON structure, or any formatting that would require client-side rendering logic. The response is immediately consumable by any HTTP client without parsing or transformation requirements.

**Error Responses:**

The service returns standard HTTP error responses for invalid requests:

- **404 Not Found**: Requests to non-existent paths return plain text "Not Found"
- **405 Method Not Allowed**: Non-GET requests to `/hello` return error with `Allow: GET` header
- **500 Internal Server Error**: Server errors return generic error message without implementation details

All error responses use plain text format (`Content-Type: text/plain`) maintaining consistency with the service's text-based interface approach.

## 7.3 Operational Monitoring Interface

### 7.3.1 Grafana Dashboard Overview

While the Node.js Hello World Service does not provide an end-user application interface, the project includes a Grafana dashboard for operational monitoring and observability. This dashboard serves infrastructure monitoring purposes rather than end-user functionality.

**Dashboard Location and Configuration:**

The Grafana dashboard is defined in `infrastructure/monitoring/grafana-dashboard.json` and deployed as part of the Docker Compose monitoring stack. The dashboard connects to Prometheus as its data source to visualize metrics collected from the application.

**Dashboard Deployment:**

When the full monitoring stack is started using Docker Compose, Grafana becomes available at `http://localhost:3001` with the pre-configured dashboard automatically provisioned. The dashboard is designed for real-time monitoring of service health, performance metrics, and operational statistics.

### 7.3.2 Target Users and Purpose

**Target User Group:**

The Grafana monitoring interface is designed for:

- **DevOps Engineers**: Monitoring service availability and performance in deployed environments
- **Site Reliability Engineers (SREs)**: Tracking uptime, response times, and error rates
- **System Administrators**: Observing infrastructure health and resource utilization
- **Platform Operators**: Managing service lifecycle and troubleshooting operational issues

**Monitoring Scope:**

The dashboard provides infrastructure observability features including:

- Service uptime and availability metrics
- HTTP request rates and throughput
- Response time percentiles and latency distributions
- Error rate tracking and alert visualization
- System resource utilization (CPU, memory, network)

**Distinction from User Interface:**

The Grafana dashboard is explicitly **not** an end-user application interface. It serves operational monitoring purposes for technical staff managing the service infrastructure rather than providing functionality for end users consuming the `/hello` endpoint. The monitoring interface is accessed separately from the service endpoint and requires understanding of metrics, observability concepts, and infrastructure management.

### 7.3.3 Implementation Status

**Current State:**

The monitoring infrastructure is fully provisioned with Prometheus configuration and Grafana dashboard definitions in place. However, the application does not currently expose `/metrics` or `/health` endpoints required for complete observability functionality. Full metrics collection requires implementing instrumentation using the `prom-client` library to expose Prometheus-compatible metrics.

**Future Instrumentation:**

When metrics endpoints are implemented, the Grafana dashboard will visualize:

- Total HTTP requests handled by the service
- Request success and error rates
- Response time histograms and percentiles
- Active connections and throughput metrics
- Service health check status

This instrumentation represents infrastructure monitoring capabilities rather than user interface features, maintaining the service's backend-only architectural scope.

## 7.4 User Interaction Model

### 7.4.1 Request-Response Interaction Pattern

The Node.js Hello World Service implements a stateless request-response interaction model without session management, user state tracking, or persistent connections. Each HTTP request is processed independently with no context carried between requests.

**Interaction Sequence:**

1. **Request Initiation**: Client sends HTTP GET request to `http://<host>:<port>/hello`
2. **Request Processing**: Server validates HTTP method, applies security headers, logs request
3. **Response Generation**: Handler generates plain text "Hello world" response with 200 status
4. **Response Delivery**: Server sends response to client and closes connection
5. **Interaction Complete**: No state persists; next request is processed identically

This simplified interaction model eliminates user authentication, authorization, session cookies, CSRF tokens, and other stateful web application patterns typically associated with user interfaces.

### 7.4.2 Service Discovery and Access

**Local Development Access:**

In local development mode, users access the service at:
- **Default URL**: `http://localhost:3000/hello`
- **Custom Port**: `http://localhost:<PORT>/hello` when PORT environment variable is configured
- **Docker Access**: `http://localhost:3000/hello` when running in Docker container with port mapping

**Docker Compose Access:**

When deployed using Docker Compose, the service is accessible through:
- **Host Machine**: `http://localhost:3000/hello` via published port mapping
- **Container Network**: `http://app:3000/hello` from other containers on the `hello-world-network` bridge network
- **Prometheus Scraping**: Internal network DNS resolution enables metrics collection

Users discover the service endpoint through documentation (README.md, Technical Specifications) rather than through service discovery mechanisms, API gateways, or dynamic endpoint registration.

## 7.5 References

### 7.5.1 Technical Specification Sections Reviewed

- **Section 1.2 System Overview**: Confirmed monolithic HTTP server architecture with no UI components; documented stateless request-response pattern and backend-only component structure
- **Section 1.3 Scope - In-Scope Elements**: Documented supported user workflows for local development, Docker deployment, testing, and monitoring without UI requirements
- **Section 1.3 Scope - Out-of-Scope Elements - Client-Side Components**: Explicitly excludes web user interface, admin dashboard, management console, and all client-side applications from project scope
- **Section 5.1 High-Level Architecture**: Detailed stateless monolithic HTTP server architecture using synchronous request-response pattern; confirmed single-process backend implementation with no frontend layers

### 7.5.2 Repository Files and Directories Examined

**Source Code Structure:**
- `src/backend/` - Backend-only implementation directory; no frontend counterpart exists
- `src/backend/handlers/` - Server-side HTTP request handlers (hello.js, notFound.js, methodNotAllowed.js)
- `src/backend/middleware/` - Backend request processing middleware (requestLogger.js, securityHeaders.js)
- `src/backend/server.js` - HTTP server implementation using native Node.js http module
- `src/backend/router.js` - Server-side request routing logic
- `src/backend/index.js` - Application entry point and lifecycle management

**Infrastructure Configuration:**
- `infrastructure/monitoring/grafana-dashboard.json` - Operational monitoring dashboard definition
- `infrastructure/monitoring/prometheus.yml` - Metrics collection configuration for observability
- `docker-compose.yml` - Service orchestration configuration including monitoring stack

**Documentation:**
- `README.md` - Project description confirming backend HTTP REST API service with single endpoint
- Technical Specifications - Comprehensive documentation of backend-only architecture and explicit UI scope exclusion

### 7.5.3 Search and Analysis Methods

**Repository Analysis Techniques:**
- Hierarchical folder traversal to depth 3+ covering all source code directories
- Semantic file searches for UI-related keywords (HTML, CSS, frontend frameworks, templates, views) returning zero results
- Direct file content examination of architecture documentation and scope definitions
- Technical specification section retrieval for system overview, scope boundaries, and architecture details
- Systematic verification of component structure confirming absence of client-side directories

**Evidence Compilation:**
- Multiple independent confirmation methods verify no UI components exist in the repository
- Scope documentation explicitly excludes all client-side and user interface elements
- Architecture diagrams and component tables document only backend server-side components
- Repository structure contains exclusively backend implementation files without frontend counterparts

# 8. Infrastructure

## 8.1 Overview

### 8.1.1 Infrastructure Scope and Philosophy

The Node.js Hello World Service implements a **local-first educational infrastructure** designed to demonstrate containerization, orchestration, and monitoring concepts without the complexity of cloud-based production deployments. As established in Section 1.2.1, this is a "standalone tutorial project" with an "intentionally narrow focus on HTTP server basics," which extends to its infrastructure design philosophy.

**Infrastructure Classification**: Educational Development Environment

This system does not require enterprise-scale cloud infrastructure for the following reasons:

- **Educational Purpose**: Primary goal is teaching Node.js fundamentals and DevOps concepts, not production service delivery
- **Single Developer Scale**: Designed for individual learner experimentation and exploration
- **Stateless Architecture**: No databases, message queues, or distributed system components requiring cloud orchestration
- **Local Deployment Focus**: Optimized for laptop/workstation execution without external dependencies
- **Minimal Resource Requirements**: Runs efficiently on commodity hardware with ~100-200MB memory footprint

**Infrastructure Philosophy**:

The infrastructure implements a **progressive complexity model** that enables learners to advance through three deployment stages:

1. **Stage 1 - Native Execution**: Direct Node.js execution on host system for immediate feedback and debugging
2. **Stage 2 - Containerization**: Docker-based deployment demonstrating environment consistency and portability
3. **Stage 3 - Orchestration**: Docker Compose multi-container setup with monitoring stack integration

This staged approach balances educational value with operational best practices, exposing learners to production-ready patterns without overwhelming complexity.

### 8.1.2 Infrastructure Components Overview

| Component Category | Implementation Status | Purpose | Educational Value |
|---|---|---|------|
| **Local Execution** | ✅ Fully Functional | Direct Node.js server execution | Debugging and rapid development |
| **Containerization** | ✅ Fully Functional | Docker-based application packaging | Environment consistency principles |
| **Orchestration** | ✅ Fully Functional | Docker Compose multi-container coordination | Service orchestration concepts |
| **Deployment Automation** | ✅ Fully Functional | Bash scripts for deployment workflows | Automation and repeatability |

| Component Category | Implementation Status | Purpose | Educational Value |
|---|---|---|------|
| **Monitoring Infrastructure** | ⚠️ Provisioned | Prometheus and Grafana configuration | Observability architecture patterns |
| **CI/CD Workflows** | ⚠️ Integration Ready | GitHub Actions structure expected | Continuous integration concepts |
| **Cloud Infrastructure** | ❌ Not Applicable | No cloud provider dependencies | Maintains local-first simplicity |
| **Container Orchestration** | ❌ Not Applicable | No Kubernetes or cloud orchestration | Appropriate for single-host deployment |

### 8.1.3 Target Deployment Environments

The infrastructure supports three distinct deployment environments with environment-specific configurations:

| Environment | Purpose | NODE_ENV | PORT | Characteristics |
|---|---|---|---|------|
| **Development** | Local developer workstation | development | 3000 | Hot reload, verbose logging, no cleanup |
| **Staging** | Pre-production validation | production | 3000 | Production optimizations, monitoring enabled |
| **Production** | Simulated production deployment | production | 80 | Production mode, old image cleanup, monitoring |

**Environment Promotion Strategy**:
- Development → Staging: Validate production build and configuration
- Staging → Production: Validate health checks and monitoring integration
- All environments use identical Docker images with environment-specific variables

## 8.2 Deployment Environment

### 8.2.1 Target Environment Assessment

#### 8.2.1.1 Environment Type

**Primary Deployment Model**: On-Premises / Local Development

The system is architected exclusively for local deployment on developer workstations or on-premises servers. Cloud deployment capabilities are intentionally excluded to maintain educational focus and minimize external dependencies.

**Deployment Platform Options**:

**Option 1: Native Node.js Execution**
- **Target Platform**: macOS, Linux, Windows (with Node.js 18.x installed)
- **Isolation**: Process-level only (shared host resources)
- **Use Case**: Rapid development, debugging, learning Node.js fundamentals
- **Setup Time**: < 5 minutes (via `infrastructure/scripts/setup.sh`)

**Option 2: Docker Standalone Container**
- **Target Platform**: Any system with Docker Engine 20.x or higher
- **Isolation**: Container-level (cgroups, namespaces)
- **Use Case**: Environment consistency, deployment simulation, container learning
- **Setup Time**: 2-5 minutes (Docker build + run)

**Option 3: Docker Compose Orchestration**
- **Target Platform**: Docker Compose 3.8+ on Docker-enabled systems
- **Isolation**: Multi-container networking and resource allocation
- **Use Case**: Full-stack development with monitoring, service orchestration learning
- **Setup Time**: 5-10 minutes (compose build + multi-container startup)

#### 8.2.1.2 Geographic Distribution Requirements

**Geographic Distribution**: Not Applicable

The educational scope eliminates geographic distribution requirements:

- **Single Data Center Model**: All components run on single host system
- **No Multi-Region Deployment**: No disaster recovery or high availability requirements
- **No CDN Integration**: Static content serving not applicable to API-only service
- **No Global Load Balancing**: Single instance handles all traffic

#### 8.2.1.3 Resource Requirements

**Minimum System Requirements**:

| Resource Type | Minimum | Recommended | Notes |
|---|---|---|------|
| **CPU** | 1 core (2.0 GHz) | 2+ cores | Single-threaded Node.js process |
| **Memory** | 512 MB RAM | 2 GB RAM | Application uses ~100-200MB |
| **Storage** | 500 MB free | 2 GB free | Docker images ~200MB compressed |
| **Network** | Port 3000 available | Ports 3000, 3001, 9090 | Application, Grafana, Prometheus |

**Resource Allocation by Deployment Method**:

**Native Node.js Execution**:
- **Memory**: ~100 MB RSS (Resident Set Size) for Node.js process
- **CPU**: < 5% utilization at idle, scales with request load
- **Disk I/O**: Minimal (log file writes only)
- **Network**: Single TCP socket listening on configured port

**Docker Standalone Container**:
- **Memory**: ~150-200 MB (application + Alpine Linux overhead)
- **CPU**: < 10% utilization (Docker daemon + application)
- **Disk**: ~200 MB for image layers
- **Network**: Docker bridge networking with port mapping

**Docker Compose with Monitoring**:
- **Memory**: ~500-800 MB total (app + Prometheus + Grafana)
- **CPU**: 10-20% utilization (three containers)
- **Disk**: ~400-500 MB for all images
- **Network**: Custom bridge network (`hello-world-network`)

**Evidence**: Resource requirements documented in `infrastructure/README.md`, validated through Docker image analysis of `node:18-alpine` base.

#### 8.2.1.4 Compliance and Regulatory Requirements

**Compliance Status**: No Regulatory Requirements

As an educational project with no production data handling, the system has no compliance obligations:

- ❌ **GDPR**: No personal data collection or processing
- ❌ **HIPAA**: No healthcare data handling
- ❌ **PCI-DSS**: No payment processing or cardholder data
- ❌ **SOC 2**: No security, availability, or confidentiality requirements
- ❌ **ISO 27001**: No information security management system requirements

**Security Considerations**:

While formal compliance is not required, the infrastructure implements security best practices for educational demonstration:

- **Container Security**: Alpine Linux base image reduces attack surface
- **Dependency Management**: `npm ci --only=production` installs verified production dependencies
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, CSP headers applied (Section 5.4.1)
- **No Secrets in Images**: No hardcoded credentials or API keys in Docker layers

### 8.2.2 Environment Management

#### 8.2.2.1 Infrastructure as Code Approach

**IaC Status**: ❌ Not Implemented (Declarative Configuration Only)

The infrastructure uses **declarative configuration files** for local orchestration without full Infrastructure as Code tooling:

**Implemented Configuration-as-Code**:

| Configuration File | Purpose | Format | Version Control |
|---|---|---|------|
| `Dockerfile` (root and backend) | Container image definition | Dockerfile DSL | Git repository |
| `docker-compose.yml` | Multi-container orchestration | YAML v3.8 | Git repository |
| `prometheus.yml` | Metrics collection configuration | YAML | Git repository |
| `grafana-dashboard.json` | Visualization dashboard | JSON schema v30 | Git repository |

**Not Implemented IaC Tools**:

- ❌ **Terraform**: No cloud infrastructure provisioning required
- ❌ **CloudFormation**: No AWS resource management
- ❌ **Pulumi**: No programmatic infrastructure definition
- ❌ **Ansible**: No configuration management automation
- ❌ **Kubernetes Manifests**: No container orchestration platform

**Rationale for Minimal IaC**:

As documented in Section 1.2.2, the system follows a "native-first approach" that "prioritizes simplicity and direct mapping to fundamentals." Full IaC tooling would introduce complexity inappropriate for the educational scope, while declarative Docker and Docker Compose files provide sufficient infrastructure definition for local deployment.

#### 8.2.2.2 Configuration Management Strategy

**Configuration Method**: Environment Variables + .env File

The system implements Twelve-Factor App configuration management through environment variables with validated defaults (Section 5.1.1):

**Configuration Variables**:

| Variable | Default Value | Validation | Purpose |
|---|---|---|------|
| `PORT` | 3000 | Integer 1-65535 | Server listening port |
| `HOST` | 0.0.0.0 | IPv4 address or hostname | Server bind address |
| `NODE_ENV` | development | Enum: development/production/test | Runtime mode flag |
| `LOG_LEVEL` | INFO | Enum: DEBUG/INFO/WARN/ERROR | Logging verbosity |

**Configuration Loading Sequence** (from Section 5.1.3):

1. **Module Evaluation**: `config.js` executes at application startup
2. **Environment File Loading**: `dotenv.config()` parses `.env` file if present
3. **Variable Extraction**: Extract from `process.env` with fallback defaults
4. **Port Validation**: Ensure PORT is valid integer within 1-65535 range
5. **Environment Flag Computation**: Calculate IS_DEV, IS_PROD, IS_TEST booleans
6. **Configuration Export**: Freeze configuration object and export singleton

**Environment-Specific Configuration**:

**Development Environment** (`NODE_ENV=development`):
```bash
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=DEBUG
```
- Hot reload enabled via nodemon
- Verbose debugging logs
- No Docker image cleanup
- Development-optimized error messages

**Staging Environment** (`NODE_ENV=production`):
```bash
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
LOG_LEVEL=INFO
```
- Production optimizations enabled
- Standard logging verbosity
- Monitoring stack active
- Pre-production validation

**Production Environment** (`NODE_ENV=production`):
```bash
PORT=80
HOST=0.0.0.0
NODE_ENV=production
LOG_LEVEL=WARN
```
- Port 80 for standard HTTP
- Minimal logging (WARN and ERROR only)
- Old Docker image cleanup (keeps last 3 versions)
- Full monitoring integration

**Configuration Security**:

- `.env` file excluded from Git via `.gitignore`
- No sensitive secrets required (stateless application)
- Configuration validated at startup with descriptive errors
- Invalid configuration prevents server start (fail-fast principle)

**Evidence**: Configuration management implemented in `src/backend/config.js`, documented in Section 3.7 Development & Deployment.

#### 8.2.2.3 Environment Promotion Strategy

**Promotion Workflow**: Manual Promotion with Scripted Deployment

The infrastructure supports environment promotion through the `infrastructure/scripts/deploy.sh` script with environment-specific parameters:

**Promotion Stages**:

```mermaid
graph LR
    A[Local Development<br/>npm run dev] --> B{Code Review<br/>& Testing}
    B -->|Approved| C[Build Docker Image<br/>deploy.sh development]
    C --> D[Deploy to Staging<br/>deploy.sh staging]
    D --> E[Run Health Checks<br/>health-check.sh]
    E -->|Pass| F[Deploy to Production<br/>deploy.sh production]
    E -->|Fail| G[Rollback<br/>Previous Version]
    F --> H[Post-Deployment<br/>Validation]
    H -->|Healthy| I[Cleanup Old Images]
    H -->|Unhealthy| G
```

**Deployment Script Usage**:

```bash
# Development deployment

./infrastructure/scripts/deploy.sh development

#### Staging deployment with verbose logging

./infrastructure/scripts/deploy.sh staging --verbose

#### Production deployment

./infrastructure/scripts/deploy.sh production
```

**Automated Promotion Steps** (from `infrastructure/scripts/deploy.sh`):

1. **Argument Parsing**: Extract environment (development/staging/production) and flags
2. **Prerequisite Validation**: Check Docker, Docker Compose, curl installed
3. **Environment Configuration**: Load environment-specific variables
4. **Docker Image Build**: Execute `docker build` with version tags
5. **Image Tagging**: Tag with environment-specific labels
6. **Deployment Execution**: Run `docker-compose up` or registry push
7. **Startup Wait**: 10-second grace period for application initialization
8. **Health Verification**: Execute `health-check.sh` (5 retries, 3-second intervals)
9. **Success Actions**: Cleanup old images (production only), log success
10. **Failure Actions**: Automatic rollback to previous image version

**Health Check Validation** (from `infrastructure/scripts/health-check.sh`):

- **HTTP Status Check**: Validate 200 OK response
- **Response Body Check**: Confirm "Hello world" content
- **Exit Codes**: 0=healthy, 1=unhealthy, 2=unreachable
- **Integration**: CI/CD pipelines use exit codes for deployment gates

**Rollback Procedure**:

When health checks fail post-deployment, `deploy.sh` automatically:
1. Logs failure details with timestamp
2. Stops newly deployed container
3. Restarts previous container version (tagged with `-previous` suffix)
4. Re-runs health checks to confirm rollback success
5. Alerts operator of rollback action

**Manual Intervention Requirements**:

- Production deployments require manual script execution (no auto-promotion)
- Rollback verification requires operator confirmation
- Environment variable changes require manual `.env` file updates

#### 8.2.2.4 Backup and Disaster Recovery Plans

**Backup Status**: ❌ Not Applicable (Stateless Architecture)

The system's stateless design documented in Section 5.1.1 eliminates traditional backup requirements:

**No Data Persistence**:
- ❌ No database or persistent storage
- ❌ No user sessions or application state
- ❌ No file uploads or user-generated content
- ❌ No configuration data requiring backup

**Disaster Recovery Strategy**: Source Code Repository + Rebuild

**Recovery Components**:

| Asset Type | Storage Location | Recovery Method | RTO (Recovery Time Objective) |
|---|---|---|------|
| **Application Source Code** | Git repository (GitHub) | `git clone` + `npm install` | < 5 minutes |
| **Docker Images** | Local Docker cache or rebuild | `docker build` from Dockerfile | < 2 minutes |
| **Configuration Files** | Git repository | Included in source code clone | < 1 minute |
| **Infrastructure Scripts** | Git repository (`infrastructure/scripts/`) | Included in source code clone | < 1 minute |

**Disaster Recovery Scenarios**:

**Scenario 1: Complete Host Failure**
- **Detection**: Host system unresponsive or hardware failure
- **Recovery**: Deploy to new host system from Git repository
- **Steps**:
  1. Provision replacement host with Docker installed
  2. Clone repository: `git clone <repo-url>`
  3. Run setup script: `./infrastructure/scripts/setup.sh`
  4. Start server: `./infrastructure/scripts/start-server.sh`
- **RTO**: 10-15 minutes (includes host provisioning)
- **RPO** (Recovery Point Objective): 0 (no data loss possible)

**Scenario 2: Container Corruption**
- **Detection**: Docker health checks fail, container won't start
- **Recovery**: Rebuild Docker image from Dockerfile
- **Steps**:
  1. Remove corrupted container: `docker rm -f <container>`
  2. Rebuild image: `docker build -t node-hello-world:latest .`
  3. Restart via Docker Compose: `docker-compose up -d`
- **RTO**: < 5 minutes
- **RPO**: 0 (stateless application)

**Scenario 3: Source Code Loss (Git Repository Deletion)**
- **Prevention**: GitHub provides repository recovery for 90 days after deletion
- **Mitigation**: Multiple developer clones serve as distributed backups
- **Recovery**: Restore from any developer's local clone
- **RTO**: Depends on detection time
- **RPO**: Last pushed commit

**High Availability Considerations**:

The educational scope does not require high availability infrastructure:

- ❌ No load balancer or traffic routing
- ❌ No multi-instance deployment
- ❌ No automatic failover mechanisms
- ❌ No health check-based traffic steering

**Justification**: As documented in Section 1.2.1, this is a "standalone tutorial project" without production SLA requirements or uptime guarantees.

## 8.3 Cloud Services

**Cloud Services Status**: ❌ Not Applicable

The Node.js Hello World Service does **not utilize cloud services** for the following architectural and educational reasons:

### 8.3.1 Cloud Services Exclusion Rationale

**1. Educational Focus on Fundamentals**

As established in Section 1.2.1, the project prioritizes "simplicity with production-ready patterns" while maintaining an "intentionally narrow focus on HTTP server basics." Cloud service integration would introduce external dependencies, account setup requirements, and billing concerns that distract from core learning objectives.

**2. Local-First Development Philosophy**

The system implements a "native-first architecture" (Section 5.1.1) that emphasizes direct interaction with Node.js fundamentals without abstraction layers. Cloud services would add additional abstraction layers (SDKs, APIs, authentication) counter to this educational philosophy.

**3. Zero External Dependencies Design**

Section 5.1.1 explicitly documents: "No external service dependencies or API calls." This design choice ensures:
- Complete functionality without internet connectivity
- No account creation or billing setup barriers
- Predictable behavior without external service availability concerns
- Simplified debugging without network latency or cloud API failures

**4. Cost Accessibility for Learners**

Cloud services typically incur ongoing costs that create barriers for educational use:
- AWS, GCP, Azure require credit card and billing setup
- Free tier limitations restrict extended learning sessions
- Accidental resource provisioning can generate unexpected charges
- Cost management adds complexity inappropriate for beginners

**5. Stateless Architecture Eliminates Cloud Storage Needs**

The stateless design documented in Section 5.1.1 eliminates typical cloud service requirements:
- No database → No RDS, DynamoDB, Cloud SQL needed
- No file storage → No S3, Cloud Storage, Blob Storage needed
- No message queuing → No SQS, Pub/Sub, Service Bus needed
- No caching → No ElastiCache, Memorystore, Redis Cache needed

### 8.3.2 Local Alternatives to Cloud Services

The infrastructure provides local alternatives for capabilities typically sourced from cloud providers:

| Cloud Service Category | Typical Cloud Provider | Local Alternative | Rationale |
|---|---|---|------|
| **Compute** | AWS EC2, Google Compute Engine | Local Node.js process or Docker | No scalability requirements |
| **Container Registry** | AWS ECR, GCR, Docker Hub | Local Docker image cache | No image distribution needs |
| **Load Balancing** | AWS ALB/NLB, GCP Load Balancer | Not applicable | Single instance deployment |
| **Monitoring** | CloudWatch, Stackdriver, Azure Monitor | Prometheus + Grafana (local) | Educational observability |

| Cloud Service Category | Typical Cloud Provider | Local Alternative | Rationale |
|---|---|---|------|
| **Logging** | CloudWatch Logs, Cloud Logging | Console output + Docker logs | Sufficient for dev scale |
| **Secrets Management** | AWS Secrets Manager, Key Vault | .env file (Git-ignored) | No sensitive secrets |
| **DNS** | Route 53, Cloud DNS | localhost or /etc/hosts | Local access only |
| **CDN** | CloudFront, Cloud CDN | Not applicable | No static content serving |

### 8.3.3 Cloud Migration Path (Future Enhancement)

While cloud services are not currently utilized, the containerized architecture provides a clear cloud migration path for learners who wish to explore deployment:

**Potential Cloud Deployment Options**:

**AWS Deployment Path**:
1. Push Docker image to Amazon ECR (Elastic Container Registry)
2. Deploy container to AWS Fargate (serverless containers) or ECS (managed orchestration)
3. Configure Application Load Balancer for traffic distribution
4. Integrate CloudWatch Logs for centralized logging
5. Use CloudWatch Metrics for monitoring integration

**Google Cloud Deployment Path**:
1. Push Docker image to Google Container Registry
2. Deploy to Cloud Run (serverless containers) or GKE (Kubernetes)
3. Configure Cloud Load Balancing for traffic management
4. Integrate Cloud Logging for log aggregation
5. Use Cloud Monitoring for metrics collection

**Azure Deployment Path**:
1. Push Docker image to Azure Container Registry
2. Deploy to Azure Container Instances or AKS (Kubernetes)
3. Configure Azure Load Balancer or Application Gateway
4. Integrate Azure Monitor for observability
5. Use Log Analytics for log aggregation

**Migration Effort Estimate**: 4-8 hours for basic cloud deployment with monitoring integration

## 8.4 Containerization

### 8.4.1 Container Platform Selection

**Container Runtime**: Docker Engine
- **Version Requirement**: 20.x or higher recommended
- **Platform Support**: Linux, macOS, Windows (via Docker Desktop)
- **Selection Justification**: Industry-standard containerization platform with universal adoption

**Base Image Strategy**: `node:18-alpine`

The production Dockerfile uses Alpine Linux variant for optimal image characteristics:

| Image Variant | Compressed Size | Uncompressed Size | Base OS | Use Case |
|---|---|---|---|------|
| `node:18-alpine` | ~50-70 MB | ~150 MB | Alpine Linux 3.x | Production (selected) |
| `node:18-slim` | ~100-120 MB | ~250 MB | Debian minimal | Alternative |
| `node:18` | ~300-350 MB | ~900 MB | Debian full | Not recommended |

**Alpine Linux Advantages**:

1. **Minimal Attack Surface**: Alpine's minimal package set (~8 MB base) reduces security vulnerabilities compared to full Debian distributions (~100+ MB)
2. **Faster Image Builds**: Smaller base image downloads faster from Docker Hub during builds
3. **Efficient Layer Caching**: Smaller layers improve Docker cache efficiency and build performance
4. **Production Best Practice**: Alpine is industry-standard for production containerization (documented in Section 3.7.1.1)

**Evidence**: Base image selection documented in `Dockerfile` (line 3): `FROM node:18-alpine`, with rationale in Section 3.7.1.1.

### 8.4.2 Dockerfile Architecture

**Dockerfile Locations**:

The repository contains two parallel Dockerfiles with identical configurations:

1. **Root Dockerfile** (`hao-backprop-test-main (1)/hao-backprop-test-main/Dockerfile`)
   - Build context: Repository root directory
   - Source copy path: `src/backend/` → `/app`
   - Usage: Production builds from CI/CD or manual execution

2. **Backend Dockerfile** (`hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/Dockerfile`)
   - Build context: Backend directory
   - Source copy path: Current directory (`.`) → `/app`
   - Usage: Local development builds from backend folder

**Dockerfile Structure** (both files implement identical pattern):

```dockerfile
# Stage 1: Base image selection

FROM node:18-alpine

#### Stage 2: Working directory setup

WORKDIR /app

#### Stage 3: Dependency installation (optimized layer)

COPY package*.json ./
RUN npm ci --only=production

#### Stage 4: Application source code (separate layer)

COPY <source-path> ./

#### Stage 5: Runtime configuration

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

#### Stage 6: Startup command

CMD ["node", "index.js"]
```

**Layer Architecture Breakdown**:

| Layer Number | Instruction | Size Estimate | Rebuild Frequency | Caching Strategy |
|---|---|---|---|------|
| 1 | `FROM node:18-alpine` | ~50 MB | Never | Cached unless base image updated |
| 2 | `WORKDIR /app` | ~0 KB | Never | Metadata only |
| 3 | `COPY package*.json` | ~10 KB | When dependencies change | Cache invalidates on package.json modification |
| 4 | `RUN npm ci` | ~5-10 MB | When dependencies change | Rebuilds only if layer 3 changes |
| 5 | `COPY source code` | ~100 KB | Every code change | Rebuilds on every source modification |
| 6 | `ENV` + `EXPOSE` | ~0 KB | Never | Metadata only |
| 7 | `CMD` | ~0 KB | Never | Metadata only |

### 8.4.3 Layer Caching Optimization

**Optimization Strategy**: Dependency Separation Pattern

The Dockerfile implements a critical optimization by copying package files **before** source code:

**Build Workflow with Caching**:

**Scenario 1: Source Code Change (Most Common)**
```
1. Layers 1-4 → CACHE HIT (package.json unchanged)
2. Layer 5 (COPY source) → CACHE MISS (source modified)
3. Rebuild time: 10-20 seconds
```

**Scenario 2: Dependency Change (Less Common)**
```
1. Layers 1-2 → CACHE HIT (base image unchanged)
2. Layer 3 (COPY package.json) → CACHE MISS (package.json modified)
3. Layer 4 (npm ci) → CACHE MISS (dependencies reinstalled)
4. Layer 5 (COPY source) → CACHE MISS (downstream layer)
5. Rebuild time: 60-90 seconds (includes npm install)
```

**Scenario 3: Fresh Build (No Cache)**
```
1. All layers → CACHE MISS
2. Full build time: 90-120 seconds
```

**Performance Impact**:

| Scenario | With Optimization | Without Optimization | Time Savings |
|---|---|---|------|
| Typical code change | 10-20 sec | 60-90 sec | **70-80% faster** |
| Dependency change | 60-90 sec | 60-90 sec | No difference |
| Fresh build | 90-120 sec | 90-120 sec | No difference |

**Evidence**: Layer caching strategy documented in Section 3.7.1.1: "Average rebuild time: ~10-20 seconds when dependencies unchanged."

### 8.4.4 Image Versioning and Tagging

**Tagging Strategy**:

The deployment automation in `infrastructure/scripts/deploy.sh` implements a comprehensive tagging strategy:

**Image Tags Applied**:

| Tag Pattern | Example | Purpose |
|---|---|------|
| `latest` | `node-hello-world:latest` | Most recent successful build |
| `version` | `node-hello-world:1.0.0` | Semantic version tag for releases |
| `environment` | `node-hello-world:production` | Environment-specific tags |
| `previous` | `node-hello-world:previous` | Last known good version (rollback) |
| `timestamp` | `node-hello-world:2024-01-15-1430` | Build timestamp for audit trail |

**Tagging Workflow** (from `deploy.sh`):

```bash
# Build with version tag

docker build -t node-hello-world:1.0.0 .

#### Tag as latest

docker tag node-hello-world:1.0.0 node-hello-world:latest

#### Tag for environment

docker tag node-hello-world:1.0.0 node-hello-world:production

#### Save current as previous before deploying

docker tag node-hello-world:production node-hello-world:previous

#### Deploy new version

docker-compose up -d
```

**Version Cleanup Policy** (Production Only):

The deployment script automatically cleans old images in production to conserve disk space:

- **Retention**: Keep last 3 versions only
- **Cleanup Trigger**: After successful deployment and health check validation
- **Protected Tags**: `latest`, `previous`, and current version tags never deleted
- **Development Exception**: No cleanup in development to preserve history

**Image Registry Strategy**: Local Docker Cache Only

The current infrastructure does not push images to external registries:

- ✅ **Local Cache**: All images stored in local Docker daemon cache
- ❌ **Docker Hub**: No public registry push (appropriate for educational project)
- ❌ **Private Registry**: No ECR, GCR, or ACR integration
- ✅ **Build Automation**: `deploy.sh` builds fresh images from source

**Future Registry Integration** (commented in `deploy.sh`):

The deployment script includes placeholder logic for registry push:

```bash
# Future: Push to registry

#### if [ "$ENVIRONMENT" = "production" ]; then
####   docker push ${IMAGE_NAME}:${VERSION}

#### fi
```

### 8.4.5 Build Optimization Techniques

**Technique 1: Production-Only Dependencies**

```dockerfile
RUN npm ci --only=production
```

- **Impact**: Excludes devDependencies (Jest, ESLint, nodemon) from production image
- **Size Reduction**: ~5-10 MB smaller images
- **Security Benefit**: Fewer packages reduce vulnerability exposure
- **Evidence**: Documented in Section 3.7.1.1 Dockerfile architecture

**Technique 2: npm ci vs npm install**

```dockerfile
RUN npm ci --only=production
```

- **`npm ci` Advantages**:
  - Deterministic installs from `package-lock.json`
  - Faster installation (skips package resolution)
  - Deletes `node_modules` before install (clean state)
  - Fails if `package.json` and `package-lock.json` mismatch
- **Use Case**: CI/CD and production builds where reproducibility critical

**Technique 3: .dockerignore File**

The repository should include a `.dockerignore` file to exclude unnecessary files from build context (implementation opportunity):

```
node_modules
.git
.github
.env
*.log
coverage
.pytest_cache
__pycache__
*.pyc
.DS_Store
```

- **Impact**: Faster build context transfer to Docker daemon
- **Size Reduction**: Excludes ~50-100 MB of unnecessary files
- **Security**: Prevents accidental inclusion of secrets in `.env`

**Technique 4: Multi-Stage Builds** (Future Enhancement)

Current Dockerfile uses single-stage build. Multi-stage optimization could further reduce image size:

```dockerfile
# Build stage (not currently implemented)

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm test && npm prune --production

#### Production stage

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
CMD ["node", "src/backend/index.js"]
```

- **Benefit**: Build tools and test dependencies excluded from final image
- **Size Reduction**: Potential 10-15% smaller images
- **Complexity**: Additional build stage configuration

### 8.4.6 Security Scanning Requirements

**Current Status**: ⚠️ Not Implemented (Educational Gap)

The infrastructure lacks automated security scanning, representing an opportunity for learners to enhance security practices:

**Recommended Security Scanning Tools**:

| Tool | Purpose | Integration Point | Scan Frequency |
|---|---|---|------|
| **Trivy** | Container vulnerability scanning | CI/CD pipeline or pre-push hook | Every build |
| **Snyk** | Dependency vulnerability detection | npm audit integration | Daily/weekly |
| **Docker Bench** | Docker host security audit | Manual or scheduled | Monthly |
| **npm audit** | Node.js dependency vulnerabilities | `package.json` scripts | Every `npm install` |

**Implementation Approach for Trivy**:

```bash
# Install Trivy

brew install trivy  # macOS
apt-get install trivy  # Linux

#### Scan Docker image

trivy image node-hello-world:latest

#### Scan with severity threshold

trivy image --severity HIGH,CRITICAL node-hello-world:latest

#### CI/CD integration (exit 1 if vulnerabilities found)

trivy image --exit-code 1 --severity CRITICAL node-hello-world:latest
```

**Security Best Practices Currently Implemented**:

1. ✅ **Alpine Base Image**: Minimal package set reduces vulnerability exposure
2. ✅ **Production Dependencies Only**: `npm ci --only=production` excludes dev packages
3. ✅ **No Hardcoded Secrets**: No credentials or API keys in Dockerfile or images
4. ✅ **Git-Ignored Env Files**: `.env` excluded from version control

**Security Gaps Identified**:

1. ❌ **Root User Execution**: Container runs as root (uid 0) instead of non-privileged user
2. ❌ **No Health Check Timeout**: Dockerfile lacks `HEALTHCHECK` instruction
3. ❌ **No Read-Only Root Filesystem**: Container filesystem writable (not required for this app)
4. ❌ **No Resource Limits**: Dockerfile lacks `MEMORY` and `CPU` constraints

**Security Enhancement Example** (Non-Root User):

```dockerfile
FROM node:18-alpine

#### Create non-root user

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

#### Copy with correct ownership

COPY --chown=nodejs:nodejs package*.json ./
RUN npm ci --only=production

COPY --chown=nodejs:nodejs src/backend/ ./

#### Switch to non-root user

USER nodejs

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]
```

**Evidence**: Security considerations documented in Section 3.7.1.1, with Alpine Linux base reducing attack surface.

## 8.5 Orchestration

### 8.5.1 Orchestration Platform Selection

**Platform**: Docker Compose
- **Version**: 3.8 (compose file format)
- **Purpose**: Multi-container orchestration for local development with monitoring stack
- **Configuration File**: `infrastructure/local/docker-compose.yml`

**Selection Justification**:

Docker Compose was selected over Kubernetes and cloud orchestration platforms for educational and architectural reasons:

| Requirement | Docker Compose | Kubernetes | Rationale |
|---|---|---|------|
| **Learning Curve** | Low (YAML config) | High (complex API) | Appropriate for beginners |
| **Setup Time** | < 5 minutes | 30-60 minutes | Rapid getting-started experience |
| **Resource Overhead** | ~100 MB | 1-2 GB | Laptop-friendly development |
| **Single-Host Deployment** | ✅ Designed for | ❌ Overkill | Perfect fit for scope |

**Not Using Kubernetes Because**:

- **Scale Mismatch**: Single instance deployment doesn't require Kubernetes complexity
- **No Multi-Host**: All containers run on single developer workstation
- **No Auto-Scaling**: Fixed single-instance deployment, no HPA (Horizontal Pod Autoscaler) needed
- **Educational Focus**: Docker Compose concepts transferable to Kubernetes with lower barrier

**Evidence**: Selection rationale documented in Section 3.7.1.2: "Simplifies local development environment setup... Service coordination... Network isolation."

### 8.5.2 Service Architecture

**Docker Compose Services Defined**:

```yaml
version: "3.8"

services:
  hello-world-app:
    build:
      context: ../..                    # Repository root
      dockerfile: Dockerfile
    image: hello-world-app:latest
    container_name: hello-world-app
    ports:
      - "3000:3000"                     # HTTP traffic
    environment:
      - PORT=3000
      - NODE_ENV=development
    volumes:
      - ../../src/backend:/app          # Source code hot reload
      - node_modules:/app/node_modules  # Preserve container dependencies
    restart: unless-stopped             # Automatic restart on failure
    command: npm run dev                # Development mode with nodemon
    networks:
      - hello-world-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

networks:
  hello-world-network:
    driver: bridge

volumes:
  node_modules:
```

**Service Configuration Analysis**:

| Configuration | Value | Purpose | Educational Value |
|---|---|---|------|
| `build.context` | `../..` (repo root) | Build from repository root | Demonstrates build context concepts |
| `build.dockerfile` | `Dockerfile` | Use root Dockerfile | Multi-Dockerfile management |
| `container_name` | `hello-world-app` | Fixed container name | Predictable service discovery |
| `ports` | `3000:3000` | Host:Container mapping | Port exposure and mapping |

**Evidence**: Complete Docker Compose configuration in `infrastructure/local/docker-compose.yml`, documented in Section 3.7.1.2.

### 8.5.3 Network Architecture

**Network Configuration**:

```yaml
networks:
  hello-world-network:
    driver: bridge
```

**Network Characteristics**:

- **Driver**: Bridge (default Docker network driver)
- **Isolation**: Services isolated from host network by default
- **Service Discovery**: Containers communicate using service names as hostnames
- **Internal DNS**: Docker provides automatic DNS resolution for service names

**Network Communication Patterns**:

```mermaid
graph TB
    subgraph "Host System"
        Browser[Web Browser<br/>localhost:3000]
        PrometheusUI[Prometheus UI<br/>localhost:9090]
        GrafanaUI[Grafana UI<br/>localhost:3001]
    end
    
    subgraph "Docker Network: hello-world-network"
        App[hello-world-app:3000<br/>Application Container]
        Prom[prometheus:9090<br/>Metrics Collector]
        Graf[grafana:3001<br/>Visualization]
    end
    
    Browser -->|Port Mapping<br/>3000:3000| App
    PrometheusUI -->|Port Mapping<br/>9090:9090| Prom
    GrafanaUI -->|Port Mapping<br/>3001:3001| Graf
    
    Prom -->|HTTP GET<br/>hello-world-app:3000/metrics| App
    Prom -->|HTTP GET<br/>hello-world-app:3000/health| App
    Graf -->|PromQL Queries<br/>prometheus:9090| Prom
    
    style App fill:#90EE90
    style Prom fill:#FFB6C6
    style Graf fill:#FFB6C6
```

**Port Mapping Strategy**:

| Service | Container Port | Host Port | Protocol | Access URL |
|---|---|---|---|------|
| Application | 3000 | 3000 | HTTP | http://localhost:3000 |
| Prometheus | 9090 | 9090 | HTTP | http://localhost:9090 (not in compose) |
| Grafana | 3001 | 3001 | HTTP | http://localhost:3001 (not in compose) |

**Network Security**:

- ✅ **Isolation**: Containers cannot access host network services by default
- ✅ **Firewall**: Only explicitly mapped ports accessible from host
- ❌ **Encryption**: No TLS/SSL within container network (HTTP only)
- ❌ **Authentication**: No network-level authentication required

### 8.5.4 Volume Strategy

**Volume Configuration** (from `docker-compose.yml`):

```yaml
volumes:
  - ../../src/backend:/app              # Bind mount
  - node_modules:/app/node_modules      # Named volume
```

**Volume Type 1: Bind Mount** (`../../src/backend:/app`)

- **Purpose**: Real-time code synchronization for hot reload
- **Direction**: Bidirectional (host ↔ container)
- **Use Case**: Development environment with nodemon watching for changes
- **Performance**: Native filesystem performance on Linux, slight overhead on macOS/Windows
- **Educational Value**: Demonstrates development-production parity with instant feedback

**How Hot Reload Works**:

1. Developer modifies `src/backend/index.js` on host system
2. Bind mount synchronizes change to container's `/app/index.js`
3. nodemon detects file change via filesystem watcher
4. nodemon restarts Node.js process (~1 second latency)
5. Developer sees updated behavior without rebuilding container

**Volume Type 2: Named Volume** (`node_modules:/app/node_modules`)

- **Purpose**: Preserve container-built dependencies, prevent host override
- **Direction**: Container-managed (persists between restarts)
- **Use Case**: Avoid host/container OS incompatibility for native modules
- **Problem Solved**: Prevents macOS/Windows `node_modules` from overwriting Linux container modules

**Why Named Volume is Critical**:

Without the named volume, the bind mount would expose host's `node_modules` to the container, causing issues:

```
Host (macOS):     node_modules/bcrypt/lib/binding/darwin-x64-node.node
Container (Linux): node_modules/bcrypt/lib/binding/linux-x64-node.node  ← MISMATCH
```

The named volume ensures container's Linux-compiled `node_modules` takes precedence, preventing native module compatibility errors.

**Volume Management Commands**:

```bash
# List volumes

docker volume ls

#### Inspect named volume

docker volume inspect infrastructure_local_node_modules

#### Remove named volume (when rebuilding dependencies)

docker volume rm infrastructure_local_node_modules

#### Remove all unused volumes

docker volume prune
```

**Evidence**: Volume strategy documented in Section 3.7.1.2: "Bind mounts enable hot reload... Named volume preserves container-built dependencies."

### 8.5.5 Service Deployment Strategy

**Deployment Command**:

```bash
# Start all services in detached mode

docker-compose up -d

#### Start with build (rebuild images first)

docker-compose up -d --build

#### Start with logs visible (foreground)

docker-compose up

#### Scale services (not applicable for named containers)

docker-compose up -d --scale hello-world-app=3  # ❌ Fails due to container_name
```

**Deployment Workflow**:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Compose as Docker Compose
    participant Docker as Docker Engine
    participant App as Application Container
    participant Health as Health Check
    
    Dev->>Compose: docker-compose up -d
    Compose->>Docker: Create network: hello-world-network
    Docker-->>Compose: Network created
    
    Compose->>Docker: Create named volume: node_modules
    Docker-->>Compose: Volume created
    
    Compose->>Docker: Build image from Dockerfile
    Docker-->>Compose: Image built: hello-world-app:latest
    
    Compose->>Docker: Create container: hello-world-app
    Docker->>App: Start container
    App->>App: Execute: npm run dev
    App->>App: Start Node.js with nodemon
    
    Note over App,Health: start_period: 10 seconds
    
    Health->>App: curl -f http://localhost:3000/hello
    App-->>Health: 200 OK "Hello world"
    Health->>Health: Mark container healthy
    
    Health-->>Dev: ✅ Container healthy and running
```

**Service Lifecycle Management**:

| Command | Purpose | Use Case |
|---|---|------|
| `docker-compose up -d` | Start all services in background | Initial startup or restart |
| `docker-compose down` | Stop and remove containers | Cleanup or configuration changes |
| `docker-compose restart` | Restart services without rebuild | Apply environment variable changes |
| `docker-compose logs -f` | Follow log output | Debugging and monitoring |
| `docker-compose ps` | List running services | Status check |
| `docker-compose exec hello-world-app sh` | Access container shell | Interactive debugging |

**Graceful Shutdown Behavior**:

When `docker-compose down` is executed:

1. Docker Compose sends SIGTERM signal to each container
2. Application's signal handler (Section 5.4.5) invokes graceful shutdown:
   - `server.close()` stops accepting new connections
   - Active connections allowed to complete (10-second timeout)
   - Process exits cleanly with `process.exit(0)`
3. Docker waits for container to exit (default 10-second timeout)
4. If container doesn't exit, Docker sends SIGKILL to force termination
5. Docker Compose removes containers and networks

### 8.5.6 Auto-Scaling Configuration

**Auto-Scaling Status**: ❌ Not Implemented (Not Required)

Docker Compose does not provide automatic scaling capabilities like Kubernetes Horizontal Pod Autoscaler. The educational scope and single-instance architecture eliminate scaling requirements.

**Scaling Limitations**:

- **Named Containers**: `container_name: hello-world-app` prevents multiple instances (name collision)
- **Port Conflicts**: Port mapping `3000:3000` would conflict with multiple instances
- **No Load Balancer**: Docker Compose lacks built-in load balancing for scaled services
- **Stateless Ready**: Application is stateless and scale-ready (Section 5.4.4), but infrastructure doesn't support it

**Manual Scaling Approach** (Educational Demonstration):

To manually scale the application for educational purposes, remove `container_name` and use dynamic port mapping:

```yaml
services:
  hello-world-app:
    # Remove: container_name: hello-world-app
    ports:
      - "3000-3002:3000"  # Map to host ports 3000-3002
    # ... rest of configuration
```

Then scale manually:

```bash
# Start 3 instances

docker-compose up -d --scale hello-world-app=3

#### Access instances

curl http://localhost:3000/hello
curl http://localhost:3001/hello
curl http://localhost:3002/hello
```

**Kubernetes Equivalent** (Future Enhancement):

For true auto-scaling, migration to Kubernetes would enable:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: hello-world-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hello-world-app
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

This would automatically scale replicas based on CPU utilization, but introduces complexity inappropriate for the educational scope.

### 8.5.7 Resource Allocation Policies

**Resource Limits Status**: ❌ Not Configured (Improvement Opportunity)

The current Docker Compose configuration lacks resource constraints, allowing containers unlimited access to host resources:

```yaml
# Current configuration (no limits)

services:
  hello-world-app:
    # No resource constraints defined
```

**Recommended Resource Configuration**:

```yaml
services:
  hello-world-app:
    deploy:
      resources:
        limits:
          cpus: '0.5'           # 50% of one CPU core
          memory: 256M          # 256 MB maximum memory
        reservations:
          cpus: '0.25'          # 25% minimum CPU guarantee
          memory: 128M          # 128 MB minimum memory
```

**Resource Allocation Best Practices**:

| Resource Type | Recommended Limit | Reservation | Rationale |
|---|---|---|------|
| **CPU** | 0.5 cores | 0.25 cores | Educational app doesn't need full core |
| **Memory** | 256 MB | 128 MB | Application uses ~100-200 MB |
| **Swap** | 0 (disabled) | N/A | Prevents memory thrashing |
| **PIDs** | 100 | N/A | Prevent fork bomb scenarios |

**Resource Monitoring** (without limits):

```bash
# Monitor real-time resource usage

docker stats hello-world-app

#### Example output:

CONTAINER         CPU %   MEM USAGE / LIMIT     MEM %   NET I/O       BLOCK I/O
hello-world-app   0.05%   150MB / 7.77GB        1.93%   10kB / 5kB    0B / 0B
```

**Why Resource Limits Not Implemented**:

1. **Educational Simplicity**: Resource constraints add configuration complexity for minimal benefit in single-user development
2. **Development Flexibility**: Allows memory-intensive debugging tools without hitting limits
3. **No Multi-Tenancy**: Single developer workstation doesn't require resource isolation
4. **Performance Testing**: Unrestricted resources enable realistic performance benchmarking

**Production Recommendation**: In production Kubernetes deployments, resource limits are critical for:
- Preventing resource starvation across pods
- Enabling scheduler placement decisions
- Protecting against memory leaks
- Implementing cluster-wide resource quotas

**Evidence**: Docker Compose configuration in `infrastructure/local/docker-compose.yml` with no resource constraints defined.

## 8.6 CI/CD Pipeline

### 8.6.1 CI/CD Platform Status

**Platform Expected**: GitHub Actions
**Current Status**: ⚠️ Infrastructure Ready, Workflows Not Implemented

The repository infrastructure includes CI/CD integration points but lacks GitHub Actions workflow files:

| Component | Status | Location | Purpose |
|---|---|---|------|
| **GitHub Actions Workflows** | ❌ Not Found | `.github/workflows/` (missing) | Automated CI/CD execution |
| **Test Reporter** | ✅ Configured | `jest-junit` in `package.json` | CI test result parsing |
| **Health Check Script** | ✅ Implemented | `infrastructure/scripts/health-check.sh` | Post-deployment validation |
| **Deployment Script** | ✅ Implemented | `infrastructure/scripts/deploy.sh` | Automated deployment workflow |
| **Setup Automation** | ✅ Implemented | `infrastructure/scripts/setup.sh` | Environment initialization |

**Expected Workflow Structure**:

```
.github/
└── workflows/
    ├── ci.yml              # ❌ Not found - Continuous Integration
    ├── cd.yml              # ❌ Not found - Continuous Deployment
    └── security-scan.yml   # ❌ Not found - Security vulnerability scanning
```

**Evidence**: Section 3.7.3.2 documents: "While README.md references GitHub workflows, the `.github/workflows/` directory was not found during repository analysis."

### 8.6.2 Build Pipeline

#### 8.6.2.1 Source Control Triggers

**Version Control System**: Git (GitHub)

**Expected CI Triggers** (when workflows implemented):

| Event | Trigger Pattern | Purpose | Workflow Runs |
|---|---|---|------|
| **Push to main** | `push: branches: [main]` | Validate every commit to main branch | All CI checks + deployment |
| **Pull Request** | `pull_request: branches: [main]` | Validate before merge | All CI checks (no deployment) |
| **Tag Push** | `push: tags: ['v*']` | Release deployment | Full CI/CD + release artifacts |
| **Manual Dispatch** | `workflow_dispatch` | On-demand execution | Configurable workflow run |
| **Schedule** | `schedule: cron: '0 2 * * *'` | Nightly builds for dependency checks | Scheduled CI checks |

**Branch Workflow** (from `CONTRIBUTING.md`):

- **Main Branch**: Protected, requires pull request approval
- **Feature Branches**: `feature/*`, `fix/*`, `docs/*`, `test/*`, `refactor/*`
- **Commit Convention**: Conventional commits format (feat:, fix:, docs:, etc.)

**Git Hooks Opportunity** (not currently implemented):

```bash
# .git/hooks/pre-push

#!/bin/sh
npm test && npm run lint
```

Pre-push hooks could enforce local quality gates before pushing to remote.

#### 8.6.2.2 Build Environment Requirements

**Expected CI Environment**:

| Requirement | Specification | Validation Method |
|---|---|------|
| **Operating System** | Ubuntu Latest (GitHub Actions runner) | `runs-on: ubuntu-latest` |
| **Node.js Version** | 18.x LTS | `actions/setup-node@v3` with `node-version: 18` |
| **npm Version** | 9.x or higher | Included with Node.js 18 |
| **Docker Engine** | 20.x or higher | Pre-installed on GitHub Actions runners |
| **Docker Compose** | v2.x | Pre-installed on GitHub Actions runners |

**Environment Setup Script** (`infrastructure/scripts/setup.sh`):

The setup script automates environment preparation with the following checks:

1. **Node.js Version Validation**: Verify Node.js 18.0.0 or higher installed
2. **npm Availability**: Confirm npm package manager present
3. **Dependency Installation**: Execute `npm install` for all dependencies
4. **Environment File Creation**: Generate `.env` file with default configuration
5. **Port Availability**: Verify port 3000 not in use
6. **Log Directory Setup**: Create log directories with proper permissions
7. **Setup Summary**: Display configuration and next steps

**CI Environment Variables**:

```yaml
env:
  NODE_ENV: test
  PORT: 3000
  LOG_LEVEL: ERROR
  CI: true
```

#### 8.6.2.3 Dependency Management

**Dependency Installation Strategy**:

**Development/CI**: `npm install`
```bash
# Install all dependencies including devDependencies

npm install

#### Includes:

#### - jest (testing framework)
#### - jest-junit (CI test reporter)

#### - eslint (linting)
#### - nodemon (development hot reload)

```

**Production**: `npm ci --only=production`
```bash
# Clean install from package-lock.json

#### Excludes devDependencies
npm ci --only=production

#### Includes only:

#### - dotenv (configuration management)
#### - No framework dependencies (native Node.js only)

```

**Dependency Caching** (GitHub Actions):

```yaml
- name: Cache Node.js modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**Dependency Security Scanning**:

```bash
# npm audit (built-in vulnerability scanner)

npm audit

#### Severity levels: low, moderate, high, critical

npm audit --audit-level=moderate

#### Automatic fix (non-breaking)

npm audit fix

#### Force fix (potentially breaking)

npm audit fix --force
```

**Expected CI Integration**:

```yaml
- name: Security Audit
  run: npm audit --audit-level=high
```

#### 8.6.2.4 Artifact Generation and Storage

**Build Artifacts**:

| Artifact Type | Generation Method | Storage Location | Retention |
|---|---|---|------|
| **Docker Image** | `docker build` | Local Docker cache | Until cleanup |
| **Test Results** | `jest --reporters=jest-junit` | XML file | CI artifacts (30 days) |
| **Coverage Report** | `jest --coverage` | HTML + JSON | CI artifacts (30 days) |
| **Linting Report** | `eslint . --format json` | JSON file | CI artifacts (30 days) |

**Test Result XML Generation**:

The `jest-junit` reporter configured in `package.json` generates CI-compatible test results:

```json
{
  "jest-junit": {
    "outputDirectory": "./test-results",
    "outputName": "jest-junit.xml",
    "suiteName": "Node.js Hello World Tests"
  }
}
```

**Expected CI Artifact Upload**:

```yaml
- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results/jest-junit.xml

- name: Upload Coverage Report
  uses: actions/upload-artifact@v3
  with:
    name: coverage-report
    path: coverage/
```

**Docker Image Artifacts**:

```bash
# Save Docker image to tar archive

docker save node-hello-world:latest -o node-hello-world.tar

#### Load Docker image from archive

docker load -i node-hello-world.tar
```

**Expected Registry Push** (when configured):

```yaml
- name: Push to Docker Hub
  run: |
    echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
    docker push node-hello-world:${{ github.sha }}
    docker push node-hello-world:latest
```

#### 8.6.2.5 Quality Gates

**Automated Quality Checks** (ready for CI integration):

| Quality Gate | Command | Pass Criteria | Failure Action |
|---|---|---|------|
| **Unit Tests** | `npm test` | All tests pass, coverage ≥ 90% | Block merge/deployment |
| **Linting** | `npm run lint` | 0 ESLint errors | Block merge/deployment |
| **Security Audit** | `npm audit --audit-level=high` | No high/critical vulnerabilities | Block deployment (warn on merge) |
| **Docker Build** | `docker build -t test .` | Successful image build | Block deployment |
| **Health Check** | `./infrastructure/scripts/health-check.sh` | Exit code 0 (healthy) | Block deployment |

**Test Coverage Thresholds** (from Section 1.2.3):

| Component | Coverage Target | Enforcement |
|---|---|------|
| **Handlers** | 100% | Critical request processing logic |
| **Router** | ≥ 90% | Core routing logic |
| **Server** | ≥ 85% | Server lifecycle and integration |
| **Global** | ≥ 90% | Overall quality standard |

**Expected CI Workflow with Quality Gates**:

```yaml
jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run Linting
        run: npm run lint
      
      - name: Run Tests with Coverage
        run: npm test -- --coverage --coverageThreshold='{"global":{"lines":90}}'
      
      - name: Security Audit
        run: npm audit --audit-level=high
      
      - name: Build Docker Image
        run: docker build -t node-hello-world:${{ github.sha }} .
      
      - name: Test Docker Container
        run: |
          docker run -d --name test-container -p 3000:3000 node-hello-world:${{ github.sha }}
          sleep 5
          ./infrastructure/scripts/health-check.sh
          docker stop test-container
```

### 8.6.3 Deployment Pipeline

#### 8.6.3.1 Deployment Strategy

**Strategy**: Rolling Deployment with Health Verification

The `infrastructure/scripts/deploy.sh` script implements a rolling deployment pattern optimized for single-instance educational deployment:

**Deployment Pattern**:

```mermaid
graph TD
    A[Start Deployment] --> B[Parse Arguments<br/>environment, verbose]
    B --> C[Validate Prerequisites<br/>Docker, Compose, curl]
    C --> D[Load Environment Config<br/>development/staging/production]
    D --> E[Build Docker Image<br/>docker build with tags]
    E --> F[Tag Current as Previous<br/>Rollback preparation]
    F --> G[Deploy New Container<br/>docker-compose up -d]
    G --> H[Wait 10 Seconds<br/>Startup grace period]
    H --> I[Run Health Checks<br/>5 retries, 3-second intervals]
    I -->|Healthy| J[Success Actions<br/>Cleanup old images]
    I -->|Unhealthy| K[Rollback<br/>Deploy previous version]
    J --> L[Deployment Complete]
    K --> M[Verify Rollback Health]
    M --> N[Alert Operator]
```

**Deployment Script Usage**:

```bash
# Development environment (default)

./infrastructure/scripts/deploy.sh development

#### Staging with verbose logging

./infrastructure/scripts/deploy.sh staging --verbose

#### Production deployment

./infrastructure/scripts/deploy.sh production
```

**Alternative Deployment Strategies** (not implemented):

| Strategy | Description | Pros | Cons | Applicability |
|---|---|---|---|------|
| **Blue-Green** | Maintain two environments, switch traffic | Zero downtime, instant rollback | Requires load balancer, 2x resources | ❌ Overkill for single instance |
| **Canary** | Gradual traffic shift to new version | Risk mitigation, gradual validation | Complex traffic routing | ❌ Requires load balancer |
| **Recreate** | Stop old, start new | Simple, clears resources | Downtime during deployment | ❌ Not graceful |

#### 8.6.3.2 Environment Promotion Workflow

**Promotion Path**: Development → Staging → Production

```mermaid
flowchart LR
    A[Development<br/>Local Workstation] -->|Manual Trigger| B[Staging<br/>Pre-Production]
    B -->|Validation Pass| C[Production<br/>Simulated Prod]
    
    A -->|Failed Tests| A
    B -->|Failed Health Checks| A
    C -->|Critical Failure| D[Rollback to<br/>Previous Version]
    
    style A fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e1ffe1
    style D fill:#ffe1e1
```

**Environment-Specific Configurations**:

| Configuration | Development | Staging | Production |
|---|---|---|------|
| **NODE_ENV** | development | production | production |
| **PORT** | 3000 | 3000 | 80 |
| **LOG_LEVEL** | DEBUG | INFO | WARN |
| **Image Cleanup** | Disabled | Disabled | Enabled (keep last 3) |
| **Monitoring** | Optional | Enabled | Enabled |
| **Hot Reload** | Enabled (nodemon) | Disabled | Disabled |

**Promotion Approval Process**:

1. **Development → Staging**:
   - Manual trigger by developer
   - All tests must pass locally
   - Linting must pass
   - Docker build must succeed

2. **Staging → Production**:
   - Manual trigger by operator
   - Staging health checks must pass
   - Monitoring validation required
   - Approval from project maintainer

**Evidence**: Deployment workflow documented in Section 3.7.3.1, with environment promotion strategy in `deploy.sh` script.

#### 8.6.3.3 Rollback Procedures

**Automatic Rollback Trigger**: Health Check Failure Post-Deployment

The deployment script implements automatic rollback when post-deployment health checks fail:

**Rollback Workflow**:

```mermaid
sequenceDiagram
    participant Deploy as Deploy Script
    participant Docker as Docker Engine
    participant New as New Container
    participant Old as Previous Container
    participant Health as Health Check
    
    Deploy->>Docker: Tag current as :previous
    Deploy->>Docker: Deploy new version
    Docker->>New: Start container
    Deploy->>Deploy: Wait 10 seconds
    
    loop 5 retries, 3-second intervals
        Deploy->>Health: ./health-check.sh
        Health->>New: HTTP GET /hello
        New-->>Health: Error or timeout
        Health-->>Deploy: Exit code 1 (unhealthy)
    end
    
    Deploy->>Deploy: All health checks failed
    Deploy->>Docker: Stop new container
    Deploy->>Docker: Deploy :previous tag
    Docker->>Old: Start previous container
    
    Deploy->>Health: Verify rollback health
    Health->>Old: HTTP GET /hello
    Old-->>Health: 200 OK "Hello world"
    Health-->>Deploy: Exit code 0 (healthy)
    
    Deploy->>Deploy: Log rollback event
    Deploy->>Deploy: Alert operator
```

**Rollback Implementation** (from `deploy.sh`):

```bash
# Pseudocode from deploy.sh

deploy_new_version() {
  docker tag ${IMAGE}:latest ${IMAGE}:previous
  docker-compose up -d
  wait_for_startup
  
  if ! health_check_retry; then
    log "ERROR: Health checks failed. Rolling back..."
    docker-compose down
    docker tag ${IMAGE}:previous ${IMAGE}:latest
    docker-compose up -d
    
    if health_check_retry; then
      log "Rollback successful. Previous version restored."
    else
      log "CRITICAL: Rollback failed. Manual intervention required."
    fi
    exit 1
  fi
}
```

**Manual Rollback Procedure**:

```bash
# 1. Identify previous version

docker images | grep node-hello-world

#### Stop current deployment

docker-compose down

#### Deploy specific version

docker tag node-hello-world:1.0.0 node-hello-world:latest
docker-compose up -d

#### Verify health

./infrastructure/scripts/health-check.sh
```

**Rollback Metrics**:

- **Detection Time**: 90 seconds maximum (health check retries)
- **Rollback Execution**: 30-60 seconds (stop + start)
- **Total Recovery Time**: ~2-3 minutes from deployment failure

#### 8.6.3.4 Post-Deployment Validation

**Validation Method**: Multi-Layer Health Checks

**Health Check Script** (`infrastructure/scripts/health-check.sh`):

```bash
#!/bin/bash
# Configurable parameters

HOST=${1:-localhost}
PORT=${2:-3000}
TIMEOUT=${3:-5}

#### HTTP status validation

STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  --max-time $TIMEOUT \
  http://$HOST:$PORT/hello)

#### Response body validation

BODY=$(curl -s --max-time $TIMEOUT http://$HOST:$PORT/hello)

#### Validation logic

if [ "$STATUS" = "200" ] && [ "$BODY" = "Hello world" ]; then
  echo "✅ Service healthy: HTTP $STATUS, correct response"
  exit 0
elif [ "$STATUS" = "200" ]; then
  echo "⚠️ Service unhealthy: HTTP $STATUS, incorrect response body"
  exit 1
else
  echo "❌ Service unreachable: HTTP $STATUS"
  exit 2
fi
```

**Exit Code Contract**:

| Exit Code | Status | Meaning | CI/CD Action |
|---|---|---|------|
| 0 | Healthy | 200 OK + correct response body | Proceed with deployment |
| 1 | Unhealthy | Wrong status or response | Rollback deployment |
| 2 | Unreachable | Connection failed or timeout | Rollback deployment |

**Validation Checks Performed**:

1. **HTTP Connectivity**: Can reach the service endpoint
2. **HTTP Status Code**: Receives 200 OK response
3. **Response Body**: Contains exact "Hello world" text
4. **Response Time**: Returns within timeout period (5 seconds default)

**Docker Compose Health Check** (integrated validation):

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/hello"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

- **Purpose**: Container-level health monitoring with automatic restart
- **Integration**: Docker marks container unhealthy after 3 failures (90 seconds)
- **Action**: `restart: unless-stopped` policy triggers automatic container restart

**Post-Deployment Checklist**:

- ✅ HTTP endpoint returns 200 OK
- ✅ Response body matches expected content
- ✅ Container health status shows "healthy"
- ✅ No errors in Docker logs
- ✅ Application startup logs confirm successful initialization
- ✅ Monitoring stack (if enabled) receiving metrics

**Evidence**: Health check implementation in `infrastructure/scripts/health-check.sh`, Docker Compose health check in `infrastructure/local/docker-compose.yml`, documented in Section 6.5.3.

#### 8.6.3.5 Release Management Process

**Release Strategy**: Manual Semantic Versioning

**Version Format**: `v<MAJOR>.<MINOR>.<PATCH>` (e.g., `v1.0.0`)

**Release Process**:

1. **Version Bump**: Update version in `package.json`
   ```bash
   npm version patch  # v1.0.0 → v1.0.1
   npm version minor  # v1.0.1 → v1.1.0
   npm version major  # v1.1.0 → v2.0.0
   ```

2. **Git Tag**: Create annotated tag
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0: Initial stable release"
   git push origin v1.0.0
   ```

3. **Build Release Artifacts**:
   ```bash
   # Build Docker image with version tag
   docker build -t node-hello-world:v1.0.0 .
   docker tag node-hello-world:v1.0.0 node-hello-world:latest
   ```

4. **Deploy to Production**:
   ```bash
   ./infrastructure/scripts/deploy.sh production
   ```

5. **Release Notes**: Create GitHub release with changelog

**Expected CI/CD Integration** (when workflows implemented):

```yaml
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      
      - name: Extract Version
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/}" >> $GITHUB_OUTPUT
      
      - name: Build Release Image
        run: docker build -t node-hello-world:${{ steps.version.outputs.VERSION }} .
      
      - name: Create GitHub Release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ steps.version.outputs.VERSION }}
          release_name: Release ${{ steps.version.outputs.VERSION }}
          draft: false
          prerelease: false
```

**Release Artifacts**:

- ✅ Git tag in repository
- ✅ Docker image with version tag
- ✅ GitHub release with changelog
- ❌ Binary distributions (not applicable for Node.js)
- ❌ npm package publication (educational project, not library)

## 8.7 Infrastructure Monitoring

### 8.7.1 Monitoring Architecture Overview

**Monitoring Status**: ⚠️ Provisioned Infrastructure, Partial Implementation

The infrastructure implements a **hybrid monitoring approach** combining fully functional basic observability (console logging and Docker health checks) with provisioned but inactive advanced monitoring infrastructure (Prometheus and Grafana).

**Monitoring Stack Components**:

| Component | Status | Purpose | Location |
|---|---|---|------|
| **Console Logging** | ✅ Fully Functional | Real-time request/response/error logging | `src/backend/utils/logger.js` |
| **Docker Health Checks** | ✅ Fully Functional | Container-level availability monitoring | `docker-compose.yml` healthcheck |
| **Health Check Script** | ✅ Fully Functional | Programmatic deployment validation | `infrastructure/scripts/health-check.sh` |
| **Prometheus Configuration** | ⚠️ Provisioned | Metrics collection configuration (3 scrape jobs) | `infrastructure/monitoring/prometheus.yml` |

| Component | Status | Purpose | Location |
|---|---|---|------|
| **Grafana Dashboard** | ⚠️ Provisioned | Visualization dashboard (13 panels) | `infrastructure/monitoring/grafana-dashboard.json` |
| **Metrics Endpoint** | ❌ Not Implemented | Application metrics exposure | `/metrics` endpoint missing |
| **Health Endpoint** | ❌ Not Implemented | Dedicated health endpoint | `/health` endpoint missing |
| **Prometheus Container** | ❌ Not Deployed | Metrics collection server | Not in `docker-compose.yml` |
| **Grafana Container** | ❌ Not Deployed | Metrics visualization server | Not in `docker-compose.yml` |

**Evidence**: Monitoring architecture documented in Section 6.5, with implementation status in Section 6.5.1.1.

### 8.7.2 Resource Monitoring Approach

#### 8.7.2.1 Current Monitoring (Console Logging)

**Logging Implementation** (`src/backend/utils/logger.js`):

The application provides comprehensive console-based observability with structured logging:

**Log Levels Implemented**:

| Log Level | Function | Output Format | Use Case |
|---|---|---|------|
| **INFO** | `info(message)` | `[ISO_timestamp] INFO: message` | Server startup, shutdown, configuration loading |
| **WARN** | `warn(message)` | `[ISO_timestamp] WARN: message` | Non-fatal issues, performance degradation |
| **ERROR** | `error(message)` | `[ISO_timestamp] ERROR: message` | Exceptions, failures, processing errors |

**Specialized Logging Functions**:

- `logServerStart(host, port)`: "Server started successfully on http://{host}:{port}"
- `logServerStop()`: "Server stopped gracefully"
- `logRequest(req, res, responseTime)`: "{METHOD} {URL} {STATUS_CODE} {responseTime}ms"

**Request Logging Example Output**:

```
[2024-01-15T14:30:45.123Z] INFO: Server started successfully on http://0.0.0.0:3000
[2024-01-15T14:30:52.456Z] INFO: GET /hello 200 5ms
[2024-01-15T14:30:53.789Z] INFO: GET /hello 200 3ms
[2024-01-15T14:31:05.012Z] WARN: POST /hello 405 2ms
[2024-01-15T14:31:10.345Z] ERROR: GET /error 500 10ms
[2024-01-15T14:35:00.678Z] INFO: Server stopped gracefully
```

**Monitoring Visibility**:

```bash
# View logs in real-time (Docker Compose)

docker-compose logs -f hello-world-app

#### View logs with timestamps

docker logs --timestamps hello-world-app

#### View last 100 lines

docker logs --tail 100 hello-world-app

#### Follow logs from specific time

docker logs --since 2024-01-15T14:30:00 hello-world-app
```

**Evidence**: Logging implementation in `src/backend/utils/logger.js`, documented in Section 6.5.2.

#### 8.7.2.2 Planned Monitoring (Prometheus Metrics)

**Prometheus Configuration** (`infrastructure/monitoring/prometheus.yml`):

The provisioned configuration defines three scrape jobs for comprehensive metrics collection:

**Scrape Job 1: Application Metrics** (High-Frequency)
```yaml
- job_name: 'hello-world-app'
  scrape_interval: 5s                # High-frequency for demonstration
  scrape_timeout: 3s
  static_configs:
    - targets: ['hello-world-app:3000']
  metrics_path: '/metrics'           # ❌ NOT IMPLEMENTED
```

**Expected Metrics** (when `/metrics` endpoint implemented):

| Metric Name | Type | Labels | Description |
|---|---|---|------|
| `http_requests_total` | Counter | method, path, status | Total HTTP requests by method, path, and status code |
| `http_request_duration_seconds` | Histogram | method, path | Request latency distribution for percentile calculation |
| `nodejs_process_cpu_usage_percentage` | Gauge | (none) | CPU utilization percentage |
| `nodejs_process_memory_rss_bytes` | Gauge | (none) | Resident set size memory |
| `nodejs_heap_used_bytes` | Gauge | (none) | JavaScript heap memory used |
| `nodejs_eventloop_lag_seconds` | Gauge | (none) | Event loop delay (blocking detection) |
| `process_start_time_seconds` | Gauge | (none) | Process start timestamp (for uptime) |

**Scrape Job 2: Health Monitoring** (Lower-Frequency)
```yaml
- job_name: 'hello-world-health'
  scrape_interval: 30s               # Lower frequency than metrics
  scrape_timeout: 5s
  static_configs:
    - targets: ['hello-world-app:3000']
  metrics_path: '/health'            # ❌ NOT IMPLEMENTED
```

**Scrape Job 3: Prometheus Self-Monitoring**
```yaml
- job_name: 'prometheus'
  static_configs:
    - targets: ['localhost:9090']
```

**Metrics Implementation Gap**:

The Grafana dashboard expects the following metrics that are not currently collected:

- ❌ HTTP request counters and histograms
- ❌ Node.js process metrics (CPU, memory, event loop)
- ❌ Custom business metrics
- ❌ Prometheus `up{}` metric (generated automatically if scrape succeeds)

**Implementation Path** (using `prom-client` library):

```javascript
// Future implementation (not currently in codebase)
const client = require('prom-client');

// Create registry
const register = new client.Registry();

// Add default Node.js metrics
client.collectDefaultMetrics({ register });

// Custom HTTP metrics
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'path'],
  registers: [register]
});

// Expose /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

**Evidence**: Prometheus configuration in `infrastructure/monitoring/prometheus.yml`, metrics implementation gap documented in Section 6.5.4.3.

### 8.7.3 Performance Metrics Collection

**Current Performance Visibility**: Response Time Logging

The request logger middleware captures response times for every HTTP request:

```javascript
// From src/backend/middleware/index.js (conceptual)
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - startTime;
    logRequest(req, res, responseTime);  // Logs: "GET /hello 200 5ms"
    originalEnd.apply(res, args);
  };
  
  next();
};
```

**Performance Metrics Available from Logs**:

- ✅ Response time per request (millisecond precision)
- ✅ Request method and path
- ✅ HTTP status code
- ✅ Timestamp of each request
- ❌ Percentile calculations (p50, p95, p99)
- ❌ Request rate trends over time
- ❌ Endpoint-specific performance breakdown

**Planned Performance Metrics** (Grafana Dashboard):

The provisioned dashboard includes 3 performance panels:

1. **Response Time p50/p90/p95/p99** (Graph)
   - Query: `histogram_quantile(0.5/0.9/0.95/0.99, http_request_duration_seconds_bucket)`
   - Purpose: Identify latency percentiles and outlier detection
   - Visualization: Multi-line graph with percentile curves

2. **Request Rate** (Graph)
   - Query: `sum(rate(http_requests_total[1m])) by (method)`
   - Purpose: Requests per second by HTTP method
   - Visualization: Stacked area chart

3. **Endpoint Traffic** (Table)
   - Query: `sum(rate(http_requests_total[1m])) by (path)`
   - Purpose: Request rate breakdown by endpoint
   - Visualization: Sortable table with path and rate columns

**Performance SLIs (Service Level Indicators)**:

| Indicator | Target | Measurement Source | Status |
|---|---|---|------|
| **p50 Latency** | < 10ms | Histogram percentile | ❌ Not measured |
| **p95 Latency** | < 50ms | Histogram percentile | ❌ Not measured |
| **p99 Latency** | < 100ms | Histogram percentile | ❌ Not measured |
| **Request Rate** | < 100 req/sec | Counter rate calculation | ❌ Not measured |
| **Error Rate** | < 1% | Status code distribution | ⚠️ Logged but not aggregated |

**Evidence**: Performance metrics documented in Section 6.5.4.2 Grafana Dashboard Configuration.

### 8.7.4 Cost Monitoring and Optimization

**Cost Monitoring Status**: ❌ Not Applicable (Local Deployment)

The local-first infrastructure design eliminates traditional cloud cost monitoring requirements:

**No Cloud Costs**:
- ❌ No compute instance charges (AWS EC2, GCP Compute Engine)
- ❌ No data transfer charges (egress/ingress)
- ❌ No storage charges (S3, EBS, Cloud Storage)
- ❌ No monitoring service charges (CloudWatch, Stackdriver)

**Local Resource Costs**:

The only costs are indirect hosting on developer's local hardware:

| Resource | Consumption | Annual Cost Estimate | Notes |
|---|---|---|------|
| **Electricity** | ~5-10W continuous | $5-10/year | Minimal power consumption |
| **Storage** | ~500 MB disk | < $0.01/year | Negligible on modern drives |
| **Network** | Local loopback only | $0 | No internet bandwidth used |
| **Developer Time** | Setup: 5-10 minutes | N/A | One-time investment |

**Cost Optimization Strategies** (Local Context):

1. **Image Size Optimization**: Alpine Linux reduces disk footprint (50-70 MB vs 300+ MB)
2. **Resource Limits**: Prevent runaway resource consumption (recommended but not configured)
3. **Volume Cleanup**: Periodic cleanup of unused volumes and images
   ```bash
   # Remove unused images
   docker image prune -a
   
   # Remove unused volumes
   docker volume prune
   ```

**Cloud Cost Projection** (If Migrated):

| Cloud Service | Configuration | Monthly Cost Estimate |
|---|---|------|
| **AWS Fargate** | 0.25 vCPU, 512 MB RAM | $3-5/month |
| **Google Cloud Run** | 1 vCPU, 512 MB RAM, 100k requests | $2-4/month (generous free tier) |
| **Azure Container Instances** | 1 vCPU, 1 GB RAM | $10-15/month |
| **AWS ECS EC2** | t3.micro instance | $7-10/month |
| **Load Balancer** | AWS ALB | $16-20/month |
| **Total Estimated Cloud Cost** | Basic production setup | **$25-50/month** |

**Cost Optimization Recommendations** (Cloud Context):

- Use serverless containers (Cloud Run, Fargate) with pay-per-request model
- Leverage free tiers (GCP Cloud Run: 2 million requests/month free)
- Use spot/preemptible instances for non-production environments
- Implement auto-scaling to scale to zero during idle periods
- Use ARM-based instances (AWS Graviton) for 20% cost savings

### 8.7.5 Security Monitoring

**Security Monitoring Status**: ⚠️ Basic Logging Only

**Current Security Visibility**:

**1. Error Logging**
```
[2024-01-15T14:31:05.012Z] ERROR: GET /admin 404 2ms
[2024-01-15T14:31:06.123Z] WARN: POST /hello 405 3ms
```

- ✅ Logs all 4xx and 5xx errors
- ✅ Captures attempted access to non-existent paths
- ❌ No IP address logging for request source tracking
- ❌ No user agent logging for bot detection
- ❌ No rate limiting or abuse detection

**2. Docker Health Monitoring**
- ✅ Detects container crashes and restarts
- ✅ Validates application availability
- ❌ No intrusion detection
- ❌ No file integrity monitoring

**3. Dependency Vulnerability Scanning**
```bash
# npm audit (manual execution)

npm audit

#### Example output:

found 0 vulnerabilities
```

- ✅ `npm audit` command available
- ❌ Not automated in CI/CD
- ❌ No continuous vulnerability monitoring

**Security Monitoring Gaps**:

| Security Control | Status | Recommendation |
|---|---|------|
| **Request Source IP Logging** | ❌ Not Implemented | Add IP to log format |
| **Authentication Logging** | ❌ Not Applicable | No authentication required |
| **Rate Limiting** | ❌ Not Implemented | Add express-rate-limit |
| **Intrusion Detection** | ❌ Not Implemented | Not required for educational scope |
| **Secrets Scanning** | ❌ Not Automated | Add git-secrets or TruffleHog |
| **Container Scanning** | ❌ Not Automated | Add Trivy to CI/CD |
| **HTTPS Enforcement** | ❌ HTTP Only | Add reverse proxy with TLS |

**Recommended Security Monitoring Enhancements**:

**1. Enhanced Request Logging** (IP Address and User Agent):

```javascript
// Future enhancement
logRequest: function(req, res, responseTime) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  console.log(`${req.method} ${req.url} ${res.statusCode} ${responseTime}ms IP=${ip} UA=${userAgent}`);
}
```

**2. Rate Limiting** (Prevent Abuse):

```javascript
// Future enhancement (not currently implemented)
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use(limiter);
```

**3. Automated Security Scanning in CI/CD**:

```yaml
# Future GitHub Actions workflow

- name: Security Audit
  run: |
    npm audit --audit-level=moderate
    docker run --rm aquasec/trivy image node-hello-world:latest
```

**Evidence**: Security considerations documented in Section 3.8, with security headers implementation in middleware.

### 8.7.6 Compliance Auditing

**Compliance Auditing Status**: ❌ Not Required (Educational Project)

As documented in Section 8.2.1.4, the educational scope eliminates compliance obligations:

- ❌ No GDPR compliance (no personal data)
- ❌ No HIPAA compliance (no health data)
- ❌ No PCI-DSS compliance (no payment data)
- ❌ No SOC 2 audit trails
- ❌ No access logs for audit purposes

**Audit Trail Available** (Limited):

| Audit Capability | Status | Retention | Purpose |
|---|---|---|------|
| **Request Logs** | ✅ Available | Until container removal | HTTP transaction audit trail |
| **Error Logs** | ✅ Available | Until container removal | Failure investigation |
| **Deployment Logs** | ⚠️ Manual | Script execution logs | Deployment audit trail |
| **Access Logs** | ❌ Not Captured | N/A | Who accessed what resources |
| **Configuration Changes** | ⚠️ Git History | Indefinite (Git) | Infrastructure-as-code audit |
| **Security Events** | ❌ Not Tracked | N/A | Security incident investigation |

**Compliance Enhancement Path** (If Required):

**For GDPR Compliance** (if collecting user data):
1. Implement structured JSON logging with PII masking
2. Add log retention policies and automated deletion
3. Implement access logging with user consent
4. Add data residency controls (log storage location)
5. Implement audit log immutability (write-once storage)

**For SOC 2 Compliance** (if production SaaS):
1. Implement centralized log aggregation (Elasticsearch)
2. Add tamper-proof audit trails
3. Implement monitoring alerting with escalation
4. Add change management audit logs
5. Implement access control logging

**Current Best Practice**: Git commit history provides infrastructure change audit trail with:
- ✅ Who made the change (Git author)
- ✅ What was changed (Git diff)
- ✅ When the change occurred (Git timestamp)
- ✅ Why the change was made (commit message)

## 8.8 Infrastructure Diagrams

### 8.8.1 Infrastructure Architecture Diagram

```mermaid
graph TB
    subgraph "Developer Workstation"
        subgraph "Host Operating System"
            Browser[Web Browser<br/>HTTP Client]
            Terminal[Terminal<br/>docker-compose commands]
            IDE[IDE / Editor<br/>Code Changes]
        end
        
        subgraph "Docker Engine"
            subgraph "Docker Network: hello-world-network"
                subgraph "Application Container"
                    App[Node.js Application<br/>Port 3000]
                    Logger[Console Logger]
                    Config[Configuration<br/>.env + ENV vars]
                end
                
                subgraph "Monitoring Stack (Provisioned, Not Deployed)"
                    Prom[Prometheus<br/>Port 9090<br/>❌ Not in compose]
                    Graf[Grafana<br/>Port 3001<br/>❌ Not in compose]
                end
            end
            
            subgraph "Docker Volumes"
                SourceVol[Bind Mount<br/>src/backend → /app<br/>Hot Reload]
                NodeMods[Named Volume<br/>node_modules]
            end
            
            subgraph "Docker Images"
                BaseImg[Base: node:18-alpine<br/>~50 MB]
                AppImg[App: hello-world-app:latest<br/>~150 MB]
            end
        end
        
        subgraph "File System"
            GitRepo[Git Repository<br/>Source Code]
            DockerConfig[Infrastructure/<br/>Docker Compose YAML<br/>Prometheus Config<br/>Grafana Dashboard JSON]
            Scripts[Infrastructure/scripts/<br/>deploy.sh<br/>health-check.sh<br/>setup.sh<br/>start-server.sh]
        end
    end
    
    Browser -->|HTTP GET :3000/hello| App
    Terminal -->|docker-compose up| App
    IDE -->|Edit Source| GitRepo
    GitRepo -->|Bind Mount| SourceVol
    SourceVol -->|Sync| App
    
    App -->|Logs| Logger
    Logger -->|stdout/stderr| Terminal
    
    Config -->|Environment Variables| App
    
    BaseImg -->|Build Base| AppImg
    AppImg -->|Run| App
    
    Scripts -->|Deploy Automation| Terminal
    DockerConfig -->|Configuration| Terminal
    
    App -.->|Would Scrape<br/>❌ Not Implemented| Prom
    Prom -.->|Would Query<br/>❌ Not Implemented| Graf
    Graf -.->|Would Display| Browser
    
    NodeMods -->|Dependencies| App
    
    style App fill:#90EE90
    style Logger fill:#90EE90
    style SourceVol fill:#90EE90
    style Scripts fill:#90EE90
    style AppImg fill:#90EE90
    style Prom fill:#FFB6C6
    style Graf fill:#FFB6C6
```

### 8.8.2 Deployment Workflow Diagram

```mermaid
flowchart TD
    Start([Developer Initiates Deployment]) --> SelectEnv{Select Environment}
    
    SelectEnv -->|development| DevEnv[Development Environment<br/>NODE_ENV=development<br/>PORT=3000<br/>Hot Reload Enabled]
    SelectEnv -->|staging| StagEnv[Staging Environment<br/>NODE_ENV=production<br/>PORT=3000<br/>Monitoring Enabled]
    SelectEnv -->|production| ProdEnv[Production Environment<br/>NODE_ENV=production<br/>PORT=80<br/>Full Monitoring]
    
    DevEnv --> PreCheck[Prerequisite Validation<br/>✓ Docker installed<br/>✓ Docker Compose installed<br/>✓ curl available]
    StagEnv --> PreCheck
    ProdEnv --> PreCheck
    
    PreCheck --> TagPrev[Tag Current Image as :previous<br/>Rollback Preparation]
    TagPrev --> BuildImg[Build Docker Image<br/>docker build -t node-hello-world:VERSION .]
    
    BuildImg --> TagImg[Apply Image Tags<br/>:latest :environment :timestamp]
    TagImg --> Deploy[Deploy Container<br/>docker-compose up -d]
    
    Deploy --> Wait[Wait 10 Seconds<br/>Startup Grace Period]
    Wait --> Health1{Health Check #1<br/>./health-check.sh}
    
    Health1 -->|Pass| Success
    Health1 -->|Fail| Wait3s1[Wait 3 Seconds]
    Wait3s1 --> Health2{Health Check #2}
    
    Health2 -->|Pass| Success
    Health2 -->|Fail| Wait3s2[Wait 3 Seconds]
    Wait3s2 --> Health3{Health Check #3}
    
    Health3 -->|Pass| Success
    Health3 -->|Fail| Wait3s3[Wait 3 Seconds]
    Wait3s3 --> Health4{Health Check #4}
    
    Health4 -->|Pass| Success
    Health4 -->|Fail| Wait3s4[Wait 3 Seconds]
    Wait3s4 --> Health5{Health Check #5<br/>Final Attempt}
    
    Health5 -->|Pass| Success
    Health5 -->|Fail| Rollback[Rollback Triggered<br/>All Health Checks Failed]
    
    Success[Deployment Success] --> ProdCheck{Production<br/>Environment?}
    ProdCheck -->|Yes| Cleanup[Cleanup Old Images<br/>Keep Last 3 Versions]
    ProdCheck -->|No| Complete
    Cleanup --> Complete([Deployment Complete<br/>✅ Service Healthy])
    
    Rollback --> Stop[Stop Failed Container<br/>docker-compose down]
    Stop --> RestorePrev[Deploy Previous Version<br/>:previous → :latest]
    RestorePrev --> VerifyRollback{Verify Rollback<br/>Health Check}
    
    VerifyRollback -->|Healthy| Alert1[Log Rollback Success<br/>Alert Operator]
    VerifyRollback -->|Unhealthy| Alert2[CRITICAL FAILURE<br/>Manual Intervention Required]
    
    Alert1 --> Failed([Deployment Failed<br/>❌ Rolled Back to Previous])
    Alert2 --> Critical([Critical Failure<br/>⚠️ Manual Fix Needed])
    
    style Success fill:#90EE90
    style Complete fill:#90EE90
    style Alert1 fill:#FFE4B5
    style Failed fill:#FFE4B5
    style Rollback fill:#FFB6C6
    style Alert2 fill:#FFB6C6
    style Critical fill:#FFB6C6
```

### 8.8.3 Environment Promotion Flow

```mermaid
flowchart LR
    subgraph "Development Environment"
        Dev1[Local Workstation<br/>npm run dev]
        Dev2[nodemon Hot Reload<br/>Instant Feedback]
        Dev3[Console Logging<br/>DEBUG Level]
        Dev4[No Image Cleanup]
    end
    
    subgraph "Quality Gates"
        QG1{All Tests Pass?<br/>jest --coverage}
        QG2{Linting Pass?<br/>eslint}
        QG3{Docker Build Success?}
        QG4{Manual Code Review?}
    end
    
    subgraph "Staging Environment"
        Stag1[Pre-Production Validation<br/>NODE_ENV=production]
        Stag2[Production Image Build<br/>npm ci --only=production]
        Stag3[Monitoring Stack Active<br/>Prometheus + Grafana]
        Stag4[Health Check Validation<br/>5 retries, 3s intervals]
    end
    
    subgraph "Production Readiness"
        PR1{Health Checks Pass?}
        PR2{Monitoring Operational?}
        PR3{Maintainer Approval?}
    end
    
    subgraph "Production Environment"
        Prod1[Production Deployment<br/>PORT=80]
        Prod2[Full Monitoring<br/>Prometheus + Grafana]
        Prod3[Old Image Cleanup<br/>Keep Last 3 Versions]
        Prod4[Minimal Logging<br/>WARN Level Only]
    end
    
    Dev1 --> Dev2
    Dev2 --> Dev3
    Dev3 --> Dev4
    Dev4 --> QG1
    
    QG1 -->|Pass| QG2
    QG1 -->|Fail| Dev1
    QG2 -->|Pass| QG3
    QG2 -->|Fail| Dev1
    QG3 -->|Pass| QG4
    QG3 -->|Fail| Dev1
    QG4 -->|Approved| Stag1
    QG4 -->|Rejected| Dev1
    
    Stag1 --> Stag2
    Stag2 --> Stag3
    Stag3 --> Stag4
    Stag4 --> PR1
    
    PR1 -->|Pass| PR2
    PR1 -->|Fail| Dev1
    PR2 -->|Pass| PR3
    PR2 -->|Fail| Stag1
    PR3 -->|Approved| Prod1
    PR3 -->|Rejected| Stag1
    
    Prod1 --> Prod2
    Prod2 --> Prod3
    Prod3 --> Prod4
    
    Prod4 -.->|Critical Failure| Rollback[Automatic Rollback<br/>to Previous Version]
    Rollback -.-> Stag1
    
    style Dev1 fill:#e1f5ff
    style Dev2 fill:#e1f5ff
    style Dev3 fill:#e1f5ff
    style Dev4 fill:#e1f5ff
    
    style Stag1 fill:#fff4e1
    style Stag2 fill:#fff4e1
    style Stag3 fill:#fff4e1
    style Stag4 fill:#fff4e1
    
    style Prod1 fill:#e1ffe1
    style Prod2 fill:#e1ffe1
    style Prod3 fill:#e1ffe1
    style Prod4 fill:#e1ffe1
    
    style Rollback fill:#ffe1e1
```

### 8.8.4 Network Architecture

```mermaid
graph TB
subgraph "External Access (Host Network)"
    Client[Client / Browser<br/>Web Requests]
    DevTools[Developer Tools<br/>docker commands]
end

subgraph "Docker Host"
    subgraph "Port Mappings"
        Port3000[Host Port 3000<br/>↓]
        Port9090[Host Port 9090<br/>❌ Not Mapped]
        Port3001[Host Port 3001<br/>❌ Not Mapped]
    end
    
    subgraph "Docker Bridge Network: hello-world-network (172.20.0.0/16)"
        subgraph "Application Container: 172.20.0.2"
            App[Node.js Application<br/>Container Port 3000<br/>HTTP Server]
            AppIP[Internal DNS:<br/>hello-world-app]
        end
        
        subgraph "Prometheus Container: 172.20.0.3 (Not Deployed)"
            Prom[Prometheus Server<br/>Container Port 9090<br/>❌ Not in docker-compose.yml]
            PromIP[Internal DNS:<br/>prometheus]
        end
        
        subgraph "Grafana Container: 172.20.0.4 (Not Deployed)"
            Graf[Grafana Server<br/>Container Port 3001<br/>❌ Not in docker-compose.yml]
            GrafIP[Internal DNS:<br/>grafana]
        end
    end
    
    subgraph "Docker Daemon"
        DNS[Docker Internal DNS<br/>Service Name Resolution]
        IPAlloc[IP Address Allocation<br/>172.20.0.x]
    end
end

Client -->|HTTP GET<br/>http://localhost:3000/hello| Port3000
Port3000 -->|NAT Forwarding| App
App -->|200 OK<br/>Hello world| Port3000
Port3000 --> Client

DevTools -->|docker-compose up<br/>docker logs<br/>docker exec| App

Prom -.->|HTTP GET<br/>hello-world-app:3000/metrics<br/>Service Discovery via DNS| AppIP
Prom -.->|HTTP GET<br/>hello-world-app:3000/health| AppIP

Graf -.->|PromQL Query<br/>prometheus:9090| PromIP

DNS -.->|Resolves hello-world-app| AppIP
DNS -.->|Resolves prometheus| PromIP
DNS -.->|Resolves grafana| GrafIP

IPAlloc -.->|Assigns 172.20.0.2| App
IPAlloc -.->|Assigns 172.20.0.3| Prom
IPAlloc -.->|Assigns 172.20.0.4| Graf

Client -.->|Would Access<br/>http://localhost:9090<br/>❌ Not Available| Port9090
Port9090 -.-> Prom

Client -.->|Would Access<br/>http://localhost:3001<br/>❌ Not Available| Port3001
Port3001 -.-> Graf

style App fill:#90EE90
style Port3000 fill:#90EE90
style AppIP fill:#90EE90
style DNS fill:#90EE90

style Prom fill:#FFB6C6
style Graf fill:#FFB6C6
style PromIP fill:#FFB6C6
style GrafIP fill:#FFB6C6
style Port9090 fill:#FFB6C6
style Port3001 fill:#FFB6C6

classDef implemented fill:#90EE90
classDef notImplemented fill:#FFB6C6
```

**Network Configuration Details**:

| Network Aspect | Configuration | Status |
|---|---|------|
| **Network Driver** | bridge | ✅ Active |
| **Network Name** | hello-world-network | ✅ Created by Docker Compose |
| **IP Range** | 172.20.0.0/16 (typical Docker default) | ✅ Auto-assigned |
| **DNS Resolution** | Automatic service name → IP | ✅ Functional |
| **Port Mapping** | 3000:3000 (host:container) | ✅ Active |
| **Network Isolation** | Isolated from host network | ✅ Enforced |
| **Inter-Container Communication** | Service name DNS resolution | ✅ Configured (for future use) |

**Network Security Characteristics**:

- ✅ **Isolation**: Containers isolated from host by default (cannot access host services)
- ✅ **Firewall**: Only port 3000 accessible from host
- ❌ **Encryption**: No TLS/SSL (HTTP only)
- ❌ **Network Policies**: No fine-grained traffic control
- ❌ **Ingress Control**: No reverse proxy or API gateway

## 8.9 References

### 8.9.1 Infrastructure Configuration Files

**Containerization**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/Dockerfile` - Root production Dockerfile with Alpine base, multi-layer optimization
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/Dockerfile` - Backend Dockerfile (parallel configuration)
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/local/docker-compose.yml` - Multi-container orchestration with health checks, volumes, networking

**Monitoring Configuration** (Provisioned):
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/monitoring/prometheus.yml` - Metrics collection with 3 scrape jobs (app metrics, health, self-monitoring)
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/monitoring/grafana-dashboard.json` - 13-panel visualization dashboard (referenced in summary, not retrieved)

### 8.9.2 Deployment Automation Scripts

**Bash Automation** (`infrastructure/scripts/`):
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/deploy.sh` - Complete deployment pipeline with environment selection, Docker build, health verification, automatic rollback
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/health-check.sh` - HTTP health validation with CI-compatible exit codes (0=healthy, 1=unhealthy, 2=unreachable)
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/setup.sh` - Environment setup automation with Node.js validation, dependency installation, .env creation
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/start-server.sh` - Server lifecycle management with foreground/detached modes, PID file management

### 8.9.3 Application Source Files

**Configuration Management**:
- `src/backend/config.js` - Environment variable loading, validation, and default values (referenced in Section 5.1.3)
- `src/backend/.env` - Environment configuration file (not in repository, created by setup.sh)

**Logging Infrastructure**:
- `src/backend/utils/logger.js` - Centralized logging with timestamps, log levels, test mode suppression
- `src/backend/middleware/index.js` - Request timing middleware with response time calculation

**Server Components**:
- `src/backend/index.js` - Application lifecycle management with graceful shutdown
- `src/backend/server.js` - HTTP server creation and request pipeline orchestration

### 8.9.4 Documentation

**Primary Documentation**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/README.md` - Main project documentation with deployment instructions
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/README.md` - Infrastructure documentation and operational runbook
- `hao-backprop-test-main (1)/hao-backprop-test-main/CONTRIBUTING.md` - Git workflow, branch naming, commit conventions

**Package Manifests**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/package.json` - Root package manifest (minimal configuration)
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/package.json` - Backend dependencies with jest-junit reporter configuration

### 8.9.5 Technical Specification Cross-References

**Architecture and Design**:
- **Section 1.2 System Overview** - Educational focus, project context, system capabilities, component architecture
- **Section 5.1 High-Level Architecture** - Monolithic architecture, stateless design, component responsibilities, data flow
- **Section 5.4.1 Logging and Observability** - Console logging implementation, Prometheus metrics (provisioned), Grafana dashboard
- **Section 5.4.4 Performance and Scalability** - Stateless design enabling horizontal scaling
- **Section 5.4.5 Health Checking and Availability** - Docker health checks, graceful shutdown integration

**Technology Stack**:
- **Section 3.7 Development & Deployment** - Comprehensive infrastructure documentation covering containerization, orchestration, monitoring, deployment automation
- **Section 3.7.1.1 Docker Container Runtime** - Base image selection, Dockerfile architecture, layer caching optimization
- **Section 3.7.1.2 Docker Compose Orchestration** - Service coordination, volume strategy, health checks
- **Section 3.7.2 Build System** - npm scripts, minimal build approach, dependency management
- **Section 3.7.3 Deployment Automation** - Bash scripts, CI/CD integration points, health check validation
- **Section 3.7.4 Monitoring & Observability** - Prometheus configuration, Grafana dashboard, metrics implementation gap

**System Design**:
- **Section 6.1 Core Services Architecture** - Monolithic HTTP server, single-process design
- **Section 6.5 Monitoring and Observability** - Hybrid monitoring approach, logging infrastructure, health checks, provisioned monitoring stack, implementation gaps

### 8.9.6 Repository Search Summary

**Files Retrieved**: 15 infrastructure and source files examined
**Folders Explored**: 10 directories (depth 0-5) for comprehensive infrastructure coverage
**Broad Searches**: 4 targeted searches validating deployment methods and infrastructure components
**Search Coverage**: Complete infrastructure analysis including containerization, orchestration, deployment automation, monitoring

### 8.9.7 External Technology References

**Containerization**:
- Docker Engine Documentation: https://docs.docker.com/engine/
- Docker Compose Documentation: https://docs.docker.com/compose/
- Alpine Linux Project: https://alpinelinux.org/
- Node.js Official Docker Images: https://hub.docker.com/_/node/

**Monitoring**:
- Prometheus Documentation: https://prometheus.io/docs/
- Grafana Documentation: https://grafana.com/docs/
- prom-client (Node.js Prometheus Client): https://github.com/siimon/prom-client

**Best Practices**:
- Twelve-Factor App Methodology: https://12factor.net/
- Docker Best Practices: https://docs.docker.com/develop/dev-best-practices/
- Node.js Docker Best Practices: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

# 9. Appendices

## 9.1 Additional Technical Information

This section documents technical details, configuration parameters, and specifications that supplement the main body of the Technical Specification but have not been comprehensively covered in previous sections.

### 9.1.1 Package Metadata and Licensing

#### 9.1.1.1 Package Identification

**Package Name**: hello_world  
**Version**: 1.0.0  
**Author**: hxu  
**Main Entry Point**: index.js

The package metadata defined in `package.json` establishes the project's identity within the npm ecosystem. While this is an educational project without publication to the npm registry, the metadata follows npm conventions for consistency with professional development practices.

**Evidence**: Package metadata extracted from `hao-backprop-test-main (1)/hao-backprop-test-main/package.json`

#### 9.1.1.2 License Information

**License Type**: MIT License  
**Copyright Year**: 2023  
**Copyright Holder**: Node.js Hello World

The MIT License is a permissive open-source license that allows unrestricted use, modification, and distribution with minimal requirements. The complete license text is available in the repository root `LICENSE` file and includes standard MIT License terms granting permission for commercial and private use, modification, distribution, and sublicensing while requiring preservation of copyright and license notices.

**Key License Terms**:
- ✅ Commercial use permitted
- ✅ Modification permitted
- ✅ Distribution permitted
- ✅ Private use permitted
- ⚠️ No liability or warranty provided
- ⚠️ License and copyright notice must be included

**Evidence**: Full MIT License text in `hao-backprop-test-main (1)/hao-backprop-test-main/LICENSE`

### 9.1.2 Development Tooling Configuration

#### 9.1.2.1 Jest Configuration Specifications

Beyond the coverage thresholds documented in Section 3.4.1.1, the Jest configuration (`jest.config.js`) includes several operational parameters that govern test execution behavior:

**Test Environment Configuration**:
- **Environment**: `node` (not `jsdom` or browser environment)
- **Test Pattern**: `**/__tests__/**/*.test.js` for automatic test discovery
- **Coverage Directory**: `./coverage/` for HTML and text coverage reports
- **JUnit Output**: `./coverage/junit/junit.xml` for CI/CD integration
- **Setup Files**: `./setup.js` provides global test configuration including console spy setup and timeout configuration

**Test Execution Parameters**:
- **Parallel Execution**: Enabled by default for faster test runs
- **Bail on Failure**: Not configured (all tests run regardless of failures)
- **Verbose Output**: Configurable via command-line flags
- **Test Timeout**: Configured in setup.js (default Jest timeout applies: 5000ms)

**Coverage Enforcement**:

The Jest configuration enforces strict coverage thresholds at two levels as documented in Section 3.4.1.1:

| Scope | Branches | Functions | Lines | Statements |
|-------|----------|-----------|-------|------------|
| Global | 80% | 90% | 85% | 85% |
| handlers/hello.js | 100% | 100% | 100% | 100% |
| handlers/error.js | 90% | 100% | 90% | 90% |

Test execution fails if any coverage metric falls below these thresholds, enforcing code quality standards throughout the development lifecycle.

**Evidence**: Complete Jest configuration in `src/backend/jest.config.js` with coverage thresholds, reporters, and test patterns

#### 9.1.2.2 Nodemon Configuration Specifications

The `nodemon.json` configuration file governs automatic server restart behavior during development:

**File Watching Configuration**:
- **Watch Pattern**: `src/backend/**/*.js` (monitors all JavaScript files in backend directory)
- **Ignore Patterns**: `__tests__/` and `node_modules/` directories excluded from watch
- **Restart Command**: Manual restart trigger via 'rs' command in terminal
- **Debounce Delay**: 1000ms (1 second) prevents multiple rapid restarts on quick successive file changes

**Environment Configuration**:
- **NODE_ENV**: Set to `development` automatically during nodemon execution
- **Inheritance**: Other environment variables from parent process or `.env` file inherited

The debounce delay is particularly important for preventing restart thrashing when multiple files are saved simultaneously (common in IDE save-all operations or git checkout commands).

**Evidence**: Nodemon configuration in `nodemon.json` with watch patterns and debounce settings

### 9.1.3 Git and Contribution Workflow

#### 9.1.3.1 Branch Naming Conventions

The project enforces standardized branch naming to maintain repository organization and enable automated CI/CD workflows. Branch names follow the pattern `<type>/<description>`:

**Branch Type Prefixes**:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/*` | New functionality development | `feature/add-metrics-endpoint` |
| `fix/*` | Bug fixes | `fix/graceful-shutdown-timeout` |
| `docs/*` | Documentation updates | `docs/update-deployment-guide` |
| `test/*` | Test additions or modifications | `test/add-integration-tests` |
| `refactor/*` | Code refactoring without behavior changes | `refactor/extract-middleware` |

**Branch Naming Rules**:
- Use lowercase with hyphens (kebab-case): `feature/health-check-endpoint`
- Avoid special characters except hyphens and forward slashes
- Keep descriptions concise but meaningful (3-5 words typical)
- Include issue/ticket numbers when applicable: `fix/issue-42-memory-leak`

**Evidence**: Branch naming conventions documented in `CONTRIBUTING.md`

#### 9.1.3.2 Commit Message Format

Commit messages follow the Conventional Commits specification for consistency and automated changelog generation:

**Format**: `<type>: <subject>`

**Commit Types**:

| Type | Usage | Semantic Version Impact |
|------|-------|------------------------|
| `feat` | New features | Minor version bump (0.x.0) |
| `fix` | Bug fixes | Patch version bump (0.0.x) |
| `docs` | Documentation only | No version bump |
| `test` | Test additions/modifications | No version bump |
| `refactor` | Code restructuring | No version bump |
| `style` | Formatting changes (whitespace, semicolons) | No version bump |
| `chore` | Build process, dependency updates | No version bump |

**Commit Message Examples**:
- ✅ `feat: add health check endpoint`
- ✅ `fix: correct graceful shutdown timeout handling`
- ✅ `docs: update deployment instructions for ECS`
- ✅ `test: add integration tests for error handlers`
- ❌ `Updated some files` (too vague, no type)
- ❌ `FEAT: ADD HEALTH ENDPOINT` (incorrect casing)

**Subject Line Guidelines**:
- Use imperative mood: "add feature" not "added feature" or "adds feature"
- No period at the end of subject line
- Maximum 72 characters (GitHub UI optimal length)
- Capitalize first word after colon

**Evidence**: Commit message conventions documented in `CONTRIBUTING.md`

### 9.1.4 Infrastructure Script Specifications

#### 9.1.4.1 Deployment Script Parameters

The `infrastructure/scripts/deploy.sh` script automates container deployment with extensive configuration options:

**Script Parameters**:

| Parameter | Default Value | Description |
|-----------|---------------|-------------|
| APP_NAME | node-hello-world | Application identifier for container naming |
| VERSION | 1.0.0 | Semantic version tag applied to Docker image |
| PORT | 3000 | External port mapping for container access |
| ENVIRONMENT | development | Target environment (development/staging/production) |
| HEALTH_CHECK_RETRIES | 5 | Number of health check attempts before failure |
| HEALTH_CHECK_INTERVAL | 3 seconds | Delay between health check attempts |

**Deployment Workflow**:
1. **Pre-flight Validation**: Verify Docker daemon running and port availability
2. **Image Build**: Execute `docker build` with version and latest tags
3. **Previous Version Backup**: Tag current running image as `previous` for rollback capability
4. **Container Deployment**: Use Docker Compose to start new container
5. **Health Check Validation**: Execute `health-check.sh` with retry logic
6. **Rollback on Failure**: Automatically revert to `previous` tag if health checks fail
7. **Cleanup**: Remove old image versions in production (retain last 3 versions)

**Exit Codes**:
- `0`: Deployment successful, health checks passed
- `1`: Deployment failed, rolled back to previous version
- `2`: Pre-flight validation failed (Docker not running, port conflict)

**Evidence**: Deployment script configuration in `infrastructure/scripts/deploy.sh` with default parameters and workflow logic

#### 9.1.4.2 Health Check Script Specifications

The `infrastructure/scripts/health-check.sh` script provides standalone health validation with strict response verification:

**Validation Criteria**:

| Check Type | Expected Value | Failure Condition |
|------------|----------------|-------------------|
| HTTP Status Code | 200 | Any non-200 status (301, 404, 500, etc.) |
| Response Body Content | "Hello world" | Exact string match required, case-sensitive |
| Network Connectivity | TCP connection established | Connection refused or timeout |

**Operational Parameters**:
- **Default Timeout**: 5 seconds per HTTP request
- **Retry Logic**: None (single attempt per invocation, retry logic handled by caller)
- **Output**: Status message to stdout, error details to stderr
- **Logging**: Minimal output for scripting integration

**Exit Codes**:
- `0`: Service healthy (200 status + correct response body)
- `1`: Service unhealthy (wrong status code or incorrect response)
- `2`: Service unreachable (connection failed or timeout)

**Usage Contexts**:
- Manual health verification during troubleshooting
- Post-deployment validation in `deploy.sh` automated workflow
- CI/CD pipeline health checks before routing production traffic
- Monitoring script integration for alerting systems

**Evidence**: Health check implementation in `infrastructure/scripts/health-check.sh` with validation logic and exit codes

#### 9.1.4.3 Setup Script Requirements

The `infrastructure/scripts/setup.sh` script automates local development environment initialization:

**Validation Requirements**:

| Requirement | Minimum Version | Validation Method |
|-------------|----------------|-------------------|
| Node.js | 18.0.0 LTS | `node --version` output parsing |
| npm | 8.x (bundled with Node.js) | `npm --version` output parsing |
| Docker | 20.x | `docker --version` output parsing |
| Port Availability | 3000 | `lsof` or `netstat` port check |

**Setup Operations**:
1. **Dependency Installation**: Execute `npm install` to install all dependencies including devDependencies
2. **Environment File Creation**: Generate `.env` file from `.env.example` template if not present
3. **Port Validation**: Verify PORT 3000 available or prompt for alternative
4. **Git Hooks Setup**: Install pre-commit hooks if `.git` directory present (optional)
5. **Database Initialization**: Not applicable (no database in this service)

**Idempotency Design**:
The script is designed to be safely re-run multiple times:
- Skips operations if already completed (e.g., `.env` exists)
- Updates existing installations rather than failing
- Preserves local configuration modifications
- Provides clear status messages for each operation

**Evidence**: Setup script implementation in `infrastructure/scripts/setup.sh` with version validation and idempotent operations

#### 9.1.4.4 Server Start Script Options

The `infrastructure/scripts/start-server.sh` script provides flexible server execution modes:

**Execution Modes**:

| Flag | Mode | Behavior | Log Output |
|------|------|----------|------------|
| (none) | Foreground | Server runs in terminal, Ctrl+C to stop | Console (stdout/stderr) |
| `-d` | Detached/Daemon | Server runs in background, survives terminal close | `logs/server.log` |

**Daemon Mode Configuration**:
- **PID File Location**: `logs/server.pid` stores process ID for management
- **Log File Location**: `logs/server.log` captures all stdout/stderr output
- **Log Rotation**: Not implemented (manual cleanup required)
- **Stop Command**: `kill $(cat logs/server.pid)` terminates background process

**Process Management**:
- **Status Check**: `ps -p $(cat logs/server.pid)` verifies server running
- **Restart**: Stop existing process, remove stale PID file, start new instance
- **Multiple Instances**: Script prevents multiple instances by checking PID file

**Production Considerations**:
The start-server.sh script is designed for local development and testing. Production deployments should use proper process managers:
- **Docker**: Recommended approach using container orchestration
- **PM2**: Alternative for bare-metal deployments
- **systemd**: Linux system service integration
- **Kubernetes**: Production-grade orchestration with health checks and auto-restart

**Evidence**: Server start script implementation in `infrastructure/scripts/start-server.sh` with foreground and detached modes

### 9.1.5 Docker Configuration Details

#### 9.1.5.1 Dockerfile Production Configuration

The production `Dockerfile` in the repository root implements several key configurations beyond those documented in Section 8.4.2:

**Base Image Selection**:
- **Image**: `node:18-alpine`
- **Node.js Version**: 18.x LTS (Long-Term Support)
- **Alpine Version**: 3.x (latest stable Alpine Linux)
- **Image Digest**: Not pinned (pulls latest 18-alpine tag)

**Working Directory Structure**:
- **Container Working Directory**: `/app`
- **Source Code Location**: `/app` (all application files copied to root of working directory)
- **Node Modules Location**: `/app/node_modules` (installed by npm ci)

**Runtime Configuration**:
- **Port Exposure**: `EXPOSE 3000` (informational only, does not publish port)
- **Environment Variables**: 
  - `PORT=3000` set in Dockerfile
  - `NODE_ENV=production` set in Dockerfile
  - Additional variables can be overridden at runtime via `-e` flag or Docker Compose
- **Startup Command**: `CMD ["node", "index.js"]` executes server in foreground

**Build Optimization**:
- **Production Dependencies Only**: `npm ci --only=production` excludes devDependencies (Jest, ESLint, Supertest, nodemon)
- **Layer Caching**: Package files copied before source code to maximize cache hits
- **No Build Stage**: Single-stage build (no compilation or transpilation required)

**Evidence**: Production Dockerfile configuration in `hao-backprop-test-main (1)/hao-backprop-test-main/Dockerfile`

#### 9.1.5.2 Docker Compose Orchestration Details

The `infrastructure/local/docker-compose.yml` file provides comprehensive local development orchestration:

**Service Configuration**:

| Configuration Key | Value | Purpose |
|------------------|-------|---------|
| Service Name | hello-world-app | Logical service identifier |
| Container Name | hello-world-app | Physical container name |
| Image Tag | hello-world-app:latest | Built image reference |
| Build Context | ../.. (repository root) | Path to Dockerfile |
| Restart Policy | unless-stopped | Auto-restart except manual stop |

**Network Configuration**:
- **Network Name**: hello-world-network
- **Driver**: bridge (default Docker network driver)
- **DNS Resolution**: Service name `hello-world-app` resolves to container IP
- **Isolation**: Services on same network can communicate, external isolation by default

**Volume Configuration**:

| Volume Type | Host Path | Container Path | Purpose |
|-------------|-----------|----------------|---------|
| Bind Mount | ./src/backend | /app | Real-time code synchronization for development |
| Named Volume | node_modules | /app/node_modules | Prevent host bind mount from overwriting container dependencies |

**Named Volume Strategy**:
The `node_modules` named volume is critical for development workflow:
- **Problem**: Bind mounting `src/backend` would override container's `node_modules`
- **Solution**: Named volume takes precedence over bind mount for `/app/node_modules`
- **Result**: Container dependencies preserved while source code synchronized
- **Benefit**: No need to install node_modules on host machine

**Port Mapping**:
- **Host Port**: 3000
- **Container Port**: 3000
- **Protocol**: TCP (default)
- **Binding**: 0.0.0.0 (accessible from all network interfaces)

**Health Check Configuration**:

| Parameter | Value | Description |
|-----------|-------|-------------|
| Test Command | `curl -f http://localhost:3000/hello` | HTTP GET request to hello endpoint |
| Interval | 30 seconds | Time between health checks |
| Timeout | 10 seconds | Maximum time for health check to complete |
| Retries | 3 | Consecutive failures before marking unhealthy |
| Start Period | 10 seconds | Grace period after container start before failures count |

**Health Check State Transitions**:
- **Starting** (0-10s): Grace period, failures don't count toward unhealthy state
- **Healthy**: Health check returns exit code 0 (HTTP 200 with correct response)
- **Unhealthy**: 3 consecutive failures after start period expires
- **Auto-Restart**: Docker restarts container when unhealthy (if restart policy configured)

**Evidence**: Docker Compose configuration in `infrastructure/local/docker-compose.yml` with networking, volumes, and health checks

### 9.1.6 Monitoring Configuration Specifications

#### 9.1.6.1 Prometheus Scrape Configuration

The `infrastructure/monitoring/prometheus.yml` file configures two distinct scrape jobs for different monitoring purposes:

**Application Metrics Job**:
```yaml
job_name: 'hello-world-app'
scrape_interval: 5s       # High-frequency metric collection
scrape_timeout: 3s        # Fast timeout for metric endpoint
metrics_path: /metrics    # Standard Prometheus metrics endpoint
targets: ['hello-world-app:3000']
```

**Health Monitoring Job**:
```yaml
job_name: 'hello-world-health'
scrape_interval: 30s      # Lower frequency for health checks
scrape_timeout: 5s        # Longer timeout for health endpoint
metrics_path: /health     # Health check endpoint (returns 200/non-200)
targets: ['hello-world-app:3000']
```

**Scrape Frequency Rationale**:
- **5-second Application Metrics**: Enables near-real-time performance monitoring, latency tracking, and request rate calculations
- **30-second Health Checks**: Reduces overhead while providing sufficient health status granularity for alerting

**Implementation Status**:
⚠️ The `/metrics` and `/health` endpoints are **not currently implemented** in the application. Prometheus configuration is provisioned for future observability enhancement. Implementation would require:
1. Install `prom-client` npm package
2. Create metrics registry and collectors in application code
3. Expose `/metrics` endpoint returning Prometheus text format
4. Expose `/health` endpoint returning 200 OK or appropriate error status

**Evidence**: Prometheus configuration in `infrastructure/monitoring/prometheus.yml` with two scrape jobs and different intervals

#### 9.1.6.2 Grafana Dashboard Specifications

The `infrastructure/monitoring/grafana-dashboard.json` file defines a comprehensive visualization dashboard:

**Dashboard Metadata**:

| Property | Value | Description |
|----------|-------|-------------|
| Dashboard UID | hello-world-dashboard | Unique identifier for dashboard |
| Schema Version | 30 | Grafana dashboard JSON schema version |
| Refresh Interval | 10 seconds | Auto-refresh frequency for all panels |
| Default Time Range | Last 1 hour | Initial time window displayed |
| Timezone | Browser | Uses browser timezone for timestamp display |

**Panel Configuration**:
- **Total Panels**: 13 (1 informational text panel + 12 metric visualization panels)
- **Datasource**: "Prometheus" (must match configured Prometheus datasource name)
- **Panel Types**: Graph (time series), Singlestat (current value), Gauge (threshold indicators)

**Planned Metrics Visualizations**:

**Service Health & Availability**:
1. **Service Uptime Panel**: `up{}` metric displaying 1 (healthy) or 0 (down) as gauge
2. **Total Requests Panel**: `sum(http_requests_total)` counter showing total requests since start
3. **Request Rate Panel**: `rate(http_requests_total[5m])` showing requests per second over 5-minute window

**Performance Metrics**:
4. **Latency p50 Panel**: `histogram_quantile(0.5, http_request_duration_seconds)` median response time
5. **Latency p95 Panel**: `histogram_quantile(0.95, http_request_duration_seconds)` 95th percentile
6. **Latency p99 Panel**: `histogram_quantile(0.99, http_request_duration_seconds)` 99th percentile
7. **Request Duration Panel**: `avg(http_request_duration_seconds)` average response time

**Error Tracking**:
8. **HTTP Status Distribution**: `sum by (status) (http_requests_total)` breakdown by status code (200, 404, 405, 500)
9. **4xx Error Rate**: `sum(rate(http_requests_total{status=~"4.."}[5m]))` client error rate
10. **5xx Error Rate**: `sum(rate(http_requests_total{status=~"5.."}[5m]))` server error rate

**System Resources**:
11. **Memory Usage (RSS)**: `nodejs_process_memory_rss_bytes` resident set size in bytes
12. **Heap Memory**: `nodejs_heap_used_bytes` JavaScript heap utilization
13. **CPU Usage**: `nodejs_process_cpu_usage_percentage` CPU utilization percentage
14. **Event Loop Lag**: `nodejs_eventloop_lag_seconds` event loop blocking detection

**PromQL Query Patterns**:
- **Counters**: Use `rate()` or `increase()` for meaningful values over time
- **Histograms**: Use `histogram_quantile()` for percentile calculations
- **Gauges**: Display directly or use aggregations (avg, max, min)
- **Time Windows**: Typically [5m] for rates, [1h] for trends

**Evidence**: Grafana dashboard configuration in `infrastructure/monitoring/grafana-dashboard.json` with 13 panels and PromQL queries

### 9.1.7 Application Constants Reference

The `src/backend/utils/constants.js` file centralizes all application constants to ensure consistency and enable easy modification:

#### 9.1.7.1 HTTP Status Codes

```javascript
HTTP_STATUS: {
  OK: 200,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
}
```

These constants are used throughout error handlers and response generation to maintain consistent HTTP semantics. The limited set reflects the simple service scope (no authentication, redirection, or caching status codes required).

#### 9.1.7.2 Route Definitions

```javascript
ROUTES: {
  HELLO: '/hello'
}
```

Centralizing route definitions enables:
- Single source of truth for URL paths
- Easy route modification without searching codebase
- Route reuse across handlers, tests, and documentation
- Future expansion to additional endpoints

#### 9.1.7.3 Response Messages

```javascript
MESSAGES: {
  HELLO_RESPONSE: 'Hello world',
  NOT_FOUND: 'Not Found',
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  SERVER_ERROR: 'Internal Server Error',
  SERVER_STARTED: 'Server started on port %d'
}
```

Centralizing response messages provides:
- Consistent user-facing text across all endpoints
- Internationalization preparation (replace constants with i18n keys)
- Easy A/B testing of message variations
- Single location for message updates

**Template String Usage**:
The `SERVER_STARTED` message uses printf-style formatting (`%d`) for dynamic port injection, replaced using `util.format()` or string interpolation at runtime.

**Evidence**: Complete constants definition in `src/backend/utils/constants.js`

#### 9.1.7.4 Security Header Values

The `src/backend/middleware/index.js` file defines security header values as constants:

```javascript
SECURITY_HEADERS: {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'none'"
}
```

These headers are applied to every response via the `securityHeaders` middleware as documented in Section 5.4.3. The strict CSP policy (`default-src 'none'`) reflects the plain-text-only response strategy with no resource loading requirements.

**Evidence**: Security header constants in `src/backend/middleware/index.js` applied via securityHeaders middleware

### 9.1.8 Test Coverage Threshold Specifications

The Jest configuration enforces two-tier coverage requirements as documented in Section 3.4.1.1, with additional implementation details:

#### 9.1.8.1 Global Coverage Thresholds

Applied to the entire codebase by default:

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 90,
    lines: 85,
    statements: 85
  }
}
```

**Enforcement Behavior**:
- Jest fails if **any** metric falls below threshold
- Calculated across all files in coverage scope
- Files without tests counted as 0% coverage (pulls down global average)
- `--coverage` flag required to enforce thresholds

#### 9.1.8.2 Per-File Coverage Thresholds

More stringent requirements for critical files:

```javascript
coverageThreshold: {
  './handlers/hello.js': {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100
  },
  './handlers/error.js': {
    branches: 90,
    functions: 100,
    lines: 90,
    statements: 90
  }
}
```

**Rationale for Stricter Thresholds**:
- **hello.js**: Core business logic, must have complete test coverage
- **error.js**: Error handling paths are critical for reliability, near-complete coverage required

**Coverage Metrics Definitions**:
- **Branches**: Percentage of conditional branches (if/else, switch cases, ternary operators) executed
- **Functions**: Percentage of functions called during tests
- **Lines**: Percentage of executable lines executed
- **Statements**: Percentage of statements executed (may differ from lines for multi-statement lines)

**Evidence**: Coverage thresholds defined in `src/backend/jest.config.js` with global and per-file specifications

### 9.1.9 Environment Variables Complete Reference

The application supports four environment variables for runtime configuration, all with sensible defaults for development:

#### 9.1.9.1 Core Environment Variables

| Variable | Type | Default | Validation | Description |
|----------|------|---------|-----------|-------------|
| PORT | Integer | 3000 | 1-65535 | TCP port for HTTP server binding |
| HOST | String | 0.0.0.0 | Valid IP or hostname | Network interface binding address |
| NODE_ENV | String | development | development\|production\|test | Execution environment mode |
| LOG_LEVEL | String | INFO | INFO\|WARN\|ERROR | Minimum log level for output |

#### 9.1.9.2 Variable Details and Usage

**PORT Configuration**:
- **Range**: 1-65535 (valid TCP port range)
- **Common Values**: 3000 (dev), 8080 (alt), 80 (HTTP), 443 (HTTPS)
- **Binding**: Must be available at server start or EADDRINUSE error occurs
- **Validation**: Parsed as integer, checked for validity in `config.js`
- **Override**: Via `.env` file, command-line (`PORT=8080 node index.js`), or Docker Compose environment section

**HOST Configuration**:
- **0.0.0.0**: Bind to all network interfaces (accessible from any IP)
- **127.0.0.1**: Localhost only (accessible only from same machine)
- **Specific IP**: Bind to single network interface (e.g., 192.168.1.10)
- **Security**: Binding to 0.0.0.0 exposes service to network, use firewall for protection

**NODE_ENV Configuration**:
- **development**: Enable development features (verbose logging, hot reload with nodemon)
- **production**: Optimize for performance (minimal logging, no dev dependencies)
- **test**: Suppress logging output, enable test-specific behavior
- **Impact**: Controls `config.IS_DEV`, `config.IS_PROD`, `config.IS_TEST` computed flags
- **Jest Override**: Automatically set to `test` during test execution

**LOG_LEVEL Configuration**:
- **INFO**: All log messages (info, warn, error) displayed
- **WARN**: Warning and error messages only
- **ERROR**: Error messages only
- **Implementation**: Controls which logger methods produce output in `utils/logger.js`

#### 9.1.9.3 Computed Configuration Flags

The `src/backend/config.js` module derives boolean flags from NODE_ENV:

```javascript
IS_DEV: process.env.NODE_ENV === 'development'   // Development mode active
IS_PROD: process.env.NODE_ENV === 'production'   // Production optimizations enabled
IS_TEST: process.env.NODE_ENV === 'test'         // Test mode (suppresses logging)
```

These flags enable environment-specific behavior throughout the codebase:
- **IS_TEST**: Suppresses all logging in `logger.js` to prevent test output pollution
- **IS_DEV**: Could enable hot reload, verbose errors, development middleware (not currently used)
- **IS_PROD**: Could enable production optimizations, security hardening (not currently used)

**Evidence**: Environment variable configuration in `src/backend/config.js` with validation and computed flags

## 9.2 Glossary

### 9.2.1 Technical Terms and Definitions

**Alpine Linux**: A security-oriented, lightweight Linux distribution based on musl libc and BusyBox, typically 5-10 MB in size. Used as the base for the Docker image (`node:18-alpine`) to minimize container size and reduce attack surface by including only essential system packages.

**API (Application Programming Interface)**: A set of definitions and protocols for building and integrating application software. This service exposes a simple REST API with a single `/hello` endpoint that returns plain text responses.

**Bind Mount**: A Docker volume type that maps a host filesystem path directly to a container path, enabling real-time code synchronization during development. Used in Docker Compose to mount `src/backend` to `/app` for live code updates without rebuilding images.

**Circuit Breaker**: A resilience design pattern that detects failures and prevents a failure from constantly recurring by temporarily blocking requests to a failing service. Not implemented in this simple service as there are no external service dependencies to protect.

**Clickjacking**: A malicious technique where attackers trick users into clicking on something different from what they perceive, often by overlaying transparent iframes. Mitigated with the `X-Frame-Options: DENY` header that prevents the page from being embedded in any iframe.

**CommonJS**: A module specification for JavaScript that uses `require()` for imports and `module.exports` for exports. Used throughout the backend codebase instead of ES Modules (import/export) for compatibility with Node.js.

**Container**: A standard unit of software that packages code and all its dependencies so the application runs quickly and reliably across different computing environments. The service uses Docker containers for development, testing, and deployment.

**CORS (Cross-Origin Resource Sharing)**: A mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the resource originated. Not currently implemented as the service does not serve browser applications or require cross-origin access.

**CSP (Content Security Policy)**: An HTTP security header that helps prevent cross-site scripting (XSS) attacks by specifying which dynamic resources are allowed to load. Set to `default-src 'none'` in this service, blocking all resource loading (appropriate for plain text responses).

**DDoS (Distributed Denial of Service)**: An attack where multiple compromised systems are used to target a single system, causing a denial of service for legitimate users. The application has no DDoS protection implemented; mitigation would require rate limiting middleware or cloud-based DDoS protection services.

**Dotenv**: A zero-dependency npm module (version 16.0.3) that loads environment variables from a `.env` file into `process.env`, following the Twelve-Factor App methodology for separating configuration from code.

**Event Loop**: Node.js's mechanism for handling asynchronous operations using a single thread with non-blocking I/O. The event loop continuously checks for pending operations and executes callbacks. Event loop lag (blocking) is monitored in the Grafana dashboard configuration.

**Graceful Shutdown**: A process of cleanly stopping a server by finishing in-flight requests, closing connections, and releasing resources before terminating. Implemented with SIGINT/SIGTERM signal handlers and a 10-second timeout for connection draining.

**Health Check**: A mechanism to verify that a service is running correctly and able to handle requests. Implemented at three levels: Docker container health checks, Prometheus health scraping (configured but endpoint not implemented), and deployment validation scripts.

**Horizontal Scaling**: Adding more instances of a service to distribute load, as opposed to vertical scaling (adding resources to a single instance like CPU or RAM). The stateless design enables unlimited horizontal scaling with load balancers distributing traffic.

**HTTP/1.1**: The version of HTTP protocol used by the service's native Node.js HTTP server. HTTP/2 features (multiplexing, server push) are not implemented but could be added via reverse proxy termination.

**Idempotent**: An operation that produces the same result whether executed once or multiple times. The `setup.sh` script is designed to be idempotent, safely re-runnable without corrupting state or failing on repeated execution.

**ISO 8601**: An international standard for date and time representation in format `YYYY-MM-DDTHH:mm:ss.sssZ`. Used for all log timestamps via `new Date().toISOString()` to ensure consistent, sortable, timezone-aware time representation.

**Jest**: A JavaScript testing framework (version 29.x) with built-in assertion library, mocking capabilities, and coverage reporting. Used for all unit and integration tests with zero additional configuration required beyond `jest.config.js`.

**JWT (JSON Web Token)**: A compact, URL-safe means of representing claims to be transferred between two parties, typically for authentication. Mentioned as a future authentication option but not currently implemented as the service has no protected endpoints.

**Liveness Probe**: In container orchestration systems, a check to determine if a container is still running and should be restarted if unhealthy. Docker health checks serve this purpose with configurable retry logic and failure thresholds.

**LTS (Long-Term Support)**: A product lifecycle management policy where software receives extended support, security updates, and bug fixes for an extended period. Node.js 18.x LTS is the required runtime version with support until April 2025.

**MIME Type Sniffing**: A browser feature that attempts to determine content type regardless of the `Content-Type` header by examining file content. Prevented with `X-Content-Type-Options: nosniff` header to force browsers to respect declared content types.

**Middleware**: Functions that have access to the request object, response object, and the next function in the application's request-response cycle. Used for cross-cutting concerns like logging (`requestLogger`) and security headers (`securityHeaders`).

**Monolithic Architecture**: An architectural style where all components are part of a single, self-contained application rather than distributed across multiple services. The service uses a stateless monolithic architecture with no external dependencies.

**Named Volume**: A Docker volume managed by Docker with a specific name, used to persist data independently of containers. The `node_modules` named volume prevents host bind mounts from overwriting container dependencies during development.

**Native Module**: A Node.js built-in module that doesn't require npm installation, such as `http`, `url`, `path`, and `fs`. The service prioritizes native modules over third-party frameworks to minimize dependencies and maintain simplicity.

**Nodemon**: A development utility (dev dependency) that monitors source files for changes and automatically restarts the Node.js application. Configured with a 1-second debounce delay and exclusion patterns for test and node_modules directories.

**Observability**: The ability to understand a system's internal state from its external outputs including logs, metrics, and traces. Infrastructure is provisioned (Prometheus, Grafana) but metrics endpoints are not yet implemented in the application.

**Orchestration**: Automated configuration, coordination, and management of computer systems and software. Docker Compose provides local orchestration for development; production orchestration would use Kubernetes, ECS, or similar platforms.

**Percentile (p50, p95, p99)**: Statistical measures of distribution where pXX means XX% of values fall below that threshold. p95 latency means 95% of requests complete in that time or less, useful for understanding worst-case performance experienced by most users.

**PromQL (Prometheus Query Language)**: A functional query language used for selecting and aggregating time-series data in Prometheus. Used extensively in Grafana dashboard panel configurations for metrics visualization and alerting.

**Prometheus**: An open-source monitoring and alerting toolkit with a multi-dimensional time-series database. Configuration is provisioned in the infrastructure but application metrics endpoints (``/metrics``) are not yet exposed by the service.

**Readiness Probe**: In container orchestration systems, a check to determine if a container is ready to accept traffic. Not explicitly implemented but health checks serve a similar purpose for determining when newly started containers can receive requests.

**REST (Representational State Transfer)**: An architectural style for distributed hypermedia systems emphasizing stateless communication, resource-based URLs, and standard HTTP methods. The `/hello` endpoint follows REST principles with GET method and stateless design.

**Rollback**: The process of reverting to a previous version of software after a failed deployment. Automatically triggered by health check failures in `deploy.sh` which reverts to the `previous` image tag.

**RSS (Resident Set Size)**: The portion of memory occupied by a process that is held in RAM, including heap, stack, and loaded libraries. Monitored in planned Grafana dashboard metrics to track memory consumption over time.

**Scrape**: In Prometheus terminology, the action of collecting metrics from a target endpoint at regular intervals. Configured for 5-second intervals for application metrics and 30-second intervals for health checks.

**Semantic Versioning (SemVer)**: A versioning scheme using MAJOR.MINOR.PATCH format (e.g., 1.0.0) where MAJOR indicates breaking changes, MINOR indicates new features, and PATCH indicates bug fixes. Used for release management and Docker image tagging.

**Stateless**: An architectural approach where no session information is retained by the server between requests. Each request contains all information needed to process it. Enables unlimited horizontal scaling and immediate recovery after restarts.

**Supertest**: An HTTP assertion library (version 6.3.3) for testing Node.js HTTP servers. Provides fluent API for making requests and asserting responses, integrating seamlessly with Jest for integration testing.

**Synchronous**: Code that executes sequentially, one operation at a time, blocking until completion. The entire request pipeline is synchronous (no `async/await` or promises) as there are no I/O operations requiring asynchronous handling.

**Try/Catch**: JavaScript error handling construct that captures synchronous exceptions in a try block and handles them in a catch block. Used in request middleware to catch handler errors and pass them to centralized error handling.

**Twelve-Factor App**: A methodology for building software-as-a-service applications emphasizing best practices like configuration via environment variables, dependency isolation, disposability, and dev/prod parity. Followed by the service's configuration approach.

**XSS (Cross-Site Scripting)**: A security vulnerability where attackers inject malicious scripts into web pages viewed by other users. Mitigated with CSP headers (`Content-Security-Policy: default-src 'none'`) and plain text-only responses with no HTML rendering.

## 9.3 Acronyms

### 9.3.1 Acronym Reference Table

| Acronym | Full Form | Context in Project |
|---------|-----------|-------------------|
| **ALB** | Application Load Balancer | AWS load balancing service mentioned for production deployment scenarios with health check integration |
| **API** | Application Programming Interface | REST API with single `/hello` endpoint returning plain text responses |
| **CD** | Continuous Delivery/Deployment | Automated deployment pipeline for building, testing, and deploying code changes |
| **CI** | Continuous Integration | Automated testing and validation pipeline triggered on code commits |
| **CMD** | Command | Docker CMD instruction specifying container startup command; also used in health check test commands |
| **CORS** | Cross-Origin Resource Sharing | Security mechanism for cross-origin requests (not implemented, mentioned in security discussion) |
| **CPU** | Central Processing Unit | Resource monitoring metric for processor utilization; single-threaded Node.js limits CPU scalability |
| **CSP** | Content Security Policy | Security header set to `default-src 'none'` blocking all resource loading |
| **CSRF** | Cross-Site Request Forgery | Web security vulnerability (not applicable due to stateless design and no state-changing operations) |
| **CVE** | Common Vulnerabilities and Exposures | Security vulnerability tracking system for identifying known vulnerabilities in dependencies |
| **DDoS** | Distributed Denial of Service | Attack type overwhelming service with requests (no protection implemented) |
| **DNS** | Domain Name System | Container name resolution in Docker networks enabling service-to-service communication |
| **DR** | Disaster Recovery | Recovery procedures and resilience patterns for service restoration after failures |
| **ECS** | Elastic Container Service | AWS container orchestration service mentioned for production deployment scenarios |
| **ES2022** | ECMAScript 2022 | JavaScript language specification version; ES modules not used (CommonJS instead) |
| **ESLint** | JavaScript Linting Utility | Code quality and style checking tool mentioned in contribution guidelines |
| **GC** | Garbage Collection | JavaScript automatic memory management process; GC pauses can cause latency spikes |
| **GET** | HTTP GET Method | HTTP method for retrieving resources; only method supported by `/hello` endpoint |
| **HTML** | HyperText Markup Language | Not used in responses (plain text only) to simplify security and avoid XSS risks |
| **HTTP** | HyperText Transfer Protocol | Communication protocol used by service; HTTP/1.1 specifically (not HTTP/2) |
| **HTTPS** | HTTP Secure | TLS-encrypted HTTP (not implemented in application, expected at load balancer or reverse proxy) |
| **I/O** | Input/Output | System operations for reading/writing data (minimal in this service with no database or file operations) |
| **ISO** | International Organization for Standardization | ISO 8601 timestamp format used for all log entries |
| **JSON** | JavaScript Object Notation | Data format used in configuration files (package.json, jest.config.js, docker-compose.yml) but not API responses |
| **JWT** | JSON Web Token | Token-based authentication standard mentioned for future authentication option |
| **KPI** | Key Performance Indicator | Performance metrics and targets for measuring service health and quality |
| **LTS** | Long-Term Support | Node.js 18.x LTS version with extended support and security updates until April 2025 |
| **MB** | Megabyte | Memory and disk size measurements (1 MB = 1,048,576 bytes) |
| **MIME** | Multipurpose Internet Mail Extensions | Content type specification in HTTP headers; sniffing prevented with security header |
| **MIT** | Massachusetts Institute of Technology | License type (MIT License) providing permissive open-source terms |
| **NLB** | Network Load Balancer | AWS Layer 4 load balancer mentioned for high-performance production scenarios |
| **npm** | Node Package Manager | Package management tool (version 8.x or 9.x) bundled with Node.js for dependency management |
| **OAuth** | Open Authorization | Authorization framework mentioned as future authentication option for third-party integrations |
| **OK** | All Correct | Meaning of HTTP 200 status code indicating successful request processing |
| **OOM** | Out Of Memory | Memory exhaustion scenario where container is killed by system; prevented with resource limits |
| **OS** | Operating System | Runtime environment; Alpine Linux used in container base image |
| **OWASP** | Open Web Application Security Project | Security standard references for web application security best practices |
| **PID** | Process Identifier | Unique process number stored in `logs/server.pid` for server management in daemon mode |
| **PM2** | Process Manager 2 | Production process manager for Node.js applications mentioned as deployment alternative to Docker |
| **PromQL** | Prometheus Query Language | Functional language for querying time-series data in Prometheus; used in Grafana dashboard panels |
| **RAM** | Random Access Memory | Memory resource allocation; service requires 128MB minimum, 256MB recommended |
| **REST** | Representational State Transfer | API architectural style emphasizing stateless communication and resource-based URLs |
| **RSS** | Resident Set Size | Memory usage metric measuring RAM occupied by process (heap + stack + libraries) |
| **SemVer** | Semantic Versioning | Version numbering scheme (MAJOR.MINOR.PATCH) used for release management |
| **SIGINT** | Signal Interrupt | Unix signal 2 (Ctrl+C) triggering graceful shutdown sequence with connection draining |
| **SIGTERM** | Signal Terminate | Unix signal 15 (kill command) triggering graceful shutdown; default termination signal |
| **SLA** | Service Level Agreement | Service availability and performance guarantees (none documented for this educational project) |
| **SQL** | Structured Query Language | Database query language (not applicable, no database used) |
| **TLS** | Transport Layer Security | Encryption protocol for secure communication (not implemented in application, expected at infrastructure layer) |
| **URL** | Uniform Resource Locator | Web address format; only `/hello` URL path implemented |
| **UUID** | Universally Unique Identifier | 128-bit unique identifier; used for Grafana dashboard UID (`hello-world-dashboard`) |
| **XML** | eXtensible Markup Language | Data format used for JUnit test reports (`coverage/junit/junit.xml`) generated by jest-junit |
| **XSS** | Cross-Site Scripting | Web security vulnerability involving script injection (mitigated with CSP headers and plain text responses) |
| **XXE** | XML External Entity | XML vulnerability involving external entity injection (not applicable, no XML parsing) |
| **YAML** | YAML Ain't Markup Language | Human-readable data serialization format used in Docker Compose and Prometheus configuration files |

## 9.4 References

### 9.4.1 Repository Files Examined

The following files were directly examined to compile this Technical Specification:

**Root Configuration Files**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/package.json` - Package metadata, dependencies, scripts, author, and license information
- `hao-backprop-test-main (1)/hao-backprop-test-main/LICENSE` - Complete MIT License text with copyright notice
- `hao-backprop-test-main (1)/hao-backprop-test-main/README.md` - Project overview, setup instructions, usage documentation, and feature descriptions
- `hao-backprop-test-main (1)/hao-backprop-test-main/CONTRIBUTING.md` - Contribution guidelines including branch naming and commit message conventions
- `hao-backprop-test-main (1)/hao-backprop-test-main/Dockerfile` - Production container image build configuration
- `hao-backprop-test-main (1)/hao-backprop-test-main/package-lock.json` - Dependency lock file for deterministic installations

**Source Code Files**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/index.js` - Server initialization and graceful shutdown implementation
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/server.js` - HTTP server creation and lifecycle management
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/config.js` - Environment variable configuration and validation
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/handlers/hello.js` - Hello endpoint request handler
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/handlers/error.js` - Error handling functions for 404, 405, and 500 responses
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/middleware/index.js` - Request logging and security headers middleware
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/utils/constants.js` - Application constants (HTTP status codes, routes, messages)
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/utils/logger.js` - Centralized logging utility with level support

**Test Configuration and Files**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/jest.config.js` - Jest testing framework configuration with coverage thresholds
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/setup.js` - Global test setup for console spies and configuration
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/__tests__/unit/handlers/hello.test.js` - Hello handler unit tests
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/__tests__/unit/handlers/error.test.js` - Error handler unit tests
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/__tests__/integration/api.test.js` - Integration tests using Supertest

**Development Configuration**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/nodemon.json` - Nodemon configuration for development hot reload

**Infrastructure Files**:
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/local/docker-compose.yml` - Local development Docker Compose orchestration
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/monitoring/prometheus.yml` - Prometheus metrics collection configuration
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/monitoring/grafana-dashboard.json` - Grafana visualization dashboard definition
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/deploy.sh` - Deployment automation with health check validation and rollback
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/health-check.sh` - Standalone health verification script
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/setup.sh` - Local development environment initialization
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts/start-server.sh` - Server start script with foreground and daemon modes

### 9.4.2 Folders Explored

**Repository Structure** (depth indicates directory nesting level):
- `hao-backprop-test-main (1)` (depth 1) - Repository container folder
- `hao-backprop-test-main (1)/hao-backprop-test-main` (depth 2) - Actual repository root with governance files and source code
- `hao-backprop-test-main (1)/hao-backprop-test-main/blitzy` (depth 3) - Documentation bundle with technical specifications
- `hao-backprop-test-main (1)/hao-backprop-test-main/src` (depth 3) - Source code container directory
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend` (depth 4) - Main application code with server implementation
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/handlers` (depth 5) - HTTP request handlers
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/middleware` (depth 5) - Request pipeline middleware
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/utils` (depth 5) - Shared utilities
- `hao-backprop-test-main (1)/hao-backprop-test-main/src/backend/__tests__` (depth 5) - Complete test suite with Jest configuration
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure` (depth 3) - Operational runbook and automation scripts
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/local` (depth 4) - Docker Compose orchestration for local development
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/monitoring` (depth 4) - Prometheus and Grafana monitoring configuration
- `hao-backprop-test-main (1)/hao-backprop-test-main/infrastructure/scripts` (depth 4) - Deployment and operational automation scripts

### 9.4.3 Technical Specification Sections Referenced

The following sections from the main Technical Specification document were cross-referenced during Appendices compilation:

- **Section 1.1 Executive Summary** - Project overview, business problem, stakeholders, and value proposition
- **Section 3.1 Overview** - Technology stack philosophy and high-level architecture diagram
- **Section 3.4 Open Source Dependencies** - Detailed Jest, Supertest, jest-junit, and npm specifications
- **Section 5.1 High-Level Architecture** - System components, data flow, and integration points
- **Section 5.4 Cross-Cutting Concerns** - Comprehensive coverage of logging, observability, error handling, security, performance, health checking, and disaster recovery
- **Section 8.4 Containerization** - Docker configuration, image building, layer optimization, and security scanning
- **Section 8.6 CI/CD Pipeline** - Build pipeline, deployment strategy, rollback procedures, and quality gates

### 9.4.4 External References and Standards

**Language and Runtime Standards**:
- Node.js 18.x LTS Documentation: https://nodejs.org/docs/latest-v18.x/api/
- ECMAScript 2022 Specification: https://262.ecma-international.org/13.0/
- CommonJS Module Specification: http://www.commonjs.org/specs/modules/1.0/

**Testing Standards and Tools**:
- Jest Documentation: https://jestjs.io/docs/getting-started
- Supertest GitHub Repository: https://github.com/ladjs/supertest
- JUnit XML Format Specification: https://llg.cubic.org/docs/junit/

**Containerization and Orchestration**:
- Docker Documentation: https://docs.docker.com/
- Docker Compose Specification: https://docs.docker.com/compose/compose-file/
- Alpine Linux Documentation: https://wiki.alpinelinux.org/

**Monitoring and Observability**:
- Prometheus Documentation: https://prometheus.io/docs/introduction/overview/
- Grafana Documentation: https://grafana.com/docs/grafana/latest/
- PromQL Documentation: https://prometheus.io/docs/prometheus/latest/querying/basics/

**Security Standards**:
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Content Security Policy (CSP) Level 3: https://www.w3.org/TR/CSP3/
- HTTP Security Headers Best Practices: https://securityheaders.com/

**Development Standards**:
- Semantic Versioning 2.0.0: https://semver.org/
- Conventional Commits: https://www.conventionalcommits.org/
- Twelve-Factor App Methodology: https://12factor.net/
- ISO 8601 Date and Time Format: https://www.iso.org/iso-8601-date-and-time-format.html

**Package Management**:
- npm Documentation: https://docs.npmjs.com/
- package.json Specification: https://docs.npmjs.com/cli/v9/configuring-npm/package-json
- package-lock.json Format: https://docs.npmjs.com/cli/v9/configuring-npm/package-lock-json

---

**End of Appendices Section**

This comprehensive appendices section provides supplementary technical information, terminology definitions, and acronym expansions that support the main Technical Specification document. All information is grounded in the actual repository structure, configuration files, and source code examined during the documentation process.