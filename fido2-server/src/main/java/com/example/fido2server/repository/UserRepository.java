package com.example.fido2server.repository;

import com.example.fido2server.model.User;
import org.springframework.data.repository.CrudRepository;


public interface UserRepository extends CrudRepository<User, String> {

}
