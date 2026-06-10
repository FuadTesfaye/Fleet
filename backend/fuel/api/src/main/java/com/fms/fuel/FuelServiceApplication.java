package com.fms.fuel.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.fms.fuel")
public class FuelServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FuelServiceApplication.class, args);
    }
}
