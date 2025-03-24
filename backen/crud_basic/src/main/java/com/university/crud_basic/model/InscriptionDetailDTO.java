package com.university.crud_basic.model;


import java.math.BigDecimal;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inscription_detail")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionDetailDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "id_inscription")
    private Integer idInscription;
    
    @Column(name = "id_course")
    private Integer idCourse;
    
    @Column(name = "final_grade", precision = 5, scale = 2)
    private BigDecimal finalGrade;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_course", insertable = false, updatable = false)
    private CourseDTO course;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_inscription", insertable = false, updatable = false)
    @JsonIgnore // Para evitar ciclos en la serialización JSON
    private InscriptionDTO inscription;

    public void setId(Integer id) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setIdInscription(Integer idInscription) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void setInscription(InscriptionDTO savedInscription) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}