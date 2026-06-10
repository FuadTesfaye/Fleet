package com.fms.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRoutesConfig {

    @Value("${fms.gateway.auth-service-url:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${fms.gateway.user-service-url:http://localhost:8082}")
    private String userServiceUrl;

    @Value("${fms.gateway.vehicle-service-url:http://localhost:8083}")
    private String vehicleServiceUrl;

    @Value("${fms.gateway.tracking-service-url:http://localhost:8084}")
    private String trackingServiceUrl;

    @Value("${fms.gateway.dispatch-service-url:http://localhost:8085}")
    private String dispatchServiceUrl;

    @Value("${fms.gateway.maintenance-service-url:http://localhost:8086}")
    private String maintenanceServiceUrl;

    @Value("${fms.gateway.fuel-service-url:http://localhost:8087}")
    private String fuelServiceUrl;

    @Value("${fms.gateway.notification-service-url:http://localhost:8088}")
    private String notificationServiceUrl;

    @Value("${fms.gateway.reporting-service-url:http://localhost:8089}")
    private String reportingServiceUrl;

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/v1/auth/**", "/api/v1/roles/**")
                        .uri(authServiceUrl))
                .route("user-service", r -> r.path("/api/v1/employees/**", "/api/v1/drivers/**", "/api/v1/organisations/**")
                        .uri(userServiceUrl))
                .route("vehicle-service", r -> r.path("/api/v1/vehicles/**")
                        .uri(vehicleServiceUrl))
                .route("tracking-service", r -> r.path("/api/v1/tracking/**", "/api/v1/trips/**", "/api/v1/geofences/**")
                        .uri(trackingServiceUrl))
                .route("dispatch-service", r -> r.path("/api/v1/dispatches/**", "/api/v1/work-orders/**")
                        .uri(dispatchServiceUrl))
                .route("maintenance-service", r -> r.path("/api/v1/maintenance/**")
                        .uri(maintenanceServiceUrl))
                .route("fuel-service", r -> r.path("/api/v1/fuel/**")
                        .uri(fuelServiceUrl))
                .route("notification-service", r -> r.path("/api/v1/notifications/**")
                        .uri(notificationServiceUrl))
                .route("reporting-service", r -> r.path("/api/v1/reports/**", "/api/v1/audit/**")
                        .uri(reportingServiceUrl))
                .build();
    }
}
