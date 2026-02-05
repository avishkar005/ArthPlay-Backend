package com.arthplay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.arthplay")
public class ArthPlayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ArthPlayApplication.class, args);
    }
}
