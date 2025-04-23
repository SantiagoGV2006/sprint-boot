package com.university.crud_basic.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.university.crud_basic.model.InscriptionDTO;
import com.university.crud_basic.model.InscriptionDetailDTO;
import com.university.crud_basic.repository.InscriptionDetailRepository;
import com.university.crud_basic.repository.InscriptionRepository;

@Service
public class InscriptionService {
    
    @Autowired
    private InscriptionRepository repository;
    
    @Autowired
    private InscriptionDetailRepository detailRepository;
    
    public List<InscriptionDTO> findAll() {
        return repository.findAll();
    }
    
    public Optional<InscriptionDTO> findById(Integer id) {
        return repository.findById(id);
    }
    
    @Transactional
    public InscriptionDTO create(InscriptionDTO inscription) {
        // Guardar la inscripción primero
        inscription.setIdInscription(null); // Asegurar que es una nueva entidad
        InscriptionDTO savedInscription = repository.save(inscription);
        
        // Ahora que tenemos el ID de inscripción, asignarlo a los detalles
        if (inscription.getDetails() != null && !inscription.getDetails().isEmpty()) {
            inscription.getDetails().forEach(detail -> {
                detail.setIdInscription(savedInscription.getIdInscription());
                // Si necesitas guardar los detalles aquí, puedes hacerlo
                // detailRepository.save(detail);
            });
        }
        
        return findById(savedInscription.getIdInscription()).orElseThrow();
    }
    @Transactional
    public Optional<InscriptionDTO> update(Integer id, InscriptionDTO inscription) {
        if (!repository.existsById(id)) {
            return Optional.empty();
        }
        
        // Actualizar la inscripción
        inscription.setIdInscription(id);
        InscriptionDTO updatedInscription = repository.save(inscription);
                
        return findById(id);
    }
    
    @Transactional
    public boolean deleteById(Integer id) {
        if (!repository.existsById(id)) {
            return false;
        }
        
        // Eliminar detalles primero
        List<InscriptionDetailDTO> details = detailRepository.findByIdInscription(id);
        detailRepository.deleteAll(details);
        
        // Luego eliminar la inscripción
        repository.deleteById(id);
        return true;
    }
    
    // Nuevos métodos para validación
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