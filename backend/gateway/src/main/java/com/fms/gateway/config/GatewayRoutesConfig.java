package com.fms.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/v1/auth/**")
                        .uri("http://localhost:8081"))
                .route("user-service", r -> r.path("/api/v1/employees/**", "/api/v1/drivers/**", "/api/v1/organisations/**")
                        .uri("http://localhost:8082"))
                .route("vehicle-service", r -> r.path("/api/v1/vehicles/**")
                        .uri("http://localhost:8083"))
                .route("tracking-service", r -> r.path("/api/v1/tracking/**", "/api/v1/trips/**", "/api/v1/geofences/**")
                        .uri("http://localhost:8084"))
                .route("dispatch-service", r -> r.path("/api/v1/dispatches/**", "/api/v1/work-orders/**")
                        .uri("http://localhost:8085"))
                .route("maintenance-service", r -> r.path("/api/v1/maintenance/**")
                        .uri("http://localhost:8086"))
                .route("fuel-service", r -> r.path("/api/v1/fuel/**")
                        .uri("http://localhost:8087"))
                .route("notification-service", r -> r.path("/api/v1/notifications/**")
                        .uri("http://localhost:8088"))
                .route("reporting-service", r -> r.path("/api/v1/reports/**", "/api/v1/audit/**")
                        .uri("http://localhost:8089"))
                .build();
    }
}
