package com.sena.crud_basic.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sena.crud_basic.model.ERole;
import com.sena.crud_basic.model.RoleDTO;
import com.sena.crud_basic.model.UserDTO;
import com.sena.crud_basic.repository.RoleRepository;
import com.sena.crud_basic.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Inicializar roles si no existen
        initRoles();
        
        // Crear usuario administrador por defecto si no existe
        createAdminUser();
    }
    
    private void initRoles() {
        // Verificar si ya existen roles
        if (roleRepository.count() == 0) {
            // Crear roles
            RoleDTO clientRole = new RoleDTO(ERole.ROLE_CLIENT);
            RoleDTO staffRole = new RoleDTO(ERole.ROLE_STAFF);
            RoleDTO adminRole = new RoleDTO(ERole.ROLE_ADMIN);
            
            // Guardar roles
            roleRepository.save(clientRole);
            roleRepository.save(staffRole);
            roleRepository.save(adminRole);
            
            System.out.println("Roles creados exitosamente");
        }
    }
    
    private void createAdminUser() {
        // Verificar si el usuario admin ya existe
        if (!userRepository.existsByUsername("admin")) {
            // Crear usuario administrador
            UserDTO adminUser = new UserDTO();
            adminUser.setFirstName("Admin");
            adminUser.setLastName("Sistema");
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@restaurant.com");
            adminUser.setPassword(passwordEncoder.encode("Admin@123"));
            
            // Asignar rol de administrador
            Set<RoleDTO> roles = new HashSet<>();
            RoleDTO adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Rol de administrador no encontrado."));
            roles.add(adminRole);
            adminUser.setRoles(roles);
            
            // Guardar usuario
            userRepository.save(adminUser);
            
            System.out.println("Usuario administrador creado exitosamente");
        }
    }
}