package com.fms.dispatch.infrastructure.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.fms.dispatch.infrastructure.persistence.repository")
@EntityScan(basePackages = "com.fms.dispatch.infrastructure.persistence.entity")
public class JpaConfig {}
