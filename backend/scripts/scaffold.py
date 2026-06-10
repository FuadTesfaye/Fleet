#!/usr/bin/env python3
"""Generate module POMs for all FMS services (nested folder layout)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION = "1.0.0-SNAPSHOT"
GROUP = "com.fms"
SERVICES = ["auth", "user", "vehicle", "tracking", "dispatch", "maintenance", "fuel", "notification", "reporting"]
LAYERS = ["domain", "application", "infrastructure", "api", "test"]

PARENT = f"""  <parent>
    <groupId>{GROUP}</groupId>
    <artifactId>fms-backend</artifactId>
    <version>{VERSION}</version>
    <relativePath>../../pom.xml</relativePath>
  </parent>"""


def domain_pom(svc: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
{PARENT}
  <artifactId>{svc}.domain</artifactId>
  <name>FMS {svc.title()} Domain</name>
  <dependencies>
    <dependency><groupId>{GROUP}</groupId><artifactId>common</artifactId></dependency>
    <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><scope>provided</scope></dependency>
  </dependencies>
</project>
"""


def application_pom(svc: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
{PARENT}
  <artifactId>{svc}.application</artifactId>
  <name>FMS {svc.title()} Application</name>
  <dependencies>
    <dependency><groupId>{GROUP}</groupId><artifactId>{svc}.domain</artifactId><version>${{project.version}}</version></dependency>
    <dependency><groupId>{GROUP}</groupId><artifactId>common</artifactId></dependency>
    <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><scope>provided</scope></dependency>
    <dependency><groupId>org.mapstruct</groupId><artifactId>mapstruct</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
    <dependency><groupId>org.springframework</groupId><artifactId>spring-context</artifactId></dependency>
    <dependency><groupId>org.springframework</groupId><artifactId>spring-tx</artifactId></dependency>
  </dependencies>
</project>
"""


def infrastructure_pom(svc: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
{PARENT}
  <artifactId>{svc}.infrastructure</artifactId>
  <name>FMS {svc.title()} Infrastructure</name>
  <dependencies>
    <dependency><groupId>{GROUP}</groupId><artifactId>{svc}.application</artifactId><version>${{project.version}}</version></dependency>
    <dependency><groupId>{GROUP}</groupId><artifactId>{svc}.domain</artifactId><version>${{project.version}}</version></dependency>
    <dependency><groupId>{GROUP}</groupId><artifactId>common</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
    <dependency><groupId>org.hibernate.orm</groupId><artifactId>hibernate-spatial</artifactId></dependency>
    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-core</artifactId></dependency>
    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-database-postgresql</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-redis</artifactId></dependency>
    <dependency><groupId>org.springframework.kafka</groupId><artifactId>spring-kafka</artifactId></dependency>
    <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><scope>provided</scope></dependency>
    <dependency><groupId>org.mapstruct</groupId><artifactId>mapstruct</artifactId></dependency>
  </dependencies>
</project>
"""


def api_pom(svc: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
{PARENT}
  <artifactId>{svc}.api</artifactId>
  <name>FMS {svc.title()} API</name>
  <dependencies>
    <dependency><groupId>{GROUP}</groupId><artifactId>{svc}.application</artifactId><version>${{project.version}}</version></dependency>
    <dependency><groupId>{GROUP}</groupId><artifactId>{svc}.infrastructure</artifactId><version>${{project.version}}</version></dependency>
    <dependency><groupId>{GROUP}</groupId><artifactId>common</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>
    <dependency><groupId>org.springdoc</groupId><artifactId>springdoc-openapi-starter-webmvc-ui</artifactId></dependency>
    <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><scope>provided</scope></dependency>
    <dependency><groupId>org.mapstruct</groupId><artifactId>mapstruct</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-oauth2-resource-server</artifactId></dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
"""


def test_pom(svc: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
{PARENT}
  <artifactId>{svc}.test</artifactId>
  <name>FMS {svc.title()} Tests</name>
  <dependencies>
    <dependency><groupId>{GROUP}</groupId><artifactId>{svc}.api</artifactId><version>${{project.version}}</version></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.kafka</groupId><artifactId>spring-kafka-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.testcontainers</groupId><artifactId>postgresql</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.testcontainers</groupId><artifactId>kafka</artifactId><scope>test</scope></dependency>
    <dependency><groupId>io.rest-assured</groupId><artifactId>rest-assured</artifactId><scope>test</scope></dependency>
  </dependencies>
</project>
"""


def main():
    writers = {
        "domain": domain_pom,
        "application": application_pom,
        "infrastructure": infrastructure_pom,
        "api": api_pom,
        "test": test_pom,
    }
    for svc in SERVICES:
        for layer in LAYERS:
            path = ROOT / svc / layer
            path.mkdir(parents=True, exist_ok=True)
            (path / "pom.xml").write_text(writers[layer](svc))
    print(f"Generated POMs for {len(SERVICES)} services under nested folders")


if __name__ == "__main__":
    main()
