package com.university.crud_basic.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.crud_basic.Exception.DuplicateDataException;
import com.university.crud_basic.Exception.ResourceNotFoundException;
import com.university.crud_basic.model.CourseDTO;
import com.university.crud_basic.service.CourseService;
import com.university.crud_basic.service.ProfessorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    
    @Autowired
    private CourseService service;
    
    @Autowired
    private ProfessorService professorService;
    
    @GetMapping
public ResponseEntity<?> findAll() {
    try {
        List<CourseDTO> courses = service.findAll();
        return ResponseEntity.ok(courses);
    } catch (Exception e) {
        e.printStackTrace(); // Esto escribirá la excepción en los logs
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Error al cargar cursos: " + e.getMessage()));
    }
}
    
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Curso", "id", id));
    }
    
    @PostMapping
    public ResponseEntity<CourseDTO> create(@Valid @RequestBody CourseDTO course) {
        // Verificar si el profesor existe
        if (!professorService.existsById(course.getIdProfessor())) {
            throw new ResourceNotFoundException("Profesor", "id", course.getIdProfessor());
        }
        
        // Verificar si ya existe un curso con el mismo nombre
        if (service.existsByName(course.getName())) {
            throw new DuplicateDataException("Curso", "nombre", course.getName());
        }
        
        CourseDTO saved = service.create(course);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> update(@PathVariable Integer id, @Valid @RequestBody CourseDTO course) {
        // Verificar si existe el curso
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Curso", "id", id);
        }
        
        // Verificar si el profesor existe
        if (!professorService.existsById(course.getIdProfessor())) {
            throw new ResourceNotFoundException("Profesor", "id", course.getIdProfessor());
        }
        
        // Verificar si ya existe un curso con el mismo nombre que no sea este
        if (service.existsByNameAndIdCourseNot(course.getName(), id)) {
            throw new DuplicateDataException("Curso", "nombre", course.getName());
        }
        
        return service.update(id, course)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Curso", "id", id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Curso", "id", id);
        }
        
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}