package com.university.crud_basic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.university.crud_basic.Exception.DuplicateDataException;
import com.university.crud_basic.model.UserDTO;
import com.university.crud_basic.model.request.RegisterRequest;
import com.university.crud_basic.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO registerNewUser(RegisterRequest registerRequest) {
        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateDataException("Usuario", "nombre de usuario", registerRequest.getUsername());
        }

        // Check if email already exists
        if (registerRequest.getEmail() != null && userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateDataException("Usuario", "email", registerRequest.getEmail());
        }

        // Create new user with encoded password
        UserDTO user = new UserDTO(
            registerRequest.getUsername(),
            passwordEncoder.encode(registerRequest.getPassword()),
            registerRequest.getEmail(),
            registerRequest.getRole() != null ? registerRequest.getRole() : "USER"
        );

        // Save the user to the database
        return userRepository.save(user);
    }
}