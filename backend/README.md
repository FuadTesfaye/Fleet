# FMS Backend

Production-grade Maven multi-module Spring Boot backend for the Fleet Management System (FMS), structured with **Onion Architecture** (ports & adapters).

## Layout

Each service lives in its own parent folder; layers are named `{service}.{layer}`:

```
backend/
├── common/
├── auth/
│   ├── auth.domain/
│   ├── auth.application/
│   ├── auth.infrastructure/
│   ├── auth.api/
│   └── auth.test/
├── user/
│   ├── user.domain/
│   ├── user.application/
│   └── ...
├── vehicle/
├── tracking/
├── dispatch/
├── maintenance/
├── fuel/
├── notification/
├── reporting/
├── gateway/
├── docker-compose.yml
└── pom.xml
```

**Dependency direction:** `*.api` → `*.application` → `*.domain`; `*.infrastructure` → `*.application` + `*.domain`. Domain has zero framework dependencies.

## Prerequisites

- **Java 21** (Temurin or OpenJDK)
- Maven 3.9+
- Docker (for local infra)

```bash
export JAVA_HOME=/usr/lib/jvm/temurin-21-jdk   # adjust path on your machine
```

## Build

```bash
cd backend
mvn clean compile
```

## Run infrastructure

```bash
docker compose up -d
```

## Service ports

| Service      | Port |
|--------------|------|
| Gateway      | 8080 |
| Auth         | 8081 |
| User         | 8082 |
| Vehicle      | 8083 |
| Tracking     | 8084 |
| Dispatch     | 8085 |
| Maintenance  | 8086 |
| Fuel         | 8087 |
| Notification | 8088 |
| Reporting    | 8089 |

## Auth service (reference implementation)

The `auth/` service is fully implemented end-to-end. Other services have bootstrapped API modules and placeholder domain/application layers — extend them following the auth pattern.

```bash
mvn -pl auth/auth.api spring-boot:run
```

Swagger UI: http://localhost:8081/swagger-ui
