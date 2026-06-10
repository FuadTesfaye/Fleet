#!/usr/bin/env python3
"""Add application-docker.yml and SecurityConfig to scaffold service API modules."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SERVICES = {
    "user": 8082,
    "vehicle": 8083,
    "tracking": 8084,
    "dispatch": 8085,
    "maintenance": 8086,
    "fuel": 8087,
    "notification": 8088,
    "reporting": 8089,
}

DOCKER_YML = """spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/fms_{svc}
  data:
    redis:
      host: redis
  kafka:
    bootstrap-servers: kafka:29092
  jpa:
    hibernate:
      ddl-auto: none
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration

server:
  port: {port}
"""

SECURITY_CONFIG = """package com.fms.{svc}.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {{

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {{
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/**", "/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**")
                        .permitAll()
                        .anyRequest().permitAll());
        return http.build();
    }}
}}
"""


def main():
    for svc, port in SERVICES.items():
        api_resources = ROOT / svc / f"{svc}.api" / "src" / "main" / "resources"
        api_resources.mkdir(parents=True, exist_ok=True)
        (api_resources / "application-docker.yml").write_text(DOCKER_YML.format(svc=svc, port=port))

        config_dir = ROOT / svc / f"{svc}.api" / "src" / "main" / "java" / f"com/fms/{svc}/api/config"
        config_dir.mkdir(parents=True, exist_ok=True)
        (config_dir / "SecurityConfig.java").write_text(SECURITY_CONFIG.format(svc=svc))

    print(f"Generated docker profiles for {len(SERVICES)} scaffold services")


if __name__ == "__main__":
    main()
