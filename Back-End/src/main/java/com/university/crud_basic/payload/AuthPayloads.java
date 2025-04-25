package com.university.crud_basic.payload;

import java.util.List;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthPayloads {
    
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Integer id;
        private String firstName;
        private String lastName;
        private String username;
        private String email;
        private List<String> roles;

        public JwtResponse(String token, Integer id, String firstName, String lastName, 
                          String username, String email, List<String> roles) {
            this.token = token;
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.username = username;
            this.email = email;
            this.roles = roles;
        }

        // Getters y Setters
        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public List<String> getRoles() {
            return roles;
        }

        public void setRoles(List<String> roles) {
            this.roles = roles;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
    }
    
    public static class LoginRequest {
        @NotBlank(message = "El nombre de usuario o email no puede estar vacío")
        private String usernameOrEmail;

        @NotBlank(message = "La contraseña no puede estar vacía")
        private String password;
        
        private String recaptchaToken;

        // Getters y Setters
        public String getUsernameOrEmail() {
            return usernameOrEmail;
        }

        public void setUsernameOrEmail(String usernameOrEmail) {
            this.usernameOrEmail = usernameOrEmail;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRecaptchaToken() {
            return recaptchaToken;
        }

        public void setRecaptchaToken(String recaptchaToken) {
            this.recaptchaToken = recaptchaToken;
        }
    }
    
    public static class SignupRequest {
        @NotBlank(message = "El nombre no puede estar vacío")
        @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
        private String firstName;
        
        @NotBlank(message = "El apellido no puede estar vacío")
        @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
        private String lastName;
        
        @NotBlank(message = "El nombre de usuario no puede estar vacío")
        @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
        private String username;

        @NotBlank(message = "La contraseña no puede estar vacía")
        @Size(min = 6, max = 100, message = "La contraseña debe tener al menos 6 caracteres")
        private String password;
        
        @NotBlank(message = "El email no puede estar vacío")
        @Size(max = 100, message = "El email no puede exceder 100 caracteres")
        @Email(message = "Formato de email inválido")
        private String email;
        
        private String phone;
        
        private String position;
        
        private String employeeId;
        
        private Set<String> roles;
        
        private String recaptchaToken;

        // Getters y Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Set<String> getRoles() {
            return roles;
        }

        public void setRoles(Set<String> roles) {
            this.roles = roles;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getPosition() {
            return position;
        }

        public void setPosition(String position) {
            this.position = position;
        }

        public String getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }

        public String getRecaptchaToken() {
            return recaptchaToken;
        }

        public void setRecaptchaToken(String recaptchaToken) {
            this.recaptchaToken = recaptchaToken;
        }
    }
    
    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}