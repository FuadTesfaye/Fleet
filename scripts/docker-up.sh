#!/usr/bin/env bash
# Build and start the full FMS stack (infra + all backend services + frontend).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "==> Building and starting FMS stack..."
docker compose up --build -d

echo ""
echo "==> Waiting for core services..."
for i in $(seq 1 60); do
  if curl -fsS http://localhost:8080/actuator/health >/dev/null 2>&1; then
    echo "Gateway is healthy."
    break
  fi
  sleep 5
  if [[ $i -eq 60 ]]; then
    echo "Warning: gateway not healthy yet. Check: docker compose logs gateway"
  fi
done

echo ""
echo "FMS is starting up:"
echo "  Frontend   → http://localhost:3000"
echo "  Gateway    → http://localhost:8080"
echo "  Auth API   → http://localhost:8081/swagger-ui"
echo "  Kafka UI   → http://localhost:9090"
echo ""
echo "Demo login: admin@fms.gov.et / password123"
echo "Logs: docker compose logs -f gateway auth-service frontend"
