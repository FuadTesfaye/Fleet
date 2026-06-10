package com.fms.user.infrastructure.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.fms.user.infrastructure.persistence.repository")
@EntityScan(basePackages = "com.fms.user.infrastructure.persistence.entity")
public class JpaConfig {}
