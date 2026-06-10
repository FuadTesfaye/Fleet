# syntax=docker/dockerfile:1
# Build any FMS Spring Boot service from the monorepo.
# Usage: docker build --build-arg MODULE=auth/auth.api -t fms-auth .
FROM eclipse-temurin:21-jdk-alpine AS build

RUN apk add --no-cache maven

WORKDIR /app
COPY pom.xml .
COPY common common
COPY auth auth
COPY user user
COPY vehicle vehicle
COPY tracking tracking
COPY dispatch dispatch
COPY maintenance maintenance
COPY fuel fuel
COPY notification notification
COPY reporting reporting
COPY gateway gateway

ARG MODULE=auth/auth.api
RUN mvn -B package -pl "${MODULE}" -am -DskipTests -q

FROM eclipse-temurin:21-jre-alpine AS runtime

RUN apk add --no-cache curl

WORKDIR /app
ARG MODULE=auth/auth.api
COPY --from=build /app/${MODULE}/target/*-SNAPSHOT.jar app.jar

ENV SPRING_PROFILES_ACTIVE=docker
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD curl -fsS http://localhost:${PORT:-8080}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
