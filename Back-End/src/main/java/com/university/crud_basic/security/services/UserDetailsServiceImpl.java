package com.university.crud_basic.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.crud_basic.model.UserDTO;
import com.university.crud_basic.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    private static final int MAX_FAILED_ATTEMPTS = 5;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDTO user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con nombre: " + username));

        return UserDetailsImpl.build(user);
    }

    public void increaseFailedAttempts(UserDTO user) {
        int newFailAttempts = user.getFailedAttempts() + 1;
        userRepository.updateFailedAttempts(newFailAttempts, user.getUsername());
        
        // Si supera el máximo de intentos, bloquear cuenta
        if (newFailAttempts >= MAX_FAILED_ATTEMPTS) {
            lockUser(user.getUsername());
        }
    }
    
    public void resetFailedAttempts(String username) {
        userRepository.updateFailedAttempts(0, username);
    }
    
    public void lockUser(String username) {
        userRepository.updateAccountLocked(false, username);
    }
    
    public void unlockUser(String username) {
        userRepository.updateFailedAttempts(0, username);
        userRepository.updateAccountLocked(true, username);
    }
}