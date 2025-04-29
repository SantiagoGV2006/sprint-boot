package com.university.crud_basic.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "student")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StudentDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idStudent;
    
    @Column(name = "name", length = 25, nullable = false)
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(min = 2, max = 25, message = "El nombre debe tener entre 2 y 25 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El nombre solo puede contener letras")
    private String name;
    
    @Column(name = "lastname", length = 25, nullable = false)
    @NotBlank(message = "El apellido no puede estar vacío")
    @Size(min = 2, max = 25, message = "El apellido debe tener entre 2 y 25 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$", message = "El apellido solo puede contener letras")
    private String lastname;
    
    @Column(name = "address", length = 100)
    @Size(max = 100, message = "La dirección no puede exceder 100 caracteres")
    private String address;
    
    @Column(name = "phone", length = 15)
    @Pattern(regexp = "^[0-9+\\-\\s]*$", message = "Formato de teléfono inválido")
    @Size(max = 15, message = "El teléfono no puede exceder 15 caracteres")
    private String phone;
    
    @Column(name = "email", length = 100)
    @Email(message = "Formato de email inválido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    // Getters y setters
    public Integer getIdStudent() {
        return idStudent;
    }

    public void setIdStudent(Integer idStudent) {
        this.idStudent = idStudent;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}