# DevPilot — Autonomous AI Developer Platform

> **CRITICAL REQUIREMENT GUARANTEE: $0 DEVELOPMENT BUDGET**  
> DevPilot is engineered to be developed, tested, and demonstrated with **zero mandatory paid services**. It uses exclusively free/open-source software, local Docker containers, local AI models (Ollama), and free API tiers where genuinely available.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Budget: $0](https://img.shields.io/badge/Cost-$0.00%20Zero%20Paid%20SaaS-emerald.svg)](COST_BREAKDOWN.md)
[![Architecture: Clean Providers](https://img.shields.io/badge/Architecture-Clean%20Providers-purple.svg)](ARCHITECTURE.md)
[![CI: Free Tier](https://img.shields.io/badge/CI-GitHub%20Actions%20Free-orange.svg)](.github/workflows/ci.yml)

---

## 🌟 Overview

DevPilot is an autonomous AI pair-programming platform that automates the software development lifecycle:
1. **Decompose & Plan**: Breaks architectural requests into structured execution steps.
2. **Synthesize Code**: Generates clean, type-safe code using local open-source LLMs or free tiers.
3. **Automated Security Review**: Conducts static security analysis for OWASP vulnerabilities and secret leaks.
4. **Isolated Sandbox Execution**: Runs test suites inside unprivileged Docker containers (or process sandbox fallback) with strict CPU, memory, and timeout constraints.
5. **Observability & Telemetry**: Full local observability via OpenTelemetry, Prometheus, and Grafana.

---

## 📊 Zero-Cost Service Classification Matrix

Every component in DevPilot is strictly categorized according to the budget matrix:

| Component | Default Free / FOSS Implementation | Classification | Cost | Fallback Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend UI** | Next.js 14 App Router | `FREE / OPEN SOURCE` | **$0** | Local Node.js or Docker |
| **Backend API** | NestJS Core Orchestrator | `FREE / OPEN SOURCE` | **$0** | Local Node.js or Docker |
| **AI Engine** | FastAPI Reasoning Engine | `FREE / OPEN SOURCE` | **$0** | Local Python or Docker |
| **Primary LLM** | Ollama (`deepseek-coder`, `llama3`) | `FREE / OPEN SOURCE` | **$0** | Offline on CPU/GPU |
| **Cloud Free LLM** | Google Gemini Free API | `FREE TIER WITH LIMITS` | **$0** | 15 RPM / 1M TPM free tier (no credit card) |
| **Offline Mock LLM** | `MockLLMProvider` | `FREE / OPEN SOURCE` | **$0** | Zero RAM/GPU overhead for CI/tests |
| **Relational Database** | PostgreSQL 16 (Docker) | `FREE / OPEN SOURCE` | **$0** | Local Docker container |
| **Vector Search** | PostgreSQL `pgvector` | `FREE / OPEN SOURCE` | **$0** | Local native SQL cosine search |
| **Message Queue** | Redis Alpine + BullMQ | `FREE / OPEN SOURCE` | **$0** | Local Docker container |
| **Code Sandbox** | Docker Engine Container | `FREE / OPEN SOURCE` | **$0** | Isolated local container; process fallback |
| **Object File Storage** | Local Disk / MinIO | `FREE / OPEN SOURCE` | **$0** | `./uploads` directory or MinIO container |
| **Email Testing** | Mailpit (SMTP + Web UI) | `FREE / OPEN SOURCE` | **$0** | Web inbox at `http://localhost:8025` |
| **Metrics Scraper** | Prometheus | `FREE / OPEN SOURCE` | **$0** | Port `9090` |
| **Metrics Dashboard** | Grafana | `FREE / OPEN SOURCE` | **$0** | Port `3001` (admin/admin) |
| **Authentication** | Direct self-hosted JWT + Bcrypt | `FREE / OPEN SOURCE` | **$0** | Zero Auth0/Clerk paid dependencies |
| **Security Scanning** | Trivy, Semgrep, Gitleaks | `FREE / OPEN SOURCE` | **$0** | Local CLI and GitHub Actions |

*For complete classification details, see [COST_BREAKDOWN.md](COST_BREAKDOWN.md).*

---

## 🏗️ System Architecture

```text
                             DEVpilot LOCAL

                  Next.js (Web Dashboard: Port 3000)
                                 │
                                 ▼
                  NestJS (API Gateway: Port 4000)
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
  PostgreSQL 16               Redis 7                   FastAPI
   + pgvector                (BullMQ)             (AI Engine: Port 8000)
 (Vector Search)          (Queues/Cache)                   │
                                                           ▼
                                                        Ollama
                                                  (Local AI Models)
                                                           │
                                                           ▼
                                                    Local AI Model
                                 │
                                 ▼
                       Docker Sandbox Manager
                    (Isolated Unprivileged Tests)
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
        Prometheus (Port 9090)       Grafana (Port 3001)
                   │                           │
                   └───────────┬───────────────┘
                               ▼
                    Mailpit SMTP (Port 8025)
```

*For architectural details and sequence flows, see [ARCHITECTURE.md](ARCHITECTURE.md).*

---

## 🔌 Provider Abstraction Architecture

Every external dependency is abstracted behind modular interfaces. Providers can be swapped instantly via `.env` without modifying code:

### 1. LLM Provider (`LLM_PROVIDER=ollama|gemini|mock`)
- **`ollama`**: Connects to local Ollama (`http://localhost:11434`).
- **`gemini`**: Connects to Google Gemini Free Tier (`GEMINI_API_KEY`).
- **`mock`**: Instant offline synthetic code generation with zero RAM/GPU requirements.

### 2. Vector Provider (`VECTOR_PROVIDER=pgvector|memory`)
- **`pgvector`**: Native PostgreSQL IVFFlat / HNSW cosine distance vector queries.
- **`memory`**: In-memory vector cosine similarity for CI and bare-metal testing.

### 3. Storage Provider (`STORAGE_PROVIDER=local|minio`)
- **`local`**: Stores artifacts in the local `./uploads` directory.
- **`minio`**: S3-compatible MinIO object storage container.

### 4. Email Provider (`EMAIL_PROVIDER=mailpit|console`)
- **`mailpit`**: Dispatches to local Mailpit SMTP server with a browser inspector on port 8025.
- **`console`**: Logs email notifications to server stdout.

---

## 🚀 Quickstart Guide

### Prerequisites
- [Git](https://git-scm.com/)
- [Node.js 18+](https://nodejs.org/) and [Python 3.10+](https://python.org/)
- [Docker](https://www.docker.com/) (Optional: bare-metal process fallback is included)

### Step 1: Clone Repository
```bash
git clone https://github.com/bhavy207/project.git devpilot
cd devpilot
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```
*All `.env.example` defaults are pre-configured to work locally at $0 cost.*

### Step 3: Run with Docker Compose
```bash
docker compose up -d
```

### Step 4: Access Services
| Interface | URL | Credentials |
| :--- | :--- | :--- |
| **Web Dashboard** | `http://localhost:3000` | Open access |
| **API Gateway** | `http://localhost:4000` | Open access |
| **API Prometheus Metrics** | `http://localhost:4000/metrics` | Open access |
| **AI Reasoning Service** | `http://localhost:8000` | Open access |
| **Grafana Dashboards** | `http://localhost:3001` | `admin` / `admin` |
| **Mailpit Email Viewer** | `http://localhost:8025` | Open access |
| **Prometheus Console** | `http://localhost:9090` | Open access |

---

## 🧪 Testing & Verification

### 1. Verify Zero-Cost Compliance
```bash
node scripts/check-env.js
```

### 2. Run Local Security Audit (Trivy / Gitleaks / SAST)
```bash
node scripts/security-scan.js
```

### 3. Run Backend Provider Unit Tests
```bash
node apps/api/scripts/test-api.js
```

### 4. Run Complete End-to-End Demonstration
```bash
node scripts/run-demo.js
```

---

## 🛡️ Security & Sandbox Isolation Architecture

DevPilot isolates code execution:
1. **Unprivileged Container**: Runs code under user `sandboxuser:sandboxgroup` (UID `1001`).
2. **Resource Constraints**: Capped at `512MB` RAM and `1.0` CPU core per execution.
3. **Execution Timeout**: Enforced 30-second TTL prevents infinite loops and fork bombs.
4. **Fallback Runner**: If Docker is unavailable, an isolated ephemeral process sandbox operates in temporary directories with strict timeout cancellation.

---

## 📄 License

DevPilot is released under the **MIT License**.
