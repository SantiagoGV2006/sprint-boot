package com.university.crud_basic.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.time.Duration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.crud_basic.model.ERole;
import com.university.crud_basic.model.RoleDTO;
import com.university.crud_basic.model.UserDTO;
import com.university.crud_basic.payload.AuthPayloads.JwtResponse;
import com.university.crud_basic.payload.AuthPayloads.LoginRequest;
import com.university.crud_basic.payload.AuthPayloads.MessageResponse;
import com.university.crud_basic.payload.AuthPayloads.SignupRequest;
import com.university.crud_basic.repository.RoleRepository;
import com.university.crud_basic.repository.UserRepository;
import com.university.crud_basic.security.JwtUtils;
import com.university.crud_basic.security.services.ReCaptchaService;
import com.university.crud_basic.security.services.UserDetailsImpl;
import com.university.crud_basic.security.services.UserDetailsServiceImpl;

@CrossOrigin(origins = "*", 
             maxAge = 3600, 
             allowCredentials = "false")  // Cambiar a false para permitir cualquier origen
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;
    
    @Autowired
    private ReCaptchaService reCaptchaService;
    
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Verificar reCAPTCHA (desactivado para facilitar las pruebas)
        if (loginRequest.getRecaptchaToken() != null && !reCaptchaService.validateToken(loginRequest.getRecaptchaToken())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Verificación reCAPTCHA fallida"));
        }
        
        // Intenta encontrar al usuario por nombre de usuario o email
        UserDTO user = userRepository.findByUsername(loginRequest.getUsernameOrEmail())
                .orElse(userRepository.findByEmail(loginRequest.getUsernameOrEmail()).orElse(null));
                
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Usuario o contraseña incorrectos"));
        }
        
        // Verifica si la cuenta está bloqueada
        if (!user.isAccountNonLocked()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: La cuenta está bloqueada por múltiples intentos fallidos. Contacte al administrador"));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(), // Siempre autenticar con username
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());
            
            // Resetea los intentos fallidos
            userDetailsService.resetFailedAttempts(user.getUsername());

            // Crear cookie HttpOnly con el token JWT
            ResponseCookie jwtCookie = ResponseCookie.from("jwt", jwt)
                    .httpOnly(true)            // Previene acceso desde JavaScript
                    .secure(false)             // Cambiar a false para pruebas locales
                    .sameSite("Lax")          // Más permisivo para redes locales
                    .maxAge(Duration.ofMillis(jwtExpirationMs))
                    .path("/")
                    .build();

            // Devolver la respuesta con la cookie y el token en el body
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(new JwtResponse(jwt, // Incluir el token para casos especiales
                                         userDetails.getId(), 
                                         userDetails.getFirstName(),
                                         userDetails.getLastName(),
                                         userDetails.getUsername(), 
                                         userDetails.getEmail(), 
                                         roles));
        } catch (BadCredentialsException e) {
            // Incrementa los intentos fallidos
            userDetailsService.increaseFailedAttempts(user);
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Usuario o contraseña incorrectos"));
        } catch (LockedException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: La cuenta está bloqueada por múltiples intentos fallidos. Contacte al administrador"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Verificar reCAPTCHA (desactivado para facilitar las pruebas)
        if (signUpRequest.getRecaptchaToken() != null && !reCaptchaService.validateToken(signUpRequest.getRecaptchaToken())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Verificación reCAPTCHA fallida"));
        }
        
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: El nombre de usuario ya está en uso"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: El correo electrónico ya está en uso"));
        }

        // Crear nueva cuenta de usuario
        UserDTO user = new UserDTO(
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
                
        user.setPhone(signUpRequest.getPhone());
        user.setPosition(signUpRequest.getPosition());
        user.setEmployeeId(signUpRequest.getEmployeeId());

        Set<String> strRoles = signUpRequest.getRoles();
        Set<RoleDTO> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            RoleDTO userRole = roleRepository.findByName(ERole.ROLE_CLIENT)
                    .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                case "admin":
                    RoleDTO adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
                    roles.add(adminRole);
                    break;
                case "staff":
                    RoleDTO staffRole = roleRepository.findByName(ERole.ROLE_STAFF)
                            .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
                    roles.add(staffRole);
                    break;
                default:
                    RoleDTO userRole = roleRepository.findByName(ERole.ROLE_CLIENT)
                            .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("¡Usuario registrado exitosamente!"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        // Crear una cookie con el mismo nombre pero con tiempo de expiración 0
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)  // Cambiar a false para pruebas locales
                .sameSite("Lax")
                .maxAge(0)  // Expiración inmediata
                .path("/")
                .build();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("¡Has cerrado sesión correctamente!"));
    }
}