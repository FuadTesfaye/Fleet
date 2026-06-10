#!/usr/bin/env python3
"""Scaffold minimal boot apps for non-auth services (nested folder layout)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SERVICES = {
    "user": ("8082", "user-service", "com.fms.user", "UserServiceApplication"),
    "vehicle": ("8083", "vehicle-service", "com.fms.vehicle", "VehicleServiceApplication"),
    "tracking": ("8084", "tracking-service", "com.fms.tracking", "TrackingServiceApplication"),
    "dispatch": ("8085", "dispatch-service", "com.fms.dispatch", "DispatchServiceApplication"),
    "maintenance": ("8086", "maintenance-service", "com.fms.maintenance", "MaintenanceServiceApplication"),
    "fuel": ("8087", "fuel-service", "com.fms.fuel", "FuelServiceApplication"),
    "notification": ("8088", "notification-service", "com.fms.notification", "NotificationServiceApplication"),
    "reporting": ("8089", "reporting-service", "com.fms.reporting", "ReportingServiceApplication"),
}


def pkg_path(base_pkg: str, sub: str) -> Path:
    return ROOT / sub.replace(".", "/")


def write_api_boot(svc: str, port: str, app_name: str, base_pkg: str, class_name: str):
    api_java = ROOT / svc / "api" / "src" / "main" / "java" / base_pkg.replace(".", "/")
    api_java.mkdir(parents=True, exist_ok=True)
    (api_java / f"{class_name}.java").write_text(f"""package {base_pkg}.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "{base_pkg}")
public class {class_name} {{
    public static void main(String[] args) {{
        SpringApplication.run({class_name}.class, args);
    }}
}}
""")

    resources = ROOT / svc / "api" / "src" / "main" / "resources"
    resources.mkdir(parents=True, exist_ok=True)
    (resources / "application.yml").write_text(f"""spring:
  application:
    name: {app_name}
  datasource:
    url: jdbc:postgresql://${{DB_HOST:localhost}}:5432/fms_{svc}
    username: ${{DB_USER:fms}}
    password: ${{DB_PASS:fms}}
  jpa:
    open-in-view: false
  flyway:
    enabled: true
    locations: classpath:db/migration
  kafka:
    bootstrap-servers: ${{KAFKA_BOOTSTRAP:localhost:9092}}
    consumer:
      group-id: fms-{svc}-group
  data:
    redis:
      host: ${{REDIS_HOST:localhost}}
      port: 6379
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${{KEYCLOAK_URL:http://localhost:8180}}/realms/fms
server:
  port: ${{{'PORT:' + port}}}
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui
""")

    infra = ROOT / svc / "infrastructure" / "src" / "main" / "resources" / "db" / "migration"
    infra.mkdir(parents=True, exist_ok=True)
    placeholder = infra / "V1__init.sql"
    if not placeholder.exists():
        placeholder.write_text(f"-- {svc} service schema placeholder\nSELECT 1;\n")

    # domain placeholder
    domain_java = ROOT / svc / "domain" / "src" / "main" / "java" / base_pkg.replace(".", "/") / "domain"
    domain_java.mkdir(parents=True, exist_ok=True)
    marker = domain_java / "package-info.java"
    if not marker.exists():
        marker.write_text(f"/**\n * {svc.title()} domain layer — pure Java, no framework dependencies.\n */\npackage {base_pkg}.domain;\n")

    # application placeholder config
    app_java = ROOT / svc / "application" / "src" / "main" / "java" / base_pkg.replace(".", "/") / "application"
    app_java.mkdir(parents=True, exist_ok=True)
    app_marker = app_java / "package-info.java"
    if not app_marker.exists():
        app_marker.write_text(f"package {base_pkg}.application;\n")

    # infrastructure jpa config
    infra_java = ROOT / svc / "infrastructure" / "src" / "main" / "java" / base_pkg.replace(".", "/") / "infrastructure" / "config"
    infra_java.mkdir(parents=True, exist_ok=True)
    jpa_config = infra_java / "JpaConfig.java"
    if not jpa_config.exists():
        jpa_config.write_text(f"""package {base_pkg}.infrastructure.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "{base_pkg}.infrastructure.persistence.repository")
@EntityScan(basePackages = "{base_pkg}.infrastructure.persistence.entity")
public class JpaConfig {{}}
""")


def main():
    for svc, (port, app_name, base_pkg, class_name) in SERVICES.items():
        write_api_boot(svc, port, app_name, base_pkg, class_name)
    print(f"Scaffolded {len(SERVICES)} services")


if __name__ == "__main__":
    main()
