package com.university.crud_basic.controller;

import com.university.crud_basic.model.InscriptionDetailDTO;
import com.university.crud_basic.service.InscriptionDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inscription-details")
public class InscriptionDetailController {
    
    @Autowired
    private InscriptionDetailService service;
    
    @GetMapping
    public ResponseEntity<List<InscriptionDetailDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/inscription/{idInscription}")
    public ResponseEntity<List<InscriptionDetailDTO>> findByInscriptionId(@PathVariable Integer idInscription) {
        return ResponseEntity.ok(service.findByInscriptionId(idInscription));
    }
    
    @GetMapping("/inscription/{idInscription}/course/{idCourse}")
    public ResponseEntity<List<InscriptionDetailDTO>> findByInscriptionAndCourse(
            @PathVariable Integer idInscription,
            @PathVariable Integer idCourse) {
        List<InscriptionDetailDTO> details = service.findByInscriptionAndCourse(idInscription, idCourse);
        return details.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(details);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InscriptionDetailDTO> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<InscriptionDetailDTO> create(@RequestBody InscriptionDetailDTO detail) {
        InscriptionDetailDTO saved = service.create(detail);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<InscriptionDetailDTO> update(
            @PathVariable Integer id,
            @RequestBody InscriptionDetailDTO detail) {
        return service.update(id, detail)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return service.deleteById(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/inscription/{idInscription}/course/{idCourse}")
    public ResponseEntity<Void> deleteByInscriptionAndCourse(
            @PathVariable Integer idInscription,
            @PathVariable Integer idCourse) {
        return service.deleteByInscriptionAndCourse(idInscription, idCourse)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}