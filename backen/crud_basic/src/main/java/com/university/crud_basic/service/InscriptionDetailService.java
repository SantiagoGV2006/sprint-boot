package com.university.crud_basic.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.university.crud_basic.model.InscriptionDetailDTO;
import com.university.crud_basic.repository.InscriptionDetailRepository;

@Service
public class InscriptionDetailService {
    
    @Autowired
    private InscriptionDetailRepository repository;
    
    public List<InscriptionDetailDTO> findAll() {
        return repository.findAll();
    }
    
    public List<InscriptionDetailDTO> findByInscriptionId(Integer idInscription) {
        return repository.findByIdInscription(idInscription);
    }
    
    public List<InscriptionDetailDTO> findByInscriptionAndCourse(Integer idInscription, Integer idCourse) {
        return repository.findByIdInscriptionAndIdCourse(idInscription, idCourse);
    }
    
    public InscriptionDetailDTO create(InscriptionDetailDTO detail) {
        return repository.save(detail);
    }
    
    public Optional<InscriptionDetailDTO> update(Integer id, InscriptionDetailDTO detail) {
        if (!repository.existsById(id)) {
            return Optional.empty();
        }
        
        detail.setId(id);
        return Optional.of(repository.save(detail));
    }
    
    public boolean deleteById(Integer id) {
        if (!repository.existsById(id)) {
            return false;
        }
        
        repository.deleteById(id);
        return true;
    }
    
    public boolean deleteByInscriptionAndCourse(Integer idInscription, Integer idCourse) {
        List<InscriptionDetailDTO> details = repository.findByIdInscriptionAndIdCourse(idInscription, idCourse);
        if (details.isEmpty()) {
            return false;
        }
        
        repository.deleteAll(details);
        return true;
    }

    public Optional<InscriptionDetailDTO> findById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }
}