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
import com.university.crud_basic.model.InscriptionDetailDTO;
import com.university.crud_basic.service.CourseService;
import com.university.crud_basic.service.InscriptionDetailService;
import com.university.crud_basic.service.InscriptionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inscription-details")
public class InscriptionDetailController {
    
    @Autowired
    private InscriptionDetailService service;
    
    @Autowired
    private InscriptionService inscriptionService;
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping
    public ResponseEntity<List<InscriptionDetailDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/inscription/{idInscription}")
    public ResponseEntity<List<InscriptionDetailDTO>> findByInscriptionId(@PathVariable Integer idInscription) {
        if (!inscriptionService.existsById(idInscription)) {
            throw new ResourceNotFoundException("Inscripción", "id", idInscription);
        }
        return ResponseEntity.ok(service.findByInscriptionId(idInscription));
    }
    
    @GetMapping("/inscription/{idInscription}/course/{idCourse}")
    public ResponseEntity<List<InscriptionDetailDTO>> findByInscriptionAndCourse(
            @PathVariable Integer idInscription,
            @PathVariable Integer idCourse) {
        if (!inscriptionService.existsById(idInscription)) {
            throw new ResourceNotFoundException("Inscripción", "id", idInscription);
        }
        if (!courseService.existsById(idCourse)) {
            throw new ResourceNotFoundException("Curso", "id", idCourse);
        }
        
        List<InscriptionDetailDTO> details = service.findByInscriptionAndCourse(idInscription, idCourse);
        if (details.isEmpty()) {
            throw new ResourceNotFoundException("Detalle de inscripción", "inscripción y curso", idInscription + ", " + idCourse);
        }
        return ResponseEntity.ok(details);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InscriptionDetailDTO> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Detalle de inscripción", "id", id));
    }
    
    @PostMapping
    public ResponseEntity<InscriptionDetailDTO> create(@Valid @RequestBody InscriptionDetailDTO detail) {
        // Verificar si la inscripción existe
        if (!inscriptionService.existsById(detail.getIdInscription())) {
            throw new ResourceNotFoundException("Inscripción", "id", detail.getIdInscription());
        }
        
        // Verificar si el curso existe
        if (!courseService.existsById(detail.getIdCourse())) {
            throw new ResourceNotFoundException("Curso", "id", detail.getIdCourse());
        }
        
        // Verificar si ya existe el detalle para esta inscripción y curso
        if (!service.findByInscriptionAndCourse(detail.getIdInscription(), detail.getIdCourse()).isEmpty()) {
            throw new DuplicateDataException("Ya existe este curso en la inscripción");
        }
        
        InscriptionDetailDTO saved = service.create(detail);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<InscriptionDetailDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody InscriptionDetailDTO detail) {
        // Verificar si existe el detalle
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Detalle de inscripción", "id", id);
        }
        
        // Verificar si la inscripción existe
        if (!inscriptionService.existsById(detail.getIdInscription())) {
            throw new ResourceNotFoundException("Inscripción", "id", detail.getIdInscription());
        }
        
        // Verificar si el curso existe
        if (!courseService.existsById(detail.getIdCourse())) {
            throw new ResourceNotFoundException("Curso", "id", detail.getIdCourse());
        }
        
        // Verificar si ya existe otro detalle para esta inscripción y curso
        List<InscriptionDetailDTO> existingDetails = service.findByInscriptionAndCourse(
                detail.getIdInscription(), detail.getIdCourse());
        
        if (!existingDetails.isEmpty() && existingDetails.stream().noneMatch(d -> d.getId().equals(id))) {
            throw new DuplicateDataException("Ya existe este curso en la inscripción");
        }
        
        return service.update(id, detail)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Detalle de inscripción", "id", id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!service.existsById(id)) {
            throw new ResourceNotFoundException("Detalle de inscripción", "id", id);
        }
        
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/inscription/{idInscription}/course/{idCourse}")
    public ResponseEntity<Void> deleteByInscriptionAndCourse(
            @PathVariable Integer idInscription,
            @PathVariable Integer idCourse) {
        if (!inscriptionService.existsById(idInscription)) {
            throw new ResourceNotFoundException("Inscripción", "id", idInscription);
        }
        if (!courseService.existsById(idCourse)) {
            throw new ResourceNotFoundException("Curso", "id", idCourse);
        }
        
        boolean deleted = service.deleteByInscriptionAndCourse(idInscription, idCourse);
        if (!deleted) {
            throw new ResourceNotFoundException("Detalle de inscripción", "inscripción y curso", idInscription + ", " + idCourse);
        }
        
        return ResponseEntity.noContent().build();
    }
}