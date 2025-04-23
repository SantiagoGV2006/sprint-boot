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
import com.university.crud_basic.model.ProfessorDTO;
import com.university.crud_basic.service.ProfessorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/professors")
public class ProfessorController {
    
    @Autowired
    private ProfessorService service;
    
    @GetMapping
    public ResponseEntity<List<ProfessorDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProfessorDTO> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Profesor", "id", id));
    }
    
    @PostMapping
    public ResponseEntity<ProfessorDTO> create(@Valid @RequestBody ProfessorDTO professor) {
        // Verificar si el email ya existe
        if (professor.getEmail() != null && !professor.getEmail().isEmpty() 
                && service.existsByEmail(professor.getEmail())) {
            throw new DuplicateDataException("Profesor", "email", professor.getEmail());
        }
        
        ProfessorDTO saved = service.create(professor);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProfessorDTO> update(@PathVariable Integer id, @Valid @RequestBody ProfessorDTO professor) {
        // Verificar si existe el profesor
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Profesor", "id", id);
        }
        
        // Verificar si el email ya existe y no pertenece a este profesor
        if (professor.getEmail() != null && !professor.getEmail().isEmpty() 
                && service.existsByEmailAndIdProfessorNot(professor.getEmail(), id)) {
            throw new DuplicateDataException("Profesor", "email", professor.getEmail());
        }
        
        return service.update(id, professor)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Profesor", "id", id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Profesor", "id", id);
        }
        
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}