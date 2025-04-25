package com.university.crud_basic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.crud_basic.model.UserDTO;

@Repository
public interface UserRepository extends JpaRepository<UserDTO, Integer> {
    Optional<UserDTO> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}