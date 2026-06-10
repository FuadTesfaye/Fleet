package com.fms.dispatch.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.fms.dispatch")
public class DispatchServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DispatchServiceApplication.class, args);
    }
}
