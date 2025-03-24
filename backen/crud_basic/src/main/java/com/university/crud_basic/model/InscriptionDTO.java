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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inscription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionDTO {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idInscription;
    
    @Column(name = "date")
    private LocalDate date;
    
    @Column(name = "id_student")
    private Integer idStudent;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_student", insertable = false, updatable = false)
    private StudentDTO student;
    
    @OneToMany(mappedBy = "inscription", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InscriptionDetailDTO> details = new ArrayList<>();

    public void setIdInscription(Object object) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public Integer getIdInscription() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public Object getDetails() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
