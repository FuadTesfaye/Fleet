# Fleet Management System (FMS)

Monorepo for the Ethiopian Ministry of Irrigation & Lowlands fleet platform.

| Path | Stack | Description |
|------|-------|-------------|
| [`fms/`](fms/) | Next.js 16, React 19 | Web dashboard |
| [`backend/`](backend/) | Java 21, Spring Boot 3.3 | Microservices (onion architecture) |

## Run everything with Docker

**Requirements:** Docker Engine 24+ and Compose v2.

```bash
# From repo root — builds all images and starts the full stack
./scripts/docker-up.sh

# Or manually
docker compose up --build -d
```

| URL | Service |
|-----|---------|
| http://localhost:3000 | Frontend (Next.js) |
| http://localhost:8080 | API Gateway |
| http://localhost:8081/swagger-ui | Auth service docs |
| http://localhost:8082–8089 | Individual microservices |
| http://localhost:9090 | Kafka UI |

**Demo API login:** `admin@fms.gov.et` / `password123`

```bash
# Test via gateway
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@fms.gov.et","password":"password123"}'
```

### Useful commands

```bash
docker compose ps                  # service status
docker compose logs -f gateway     # tail gateway logs
docker compose down -v             # stop and remove volumes
docker compose build auth-service  # rebuild one service
```

### Architecture in Docker

```
Browser → frontend:3000 → gateway:8080 → auth|user|vehicle|… :8081-8089
                                              ↓
                                    postgres · redis · kafka
```

Each backend service is built from [`backend/Dockerfile`](backend/Dockerfile) with a `MODULE` build arg (e.g. `auth/auth.api`, `gateway`).

The `docker` Spring profile disables Keycloak JWT validation for local containers. Optional Keycloak:

```bash
docker compose --profile keycloak up -d
```

## Local development (without app containers)

```bash
# Infrastructure only
docker compose up -d postgres redis zookeeper kafka

# Backend (Java 21)
export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk
cd backend && mvn -pl auth/auth.api spring-boot:run

# Frontend
cd fms && cp .env.example .env.local && bun install && bun dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8080` in `fms/.env.local` to use the live API; leave unset for mock-data mode.

See [`backend/README.md`](backend/README.md) for module layout and service ports.
