package com.university.crud_basic.repository;

import com.university.crud_basic.model.ProfessorDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository extends JpaRepository<ProfessorDTO, Integer> {
}