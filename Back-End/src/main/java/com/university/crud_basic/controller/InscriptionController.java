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

import com.university.crud_basic.Exception.BusinessRuleException;
import com.university.crud_basic.Exception.DuplicateDataException;
import com.university.crud_basic.Exception.ResourceNotFoundException;
import com.university.crud_basic.model.InscriptionDTO;
import com.university.crud_basic.service.CourseService;
import com.university.crud_basic.service.InscriptionService;
import com.university.crud_basic.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {
    
    @Autowired
    private InscriptionService service;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping
    public ResponseEntity<List<InscriptionDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InscriptionDTO> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripción", "id", id));
    }
    
    @PostMapping
    public ResponseEntity<InscriptionDTO> create(@Valid @RequestBody InscriptionDTO inscription) {
        // Verificar si el estudiante existe
        if (!studentService.existsById(inscription.getIdStudent())) {
            throw new ResourceNotFoundException("Estudiante", "id", inscription.getIdStudent());
        }
        
        // Verificar que la inscripción tenga al menos un detalle
        if (inscription.getDetails() == null || inscription.getDetails().isEmpty()) {
            throw new BusinessRuleException("La inscripción debe incluir al menos un curso");
        }
        
        // Verificar que los cursos existan
        inscription.getDetails().forEach(detail -> {
            if (!courseService.existsById(detail.getIdCourse())) {
                throw new ResourceNotFoundException("Curso", "id", detail.getIdCourse());
            }
        });
        
        // Verificar que no haya duplicados en los cursos
        long uniqueCourses = inscription.getDetails().stream()
                .map(detail -> detail.getIdCourse())
                .distinct()
                .count();
        if (uniqueCourses != inscription.getDetails().size()) {
            throw new DuplicateDataException("La inscripción contiene cursos duplicados");
        }
        
        // Verificar si ya existe una inscripción para este estudiante en la misma fecha
        if (service.existsByIdStudentAndDate(inscription.getIdStudent(), inscription.getDate())) {
            throw new DuplicateDataException(
                "Ya existe una inscripción para este estudiante en la fecha especificada");
        }
        
        InscriptionDTO saved = service.create(inscription);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<InscriptionDTO> update(@PathVariable Integer id, @Valid @RequestBody InscriptionDTO inscription) {
        // Verificar si existe la inscripción
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Inscripción", "id", id);
        }
        
        // Verificar si el estudiante existe
        if (!studentService.existsById(inscription.getIdStudent())) {
            throw new ResourceNotFoundException("Estudiante", "id", inscription.getIdStudent());
        }
        
        // Verificar que la inscripción tenga al menos un detalle
        if (inscription.getDetails() == null || inscription.getDetails().isEmpty()) {
            throw new BusinessRuleException("La inscripción debe incluir al menos un curso");
        }
        
        // Verificar que los cursos existan
        inscription.getDetails().forEach(detail -> {
            if (!courseService.existsById(detail.getIdCourse())) {
                throw new ResourceNotFoundException("Curso", "id", detail.getIdCourse());
            }
        });
        
        // Verificar que no haya duplicados en los cursos
        long uniqueCourses = inscription.getDetails().stream()
                .map(detail -> detail.getIdCourse())
                .distinct()
                .count();
        if (uniqueCourses != inscription.getDetails().size()) {
            throw new DuplicateDataException("La inscripción contiene cursos duplicados");
        }
        
        // Verificar si ya existe otra inscripción para este estudiante en la misma fecha
        if (service.existsByIdStudentAndDateAndIdInscriptionNot(
                inscription.getIdStudent(), inscription.getDate(), id)) {
            throw new DuplicateDataException(
                "Ya existe otra inscripción para este estudiante en la fecha especificada");
        }
        
        return service.update(id, inscription)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripción", "id", id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Inscripción", "id", id);
        }
        
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}