package com.university.crud_basic.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

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
    
    private static final Logger logger = Logger.getLogger(InscriptionController.class.getName());
    
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
    public ResponseEntity<?> create(@Valid @RequestBody InscriptionDTO inscription) {
        try {
            logger.info("Recibida petición para crear inscripción");
            
            // Verificar si el estudiante existe
            if (!studentService.existsById(inscription.getIdStudent())) {
                logger.warning("Estudiante no encontrado: " + inscription.getIdStudent());
                throw new ResourceNotFoundException("Estudiante", "id", inscription.getIdStudent());
            }
            
            // Verificar que existe el curso principal
            if (inscription.getIdCourse() != null && !courseService.existsById(inscription.getIdCourse())) {
                logger.warning("Curso principal no encontrado: " + inscription.getIdCourse());
                throw new ResourceNotFoundException("Curso principal", "id", inscription.getIdCourse());
            }
            
            // Verificar que la inscripción tenga al menos un detalle
            if (inscription.getDetails() == null || inscription.getDetails().isEmpty()) {
                logger.warning("Inscripción sin detalles");
                throw new BusinessRuleException("La inscripción debe incluir al menos un curso");
            }
            
            // Verificar que los cursos existan
            inscription.getDetails().forEach(detail -> {
                if (!courseService.existsById(detail.getIdCourse())) {
                    logger.warning("Curso de detalle no encontrado: " + detail.getIdCourse());
                    throw new ResourceNotFoundException("Curso", "id", detail.getIdCourse());
                }
            });
            
            // Verificar que no haya duplicados en los cursos
            long uniqueCourses = inscription.getDetails().stream()
                    .map(detail -> detail.getIdCourse())
                    .distinct()
                    .count();
            if (uniqueCourses != inscription.getDetails().size()) {
                logger.warning("Cursos duplicados en la inscripción");
                throw new DuplicateDataException("La inscripción contiene cursos duplicados");
            }
            
            // Verificar si ya existe una inscripción para este estudiante en la misma fecha
            if (service.existsByIdStudentAndDate(inscription.getIdStudent(), inscription.getDate())) {
                logger.warning("Ya existe inscripción para estudiante " + 
                             inscription.getIdStudent() + " en fecha " + inscription.getDate());
                throw new DuplicateDataException(
                    "Ya existe una inscripción para este estudiante en la fecha especificada");
            }
            
            logger.info("Validaciones superadas, guardando inscripción");
            InscriptionDTO saved = service.create(inscription);
            logger.info("Inscripción guardada exitosamente: " + saved.getIdInscription());
            
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (ResourceNotFoundException | BusinessRuleException | DuplicateDataException e) {
            logger.warning("Error de validación: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            logger.severe("Error inesperado al procesar inscripción: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error al procesar la inscripción: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @Valid @RequestBody InscriptionDTO inscription) {
        try {
            logger.info("Recibida petición para actualizar inscripción: " + id);
            
            // Verificar si existe la inscripción
            if (!service.existsById(id)) {
                logger.warning("Inscripción no encontrada: " + id);
                throw new ResourceNotFoundException("Inscripción", "id", id);
            }
            
            // Verificar si el estudiante existe
            if (!studentService.existsById(inscription.getIdStudent())) {
                logger.warning("Estudiante no encontrado: " + inscription.getIdStudent());
                throw new ResourceNotFoundException("Estudiante", "id", inscription.getIdStudent());
            }
            
            // Verificar que existe el curso principal
            if (inscription.getIdCourse() != null && !courseService.existsById(inscription.getIdCourse())) {
                logger.warning("Curso principal no encontrado: " + inscription.getIdCourse());
                throw new ResourceNotFoundException("Curso principal", "id", inscription.getIdCourse());
            }
            
            // Verificar que la inscripción tenga al menos un detalle
            if (inscription.getDetails() == null || inscription.getDetails().isEmpty()) {
                logger.warning("Inscripción sin detalles");
                throw new BusinessRuleException("La inscripción debe incluir al menos un curso");
            }
            
            // Verificar que los cursos existan
            inscription.getDetails().forEach(detail -> {
                if (!courseService.existsById(detail.getIdCourse())) {
                    logger.warning("Curso de detalle no encontrado: " + detail.getIdCourse());
                    throw new ResourceNotFoundException("Curso", "id", detail.getIdCourse());
                }
            });
            
            // Verificar que no haya duplicados en los cursos
            long uniqueCourses = inscription.getDetails().stream()
                    .map(detail -> detail.getIdCourse())
                    .distinct()
                    .count();
            if (uniqueCourses != inscription.getDetails().size()) {
                logger.warning("Cursos duplicados en la inscripción");
                throw new DuplicateDataException("La inscripción contiene cursos duplicados");
            }
            
            // Verificar si ya existe otra inscripción para este estudiante en la misma fecha
            if (service.existsByIdStudentAndDateAndIdInscriptionNot(
                    inscription.getIdStudent(), inscription.getDate(), id)) {
                logger.warning("Ya existe otra inscripción para estudiante " + 
                             inscription.getIdStudent() + " en fecha " + inscription.getDate());
                throw new DuplicateDataException(
                    "Ya existe otra inscripción para este estudiante en la fecha especificada");
            }
            
            logger.info("Validaciones superadas, actualizando inscripción");
            Optional<InscriptionDTO> updated = service.update(id, inscription);
            
            if (updated.isPresent()) {
                logger.info("Inscripción actualizada exitosamente: " + id);
                return ResponseEntity.ok(updated.get());
            } else {
                logger.warning("No se encontró la inscripción al intentar actualizar: " + id);
                throw new ResourceNotFoundException("Inscripción", "id", id);
            }
        } catch (ResourceNotFoundException | BusinessRuleException | DuplicateDataException e) {
            logger.warning("Error de validación: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            logger.severe("Error inesperado al actualizar inscripción: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error al actualizar la inscripción: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            logger.info("Recibida petición para eliminar inscripción: " + id);
            
            if (!service.existsById(id)) {
                logger.warning("Inscripción no encontrada: " + id);
                throw new ResourceNotFoundException("Inscripción", "id", id);
            }
            
            service.deleteById(id);
            logger.info("Inscripción eliminada exitosamente: " + id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            logger.warning("Error de validación: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            logger.severe("Error inesperado al eliminar inscripción: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Error al eliminar la inscripción: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}