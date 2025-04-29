package com.university.crud_basic.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "course")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CourseDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCourse;
    
    @Column(name = "name", length = 100, nullable = false)
    @NotBlank(message = "El nombre del curso no puede estar vacío")
    @Size(min = 2, max = 100, message = "El nombre del curso debe tener entre 2 y 100 caracteres")
    private String name;
    
    @Column(name = "credits")
    @Min(value = 1, message = "El curso debe tener al menos 1 crédito")
    @Max(value = 20, message = "El curso no puede tener más de 20 créditos")
    private Integer credits;
    
    @Column(name = "id_professor")
    @NotNull(message = "Se debe asignar un profesor al curso")
    private Integer idProfessor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_professor", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProfessorDTO professor;

    // Getters y setters
    public Integer getIdCourse() {
        return idCourse;
    }

    public void setIdCourse(Integer idCourse) {
        this.idCourse = idCourse;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Integer getIdProfessor() {
        return idProfessor;
    }

    public void setIdProfessor(Integer idProfessor) {
        this.idProfessor = idProfessor;
    }

    public ProfessorDTO getProfessor() {
        return professor;
    }

    public void setProfessor(ProfessorDTO professor) {
        this.professor = professor;
    }
}