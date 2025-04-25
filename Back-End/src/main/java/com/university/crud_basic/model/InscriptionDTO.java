package com.university.crud_basic.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

@Entity
@Table(name = "inscription")
public class InscriptionDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idInscription;
    
    @Column(name = "date")
    @NotNull(message = "La fecha de inscripción no puede estar vacía")
    @PastOrPresent(message = "La fecha de inscripción no puede ser futura")
    private LocalDate date;
    
    @Column(name = "id_student")
    @NotNull(message = "Se debe asignar un estudiante a la inscripción")
    private Integer idStudent;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_student", insertable = false, updatable = false)
    private StudentDTO student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_course", insertable = false, updatable = false)
    private CourseDTO course;
    
    @OneToMany(mappedBy = "inscription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InscriptionDetailDTO> details = new ArrayList<>();

    public void setIdInscription(Integer idInscription) {
        this.idInscription = idInscription;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getIdStudent() {
        return idStudent;
    }

    public void setIdStudent(Integer idStudent) {
        this.idStudent = idStudent;
    }

    public StudentDTO getStudent() {
        return student;
    }

    public void setStudent(StudentDTO student) {
        this.student = student;
    }

    public List<InscriptionDetailDTO> getDetails() {
        return details;
    }

    public void setDetails(List<InscriptionDetailDTO> details) {
        this.details = details;
    }

    public Integer getIdInscription() {
        return idInscription;
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
}