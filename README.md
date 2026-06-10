# Fleet Management System (FMS)

Monorepo for the Ethiopian Ministry of Irrigation & Lowlands fleet platform.

| Path | Stack | Description |
|------|-------|-------------|
| [`fms/`](fms/) | Next.js 16, React 19 | Web dashboard |
| [`backend/`](backend/) | Java 21, Spring Boot 3.3 | Microservices (onion architecture) |

## Quick start (Docker — full stack)

Requires Docker Engine 24+ and Compose v2.

```bash
# From repo root
docker compose up --build -d

# Watch startup
docker compose logs -f gateway auth-service frontend
```

| URL | Service |
|-----|---------|
| http://localhost:3000 | Frontend |
| http://localhost:8080 | API Gateway |
| http://localhost:8081/swagger-ui | Auth API docs |
| http://localhost:9090 | Kafka UI |

**Demo login (API mode):** `admin@fms.gov.et` / `password123`

## Local development (without Docker apps)

### Infrastructure only

```bash
docker compose up -d postgres redis zookeeper kafka
```

### Backend

```bash
export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk
cd backend
mvn -pl auth/auth.api spring-boot:run
```

### Frontend

```bash
cd fms
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8080 for live API
# Leave unset for mock-data mode
bun install
bun dev
```

## Architecture

```
Browser → Next.js (3000) → Gateway (8080) → Microservices (8081–8089)
                                    ↓
                          Postgres · Redis · Kafka
```

See [`backend/README.md`](backend/README.md) for service layout and ports.

## Optional profiles

```bash
# Include Keycloak (not required for local docker profile)
docker compose --profile keycloak up -d
```
