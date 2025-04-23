package com.university.crud_basic.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "inscription_detail")
public class InscriptionDetailDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "id_inscription")
    @NotNull(message = "El ID de inscripción no puede estar vacío")
    private Integer idInscription;
    
    @Column(name = "id_course")
    @NotNull(message = "El ID del curso no puede estar vacío")
    private Integer idCourse;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_course", insertable = false, updatable = false)
    private CourseDTO course;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_inscription", insertable = false, updatable = false)
    @JsonIgnore // Para evitar ciclos en la serialización JSON
    private InscriptionDTO inscription;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdInscription() {
        return idInscription;
    }

    public void setIdInscription(Integer idInscription) {
        this.idInscription = idInscription;
    }

    public Integer getIdCourse() {
        return idCourse;
    }

    public void setIdCourse(Integer idCourse) {
        this.idCourse = idCourse;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public InscriptionDTO getInscription() {
        return inscription;
    }

    public void setInscription(InscriptionDTO inscription) {
        this.inscription = inscription;
    }
}