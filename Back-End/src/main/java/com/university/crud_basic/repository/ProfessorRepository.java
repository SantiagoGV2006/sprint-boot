package com.university.crud_basic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.crud_basic.model.ProfessorDTO;

@Repository
public interface ProfessorRepository extends JpaRepository<ProfessorDTO, Integer> {
    // Verifica si existe un profesor con el email proporcionado
    boolean existsByEmail(String email);
    
    // Verifica si existe un profesor con el email proporcionado que no tenga el ID especificado
    boolean existsByEmailAndIdProfessorNot(String email, Integer idProfessor);
}