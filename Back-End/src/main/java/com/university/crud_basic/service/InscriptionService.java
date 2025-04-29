package com.university.crud_basic.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.crud_basic.model.InscriptionDTO;
import com.university.crud_basic.model.InscriptionDetailDTO;
import com.university.crud_basic.repository.InscriptionDetailRepository;
import com.university.crud_basic.repository.InscriptionRepository;

@Service
public class InscriptionService {
    
    private static final Logger logger = Logger.getLogger(InscriptionService.class.getName());
    
    @Autowired
    private InscriptionRepository repository;
    
    @Autowired
    private InscriptionDetailRepository detailRepository;
    
    // Método actualizado para manejar errores
public List<InscriptionDTO> findAll() {
    try {
        logger.info("Obteniendo lista de inscripciones");
        List<InscriptionDTO> inscriptions = repository.findAll();
        logger.info("Se encontraron " + inscriptions.size() + " inscripciones");
        return inscriptions;
    } catch (Exception e) {
        logger.severe("Error al obtener lista de inscripciones: " + e.getMessage());
        e.printStackTrace();
        // Retornar una lista vacía en lugar de propagar el error
        return new ArrayList<>();
    }
}
    
    public Optional<InscriptionDTO> findById(Integer id) {
        try {
            return repository.findById(id);
        } catch (Exception e) {
            logger.severe("Error al obtener inscripción con ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return Optional.empty();
        }
    }
    
    @Transactional
    public InscriptionDTO create(InscriptionDTO inscription) {
        try {
            // Registrar datos para debugging
            logger.info("Creando inscripción: " + inscription.getIdStudent() + 
                      ", Fecha: " + inscription.getDate() + 
                      ", Detalles: " + (inscription.getDetails() != null ? inscription.getDetails().size() : 0));
            
            // Guardar temporalmente los detalles
            List<InscriptionDetailDTO> details = inscription.getDetails();
            
            // Limpiar los detalles para guardar primero la inscripción
            inscription.setDetails(null);
            
            // Asegurar que es una nueva entidad
            inscription.setIdInscription(null);
            
            // Guardar la inscripción primero
            InscriptionDTO savedInscription = repository.save(inscription);
            logger.info("Inscripción guardada con ID: " + savedInscription.getIdInscription());
            
            // Procesar detalles si existen
            if (details != null && !details.isEmpty()) {
                logger.info("Procesando " + details.size() + " detalles");
                
                for (InscriptionDetailDTO detail : details) {
                    // Asignar el ID de inscripción a cada detalle
                    detail.setIdInscription(savedInscription.getIdInscription());
                    detail.setId(null); // Asegurar que se crea como nuevo
                    
                    // Guardar cada detalle
                    InscriptionDetailDTO savedDetail = detailRepository.save(detail);
                    logger.info("Detalle guardado con ID: " + savedDetail.getId() + 
                              ", Curso: " + savedDetail.getIdCourse());
                }
            } else {
                logger.warning("No se recibieron detalles para la inscripción");
            }
            
            // Recargar la inscripción con todos sus detalles
            return repository.findById(savedInscription.getIdInscription())
                   .orElseThrow(() -> new RuntimeException("Error al recuperar la inscripción guardada"));
                   
        } catch (Exception e) {
            logger.severe("Error al crear inscripción: " + e.getMessage());
            e.printStackTrace(); // Para obtener más detalles del error
            throw new RuntimeException("Error al crear inscripción: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public Optional<InscriptionDTO> update(Integer id, InscriptionDTO inscription) {
        try {
            if (!repository.existsById(id)) {
                return Optional.empty();
            }
            
            // Guardar temporalmente los detalles
            List<InscriptionDetailDTO> newDetails = inscription.getDetails();
            
            // Asignar el ID correcto
            inscription.setIdInscription(id);
            inscription.setDetails(null);
            
            // Guardar la inscripción actualizada
            InscriptionDTO updatedInscription = repository.save(inscription);
            
            // Eliminar todos los detalles existentes
            List<InscriptionDetailDTO> existingDetails = detailRepository.findByIdInscription(id);
            if (!existingDetails.isEmpty()) {
                detailRepository.deleteAll(existingDetails);
                logger.info("Eliminados " + existingDetails.size() + " detalles existentes");
            }
            
            // Crear nuevos detalles
            if (newDetails != null && !newDetails.isEmpty()) {
                for (InscriptionDetailDTO detail : newDetails) {
                    detail.setIdInscription(id);
                    detail.setId(null); // Asegurar que se crea como nuevo
                    detailRepository.save(detail);
                }
                logger.info("Guardados " + newDetails.size() + " nuevos detalles");
            }
            
            // Recargar la inscripción con todos sus detalles
            return repository.findById(id);
        } catch (Exception e) {
            logger.severe("Error al actualizar inscripción: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar inscripción: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public boolean deleteById(Integer id) {
        try {
            if (!repository.existsById(id)) {
                return false;
            }
            
            // Eliminar detalles primero
            List<InscriptionDetailDTO> details = detailRepository.findByIdInscription(id);
            detailRepository.deleteAll(details);
            logger.info("Eliminados " + details.size() + " detalles asociados a inscripción " + id);
            
            // Luego eliminar la inscripción
            repository.deleteById(id);
            logger.info("Eliminada inscripción con ID: " + id);
            return true;
        } catch (Exception e) {
            logger.severe("Error al eliminar inscripción: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error al eliminar inscripción: " + e.getMessage(), e);
        }
    }
    
    // Métodos para validación
    public boolean existsById(Integer id) {
        return repository.existsById(id);
    }
    
    public boolean existsByIdStudentAndDate(Integer idStudent, LocalDate date) {
        return repository.existsByIdStudentAndDate(idStudent, date);
    }
    
    public boolean existsByIdStudentAndDateAndIdInscriptionNot(Integer idStudent, LocalDate date, Integer idInscription) {
        return repository.existsByIdStudentAndDateAndIdInscriptionNot(idStudent, date, idInscription);
    }
}