# DevPilot — Zero-Cost Budget & Cost Transparency

DevPilot is engineered from the ground up to operate on a **strict $0 development and operational budget**. No paid SaaS, API, or cloud infrastructure is required to develop, run, test, or demonstrate the entire platform.

---

## 1. Service Classification Matrix

Every component and external dependency in DevPilot is strictly categorized according to the requirement matrix:

| Component | Default Implementation | Classification | Cost | Fallback Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend UI** | Next.js 14 (React, Tailwind CSS) | `FREE / OPEN SOURCE` | $0 | Runs locally (`npm run dev`) or in Docker |
| **Backend Core** | NestJS (TypeScript, Node.js) | `FREE / OPEN SOURCE` | $0 | Runs locally (`npm run dev`) or in Docker |
| **AI Reasoning Engine** | FastAPI (Python) | `FREE / OPEN SOURCE` | $0 | Runs locally with uvicorn or in Docker |
| **LLM Inference (Primary)** | Ollama (Llama 3 / Mistral / DeepSeek) | `FREE / OPEN SOURCE` | $0 | Fully offline on CPU/GPU |
| **LLM Inference (Cloud Free Tier)** | Google Gemini Free API | `FREE TIER WITH LIMITS` | $0 | 15 RPM / 1M TPM free quota (no billing required) |
| **LLM Inference (Offline Mock)** | `MockLLMProvider` | `FREE / OPEN SOURCE` | $0 | Instant mock responses for CI & low-spec machines |
| **Relational Database** | PostgreSQL 16 (Docker) | `FREE / OPEN SOURCE` | $0 | Local container instance |
| **Vector Database** | `pgvector` extension for PostgreSQL | `FREE / OPEN SOURCE` | $0 | Native PostgreSQL extension, zero extra service |
| **Vector Database (Alt)** | Qdrant (Docker) | `FREE / OPEN SOURCE` | $0 | Local container instance |
| **In-Memory Cache / Queue** | Redis Alpine (Docker) | `FREE / OPEN SOURCE` | $0 | Local container instance |
| **Background Job Processing** | BullMQ | `FREE / OPEN SOURCE` | $0 | Powered by local Redis |
| **Code Execution Sandbox** | Docker Engine (`docker:dind` or socket) | `FREE / OPEN SOURCE` | $0 | Isolated containers; process sandbox fallback |
| **Object File Storage** | Local Disk or MinIO (Docker) | `FREE / OPEN SOURCE` | $0 | Local folder storage or S3-compatible MinIO container |
| **Email Testing** | Mailpit (Docker SMTP + Web UI) | `FREE / OPEN SOURCE` | $0 | Catches all emails locally with web inspector on port 8025 |
| **Metrics Collection** | OpenTelemetry + Prometheus | `FREE / OPEN SOURCE` | $0 | Local scrapers and time-series DB |
| **Metrics Visualization** | Grafana (Docker) | `FREE / OPEN SOURCE` | $0 | Pre-provisioned dashboards on port 3001 |
| **Authentication** | Direct JWT + Local Argon2/Bcrypt | `FREE / OPEN SOURCE` | $0 | Direct self-hosted auth, zero third-party dependency |
| **Git & OAuth Integration** | GitHub Free Account + GitHub API | `FREE TIER WITH LIMITS` | $0 | 5,000 requests/hour authenticated free tier |
| **Continuous Integration (CI)** | GitHub Actions | `FREE TIER WITH LIMITS` | $0 | 2,000 min/month free for public/private repos |
| **Static Code Analysis** | Semgrep OSS | `FREE / OPEN SOURCE` | $0 | CLI-based local or CI execution |
| **Container Vulnerability Scan**| Trivy OSS | `FREE / OPEN SOURCE` | $0 | CLI-based local or CI execution |
| **Secret Detection** | Gitleaks OSS | `FREE / OPEN SOURCE` | $0 | Runs as pre-commit hook or local scan |
| **Cloud Hosting (Optional)** | Render / Railway / Fly.io / Supabase | `OPTIONAL PAID` | $0-$5+ | Optional deployment target only; not required |
| **Commercial LLMs (Optional)** | OpenAI GPT-4 / Anthropic Claude | `OPTIONAL PAID` | Pay-as-you-go | Optional adapter only; not required |

---

## 2. Hard Verification Rules

### Rule 1: No Paid SaaS Lock-In
DevPilot contains zero hard imports or mandatory SDKs for proprietary services like Pinecone, Datadog, Auth0, Clerk, SendGrid, or AWS S3.

### Rule 2: Clean Provider Abstraction
Every external capability (LLM, Vector Search, Storage, Email) is designed behind a TypeScript interface and a Python abstract base class. Providers can be switched seamlessly via an environment variable (`LLM_PROVIDER`, `VECTOR_PROVIDER`, `STORAGE_PROVIDER`, `EMAIL_PROVIDER`).

### Rule 3: Zero-Credit-Card Local Development
The entire platform will run on any development machine equipped with Git, Docker, Node.js, and Python using:
```bash
git clone https://github.com/bhavy207/project.git
cd project
cp .env.example .env
docker compose up
```

### Rule 4: Graceful Degradation & Mocking
If a developer machine does not have a dedicated GPU or Ollama installed, switching `LLM_PROVIDER=mock` simulates intelligent responses, PR reviews, code generation, and test suites with zero latency and zero RAM overhead.
