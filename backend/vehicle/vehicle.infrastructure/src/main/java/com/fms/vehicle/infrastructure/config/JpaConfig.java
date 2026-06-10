package com.fms.vehicle.infrastructure.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.fms.vehicle.infrastructure.persistence.repository")
@EntityScan(basePackages = "com.fms.vehicle.infrastructure.persistence.entity")
public class JpaConfig {}
