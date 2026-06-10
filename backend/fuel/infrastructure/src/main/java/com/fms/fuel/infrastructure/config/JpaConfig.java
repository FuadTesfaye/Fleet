package com.fms.fuel.infrastructure.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.fms.fuel.infrastructure.persistence.repository")
@EntityScan(basePackages = "com.fms.fuel.infrastructure.persistence.entity")
public class JpaConfig {}
