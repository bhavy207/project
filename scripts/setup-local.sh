#!/usr/bin/env bash
set -e

echo "============================================================"
echo "🤖 DevPilot: Local Setup Script ($0 Development Budget)"
echo "============================================================"

# Ensure .env exists
if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
fi

# Run compliance check
node scripts/check-env.js

echo "Checking Docker..."
if command -v docker >/dev/null 2>&1; then
  echo "Docker is installed. Starting local multi-container infrastructure..."
  docker compose up -d
  echo "All containers initialized: PostgreSQL, Redis, Mailpit, MinIO, Prometheus, Grafana, API, AI-Service, Web"
else
  echo "Docker CLI not detected. DevPilot will execute using local process isolation fallback."
fi

echo "============================================================"
echo "DevPilot is ready!"
echo "Web UI:      http://localhost:3000"
echo "API Docs:    http://localhost:4000"
echo "AI Service:  http://localhost:8000"
echo "Grafana:     http://localhost:3001"
echo "Mailpit UI:  http://localhost:8025"
echo "============================================================"
