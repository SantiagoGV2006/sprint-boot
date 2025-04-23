package com.university.crud_basic.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.university.crud_basic.model.CourseDTO;
import com.university.crud_basic.repository.CourseRepository;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository repository;
    
    public List<CourseDTO> findAll() {
        return repository.findAll();
    }
    
    public Optional<CourseDTO> findById(Integer id) {
        return repository.findById(id);
    }
    
    public CourseDTO create(CourseDTO course) {
        course.setIdCourse(null); // Asegurar que es una nueva entidad
        return repository.save(course);
    }
    
    public Optional<CourseDTO> update(Integer id, CourseDTO course) {
        if (!repository.existsById(id)) {
            return Optional.empty();
        }
        
        course.setIdCourse(id);
        return Optional.of(repository.save(course));
    }
    
    public boolean deleteById(Integer id) {
        if (!repository.existsById(id)) {
            return false;
        }
        
        repository.deleteById(id);
        return true;
    }
    
    // Nuevos métodos para validación
    public boolean existsById(Integer id) {
        return repository.existsById(id);
    }
    
    public boolean existsByName(String name) {
        return repository.existsByNameIgnoreCase(name);
    }
    
    public boolean existsByNameAndIdCourseNot(String name, Integer idCourse) {
        return repository.existsByNameIgnoreCaseAndIdCourseNot(name, idCourse);
    }
}