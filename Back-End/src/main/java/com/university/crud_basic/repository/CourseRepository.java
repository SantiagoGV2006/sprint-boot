package com.university.crud_basic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.crud_basic.model.CourseDTO;

@Repository
public interface CourseRepository extends JpaRepository<CourseDTO, Integer> {
    // Verifica si existe un curso con el nombre proporcionado (ignorando mayúsculas/minúsculas)
    boolean existsByNameIgnoreCase(String name);
    
    // Verifica si existe un curso con el nombre proporcionado que no tenga el ID especificado
    boolean existsByNameIgnoreCaseAndIdCourseNot(String name, Integer idCourse);
}