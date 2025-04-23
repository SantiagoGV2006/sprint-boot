package com.university.crud_basic.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.crud_basic.model.InscriptionDTO;

@Repository
public interface InscriptionRepository extends JpaRepository<InscriptionDTO, Integer> {
    // Verifica si existe una inscripción para el estudiante en la fecha especificada
    boolean existsByIdStudentAndDate(Integer idStudent, LocalDate date);
    
    // Verifica si existe otra inscripción para el estudiante en la fecha especificada
    boolean existsByIdStudentAndDateAndIdInscriptionNot(Integer idStudent, LocalDate date, Integer idInscription);
}