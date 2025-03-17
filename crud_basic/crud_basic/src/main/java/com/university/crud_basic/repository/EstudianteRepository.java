package com.university.crud_basic.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.university.crud_basic.model.Estudiante;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
}
