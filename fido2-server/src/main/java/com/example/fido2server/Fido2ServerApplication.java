package com.example.fido2server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class Fido2ServerApplication {

  public static void main(String[] args) {
    SpringApplication.run(Fido2ServerApplication.class, args);
  }

}
