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
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idStudent;
    
    @Column(name = "name", length = 25, nullable = false)
    private String name;
    
    @Column(name = "lastname", length = 25, nullable = false)
    private String lastname;
    
    @Column(name = "address", length = 100)
    private String address;
    
    @Column(name = "phone", length = 15)
    private String phone;
    
    @Column(name = "email", length = 100)
    private String email;

    public void setIdStudent(Object object) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}