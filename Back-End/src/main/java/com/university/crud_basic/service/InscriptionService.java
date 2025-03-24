package com.university.crud_basic.service;

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
        
        return findById(savedInscription.getIdInscription()).orElseThrow();
    }
    
    @Transactional
    public Optional<InscriptionDTO> update(Integer id, InscriptionDTO inscription) {
        if (!repository.existsById(id)) {
            return Optional.empty();
        }
        
        // Actualizar la inscripción
        inscription.setIdInscription(id);
        @SuppressWarnings("unused")
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
}