package com.university.crud_basic.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.university.crud_basic.model.Curso;

public interface CursoRepository extends JpaRepository<Curso, Long> {
}
