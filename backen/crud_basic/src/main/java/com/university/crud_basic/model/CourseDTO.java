package com.university.crud_basic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "course")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCourse;
    
    @Column(name = "name", length = 100, nullable = false)
    private String name;
    
    @Column(name = "credits")
    private Integer credits;
    
    @Column(name = "id_professor")
    private Integer idProfessor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_professor", insertable = false, updatable = false)
    private ProfessorDTO professor;

    public void setIdCourse(Object object) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}