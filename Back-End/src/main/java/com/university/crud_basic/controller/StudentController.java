package com.university.crud_basic.controller;

import java.util.List;

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
import com.university.crud_basic.model.StudentDTO;
import com.university.crud_basic.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    
    @Autowired
    private StudentService service;
    
    @GetMapping
    public ResponseEntity<List<StudentDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante", "id", id));
    }
    
    @PostMapping
    public ResponseEntity<StudentDTO> create(@Valid @RequestBody StudentDTO student) {
        // Verificar si el email ya existe
        if (student.getEmail() != null && !student.getEmail().isEmpty() 
                && service.existsByEmail(student.getEmail())) {
            throw new DuplicateDataException("Estudiante", "email", student.getEmail());
        }
        
        StudentDTO saved = service.create(student);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<StudentDTO> update(@PathVariable Integer id, @Valid @RequestBody StudentDTO student) {
        // Verificar si existe el estudiante
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Estudiante", "id", id);
        }
        
        // Verificar si el email ya existe y no pertenece a este estudiante
        if (student.getEmail() != null && !student.getEmail().isEmpty() 
                && service.existsByEmailAndIdStudentNot(student.getEmail(), id)) {
            throw new DuplicateDataException("Estudiante", "email", student.getEmail());
        }
        
        return service.update(id, student)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante", "id", id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Estudiante", "id", id);
        }
        
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}