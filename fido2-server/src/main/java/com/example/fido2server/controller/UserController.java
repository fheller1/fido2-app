package com.example.fido2server.controller;

import com.example.fido2server.model.User;
import com.example.fido2server.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@CrossOrigin(origins = {"http://localhost:4200"})
@RestController
@RequestMapping(value = "/user")
public class UserController {

  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping
  public List<User> getAllUsers() {
    Iterable<User> iterable = userRepository.findAll();
    return StreamSupport.stream(iterable.spliterator(), false).collect(Collectors.toList());
  }

  @PostMapping
  public User postUser(@RequestBody User user) {

    return userRepository.save(user);
  }

}
