package com.example.fido2server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

  @Id
  public UUID id;
  public String userName;
  public String firstName;
  public String lastName;

  public User() { }
}
