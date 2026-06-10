#!/usr/bin/env bash
# Ensure all scaffold services boot cleanly in Docker (no JPA validation, no Keycloak).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

DOCKER_YML='spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/fms_SVC
  data:
    redis:
      host: redis
  kafka:
    bootstrap-servers: kafka:29092
  jpa:
    hibernate:
      ddl-auto: none
  flyway:
    enabled: true
    baseline-on-migrate: true
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration
server:
  port: PORTNUM
'

for entry in user:8082 vehicle:8083 tracking:8084 dispatch:8085 maintenance:8086 fuel:8087 notification:8088 reporting:8089; do
  svc="${entry%%:*}"
  port="${entry##*:}"
  file="${ROOT}/${svc}/${svc}.api/src/main/resources/application-docker.yml"
  echo "${DOCKER_YML}" | sed "s/fms_SVC/fms_${svc}/g; s/PORTNUM/${port}/" > "${file}"
done

echo "Updated application-docker.yml for all scaffold services"
