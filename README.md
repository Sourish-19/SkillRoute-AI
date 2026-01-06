# SkillRoute-AI

[![Repo Size](https://img.shields.io/badge/repo-SkillRoute--AI-blue)]() [![License](https://img.shields.io/badge/license-MIT-green)]() [![Status](https://img.shields.io/badge/status-Prototype-orange)]()

A modular, extensible service for routing user requests to the most appropriate "skill" (specialized model, microservice, or handler). SkillRoute-AI acts as an orchestrator to evaluate intent, select and invoke skill implementations, manage responses, and provide observability and fallbacks. It is designed to be language- and model-agnostic so new skills and connectors can be added quickly.

Table of contents
- [Key features](#key-features)
- [Architecture overview](#architecture-overview)
- [Quickstart](#quickstart)
- [Prerequisites](#prerequisites)
- [Installation and setup](#installation-and-setup)
  - [Clone repository](#clone-repository)
  - [Configuration (.env)](#configuration-env)
  - [Run with Docker (recommended)](#run-with-docker-recommended)
  - [Run locally (node / python examples)](#run-locally-node--python-examples)
- [Usage and examples](#usage-and-examples)
  - [HTTP API examples (curl)](#http-api-examples-curl)
  - [Example skill manifest](#example-skill-manifest)
- [Developer guide](#developer-guide)
  - [Adding a skill](#adding-a-skill)
  - [Integrations / connectors](#integrations--connectors)
  - [Testing](#testing)
  - [Linting / Formatting](#linting--formatting)
- [Deployment](#deployment)
- [Observability](#observability)
- [Security considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgements & credits](#acknowledgements--credits)
- [Contact](#contact)

---

## Key features
- Intent classification + routing layer: decide which skill best handles a request.
- Skill registry: discoverable manifests describing inputs, outputs, and capabilities.
- Pluggable invocation: HTTP, gRPC, function-call, or model-based skill invocation.
- Fallbacks and chaining: fallback to alternate skills or chain multiple skills to fulfill complex queries.
- Observability: request logging, tracing-friendly headers, and optional metrics hooks.
- Extensible: add new skills and connectors without changing core routing logic.
- Config-driven behavior: tune routing, thresholds, and timeouts via environment/config files.

---

## Architecture overview
SkillRoute-AI is built around a central router service and multiple skill providers:

- Router (core service)
  - Receives incoming requests (REST / WebSocket / gRPC)
  - Runs routing logic (intent classifier, score thresholds, policy)
  - Invokes one or more skills and aggregates responses
  - Emits logs, metrics, and traces

- Skill Registry
  - Stores skill manifests (name, version, capabilities, endpoint, auth)
  - Allows dynamic registration/deregistration of skills

- Skill Implementations (examples)
  - Microservices that accept standardized payloads and return structured responses
  - Lightweight wrappers for LLMs (OpenAI, local LLM), rules engines, search, or executors

- Observability
  - Logging (structured logs)
  - Metrics (Prometheus-friendly)
  - Tracing (OpenTelemetry-compatible)

A minimal flow:
1. Client -> Router /api/v1/route with user input
2. Router classifies intent → selects skill(s)
3. Router invokes skill(s) with normalized request
4. Router aggregates skill outputs → returns final response

---

## Quickstart

This quickstart shows a recommended flow using Docker. If your repo uses a different stack (e.g. Python-only or Node.js-only), adjust commands accordingly.

1. Clone the repo:
   git clone https://github.com/Sourish-19/SkillRoute-AI.git
   cd SkillRoute-AI

2. Copy example env:
   cp .env.example .env
   Edit `.env` to add your API keys and configuration.

3. Start services with Docker Compose (if provided):
   docker compose up --build

4. Call the router:
   curl -X POST http://localhost:8080/api/v1/route -H "Content-Type: application/json" -d '{"input":"Help me create a sales email about product X"}'

---

## Prerequisites
- Docker & Docker Compose (recommended for reproducible environments)
- Or:
  - Node.js >= 16 (if router implemented in Node)
  - Python >= 3.9 (if there are Python components)
- Git
- (Optional) API keys for model providers (OpenAI, Anthropic, VertexAI, etc.)

---

## Installation and setup

### Clone repository
```bash
git clone https://github.com/Sourish-19/SkillRoute-AI.git
cd SkillRoute-AI
```

### Configuration (.env)
Create a `.env` file in the repository root (use `.env.example` as a template). Common variables:

```
# Server
PORT=8080
NODE_ENV=development

# Routing
DEFAULT_TIMEOUT_MS=15000
INTENT_MODEL_SCORE_THRESHOLD=0.6

# Model provider(s)
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1

# Metrics & tracing
ENABLE_PROMETHEUS=true
OTEL_COLLECTOR_URL=http://otel-collector:4317

# Skill registry (if using DB)
DATABASE_URL=postgres://user:pass@localhost:5432/skillroute
```

> Keep secrets out of source control. Use your secret manager or CI/CD secrets for production.

### Run with Docker (recommended)
If the repo contains a Dockerfile and docker-compose.yml:

```bash
docker compose build
docker compose up
```

- By default the router will be at http://localhost:8080.
- To run in the background: `docker compose up -d`

### Run locally (node / python examples)
If the router is Node-based:

```bash
# from repo root
npm install
npm run dev        # or `npm start` for production
```

If there are Python services:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Adjust commands to your repository's package manager and entrypoints.

---

## Usage and examples

### HTTP API examples (curl)
Basic routing request:

```bash
curl -X POST "http://localhost:8080/api/v1/route" \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "req-123",
    "user": {
      "id": "user-1",
      "language": "en"
    },
    "input": "Write a short product description for a noise-cancelling headphone.",
    "context": {
      "product": {
        "name": "QuietBuds Pro",
        "features": ["active noise cancellation", "30h battery"]
      }
    }
  }'
```

Example response (JSON):
```json
{
  "request_id": "req-123",
  "route": [
    {
      "skill": "llm-describer",
      "confidence": 0.93,
      "response": {
        "text": "QuietBuds Pro delivers immersive sound..."
      }
    }
  ],
  "final_response": "QuietBuds Pro delivers immersive sound..."
}
```

### Example skill manifest
A skill manifest documents how to call a skill:

```json
{
  "name": "llm-describer",
  "version": "0.1.0",
  "type": "llm",
  "endpoint": "http://llm-service:5000/generate",
  "inputs": {
    "input": "string",
    "context": "object"
  },
  "outputs": {
    "text": "string",
    "score": "number"
  },
  "auth": {
    "type": "bearer",
    "token_env": "LLM_SERVICE_TOKEN"
  },
  "timeout_ms": 10000
}
```

---

## Developer guide

### Adding a skill
1. Implement a service that accepts the standardized request payload and returns a standardized response.
2. Create or update the skill manifest and register it with the skill registry (via API or database).
3. Add unit / integration tests for the skill.
4. Optionally add a small adapter if the skill uses a provider SDK (OpenAI, proprietary model, etc.).

Checklist for new skill:
- [ ] Provide manifest with inputs/outputs & docs
- [ ] Implement health check endpoint
- [ ] Provide auth configuration or API key instruction
- [ ] Add tests and examples

### Integrations / connectors
SkillRoute-AI supports pluggable connectors. Examples include:
- LLM connectors: OpenAI, local model server, Anthropic, etc.
- Data connectors: vector DBs (Pinecone, Milvus), SQL stores, search (Elasticsearch)
- External services: email gateways, CRMs, ticketing systems

When adding connectors:
- Keep secrets in env or secret store.
- Provide retry/backoff and circuit breaker policies.

### Testing
- Unit tests: run with `npm test` or `pytest` depending on the stack.
- Integration tests: configure a test environment (docker compose) to run end-to-end flows.
- CI: provide GitHub Actions or other CI config to run tests and linting.

### Linting / Formatting
- JavaScript/TypeScript: Prettier + ESLint recommended
- Python: Black + Flake8 / ruff recommended

---

## Deployment
General deployment guidance:
- Containerize router and skills (separate images).
- Use Kubernetes / ECS for production-grade deployments.
- Environment-specific configuration via config maps and secrets.
- Autoscaling policies based on CPU, memory, and request latency.
- Use managed databases and secret stores (AWS RDS/Secrets Manager, GCP Secret Manager).

Example minimal Kubernetes deployment pattern:
- Deployment for router
- Service + Ingress for HTTP
- HorizontalPodAutoscaler for scaling
- ConfigMap / Secret for configuration

---

## Observability
- Structured JSON logs with request_id and skill metadata.
- Use Prometheus metrics: request rates, latency histograms, skill success/failure counters.
- Tracing: propagate traceparent / W3C headers and send to OpenTelemetry Collector.

Suggested metrics:
- skill_request_count_total{skill}
- skill_request_duration_seconds{skill}
- router_request_duration_seconds
- router_routed_success_total / failed_total

---

## Security considerations
- Never log secrets or full API request bodies that contain PII.
- Enforce timeouts and concurrency limits for skills.
- Use authentication and authorization between router and skills (mTLS or bearer tokens).
- Validate and sanitize all inputs to skills.
- Rotate secrets and monitor for usage anomalies.

---

## Troubleshooting
- Router returns 500:
  - Check router logs, check skill registry for misconfigured endpoints.
- Skill timeouts:
  - Increase skill-specific timeout in manifest or investigate skill's health.
- Incorrect routing:
  - Tune intent model thresholds or add explicit routing rules for high-priority intents.

Recommended debug steps:
1. Reproduce request with curl.
2. Inspect router logs for request_id correlation.
3. Call the skill endpoint directly to verify behavior.
4. Check metrics for error spikes.

---

## Contributing
Contributions are welcome! Suggested workflow:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Add tests and documentation for your change.
4. Open a pull request with a clear description and link to any related issues.

Please follow the code style used in the repository and ensure tests pass locally before opening a PR.

---

## Roadmap
Planned improvements:
- Graph-based routing to support multi-skill orchestration
- Skill-level quotas and billing hooks
- UI dashboard for skill registry, metrics and logs
- First-class support for function-calling and tool uses for LLM-based skills

If you'd like help prioritizing or implementing items, open an issue or discussion.

---

## License
This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## Acknowledgements & credits
Thanks to the open-source community and the many projects that provide models, SDKs, and observability tools. Inspiration drawn from common orchestration patterns in modern AI systems.

---

## Contact
Maintainer: Sourish-19  
GitHub: https://github.com/Sourish-19/SkillRoute-AI
