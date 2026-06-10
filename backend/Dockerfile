# syntax=docker/dockerfile:1
# Build any FMS Spring Boot module from the monorepo.
#   docker build --build-arg MODULE=auth/auth.api -t fms-auth ./backend
FROM eclipse-temurin:21-jdk-alpine AS build

RUN apk add --no-cache maven

WORKDIR /app

# Cache dependencies
COPY pom.xml .
COPY common/pom.xml common/
COPY auth/auth.domain/pom.xml auth/auth.domain/
COPY auth/auth.application/pom.xml auth/auth.application/
COPY auth/auth.infrastructure/pom.xml auth/auth.infrastructure/
COPY auth/auth.api/pom.xml auth/auth.api/
COPY user/user.domain/pom.xml user/user.domain/
COPY user/user.application/pom.xml user/user.application/
COPY user/user.infrastructure/pom.xml user/user.infrastructure/
COPY user/user.api/pom.xml user/user.api/
COPY vehicle/vehicle.domain/pom.xml vehicle/vehicle.domain/
COPY vehicle/vehicle.application/pom.xml vehicle/vehicle.application/
COPY vehicle/vehicle.infrastructure/pom.xml vehicle/vehicle.infrastructure/
COPY vehicle/vehicle.api/pom.xml vehicle/vehicle.api/
COPY tracking/tracking.domain/pom.xml tracking/tracking.domain/
COPY tracking/tracking.application/pom.xml tracking/tracking.application/
COPY tracking/tracking.infrastructure/pom.xml tracking/tracking.infrastructure/
COPY tracking/tracking.api/pom.xml tracking/tracking.api/
COPY dispatch/dispatch.domain/pom.xml dispatch/dispatch.domain/
COPY dispatch/dispatch.application/pom.xml dispatch/dispatch.application/
COPY dispatch/dispatch.infrastructure/pom.xml dispatch/dispatch.infrastructure/
COPY dispatch/dispatch.api/pom.xml dispatch/dispatch.api/
COPY maintenance/maintenance.domain/pom.xml maintenance/maintenance.domain/
COPY maintenance/maintenance.application/pom.xml maintenance/maintenance.application/
COPY maintenance/maintenance.infrastructure/pom.xml maintenance/maintenance.infrastructure/
COPY maintenance/maintenance.api/pom.xml maintenance/maintenance.api/
COPY fuel/fuel.domain/pom.xml fuel/fuel.domain/
COPY fuel/fuel.application/pom.xml fuel/fuel.application/
COPY fuel/fuel.infrastructure/pom.xml fuel/fuel.infrastructure/
COPY fuel/fuel.api/pom.xml fuel/fuel.api/
COPY notification/notification.domain/pom.xml notification/notification.domain/
COPY notification/notification.application/pom.xml notification/notification.application/
COPY notification/notification.infrastructure/pom.xml notification/notification.infrastructure/
COPY notification/notification.api/pom.xml notification/notification.api/
COPY reporting/reporting.domain/pom.xml reporting/reporting.domain/
COPY reporting/reporting.application/pom.xml reporting/reporting.application/
COPY reporting/reporting.infrastructure/pom.xml reporting/reporting.infrastructure/
COPY reporting/reporting.api/pom.xml reporting/reporting.api/
COPY gateway/pom.xml gateway/
RUN mvn -B dependency:go-offline -pl gateway -am || true

COPY . .

ARG MODULE=auth/auth.api
RUN mvn -B package -pl "${MODULE}" -am -DskipTests -q \
  && JAR_FILE=$(find "/app/${MODULE}/target" -maxdepth 1 -name '*.jar' ! -name '*-plain.jar' | head -1) \
  && test -n "${JAR_FILE}" \
  && cp "${JAR_FILE}" /app/service.jar

FROM eclipse-temurin:21-jre-alpine AS runtime

RUN apk add --no-cache curl

WORKDIR /app
COPY --from=build /app/service.jar app.jar

ENV SPRING_PROFILES_ACTIVE=docker
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-8080}/actuator/health" || exit 1

ENTRYPOINT ["sh", "-c", "exec java -XX:+UseContainerSupport -jar app.jar --server.port=${PORT:-8080}"]
