package com.university.crud_basic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.university.crud_basic.model.UserDTO;

@Repository
public interface UserRepository extends JpaRepository<UserDTO, Integer> {
    Optional<UserDTO> findByUsername(String username);
    Optional<UserDTO> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Transactional
    @Modifying
    @Query("UPDATE UserDTO u SET u.failedAttempts = ?1 WHERE u.username = ?2")
    void updateFailedAttempts(int failedAttempts, String username);
    
    @Transactional
    @Modifying
    @Query("UPDATE UserDTO u SET u.accountNonLocked = ?1 WHERE u.username = ?2")
    void updateAccountLocked(boolean accountNonLocked, String username);
}