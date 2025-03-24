package com.university.crud_basic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "professor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProfessor;
    
    @Column(name = "name", length = 25, nullable = false)
    private String name;
    
    @Column(name = "lastname", length = 25, nullable = false)
    private String lastname;
    
    @Column(name = "speciality", length = 50)
    private String speciality;
    
    @Column(name = "phone", length = 15)
    private String phone;
    
    @Column(name = "email", length = 100)
    private String email;

    public void setIdProfessor(Object object) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}