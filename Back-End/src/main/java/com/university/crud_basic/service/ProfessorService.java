package com.university.crud_basic.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.university.crud_basic.model.ProfessorDTO;
import com.university.crud_basic.repository.ProfessorRepository;

@Service
public class ProfessorService {
    
    @Autowired
    private ProfessorRepository repository;
    
    public List<ProfessorDTO> findAll() {
        return repository.findAll();
    }
    
    public Optional<ProfessorDTO> findById(Integer id) {
        return repository.findById(id);
    }
    
    public ProfessorDTO create(ProfessorDTO professor) {
        professor.setIdProfessor(null); // Asegurar que es una nueva entidad
        return repository.save(professor);
    }
    
    public Optional<ProfessorDTO> update(Integer id, ProfessorDTO professor) {
        if (!repository.existsById(id)) {
            return Optional.empty();
        }
        
        professor.setIdProfessor(id);
        return Optional.of(repository.save(professor));
    }
    
    public boolean deleteById(Integer id) {
        if (!repository.existsById(id)) {
            return false;
        }
        
        repository.deleteById(id);
        return true;
    }
    
    // Nuevos métodos para validación
    public boolean existsById(Integer id) {
        return repository.existsById(id);
    }
    
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }
    
    public boolean existsByEmailAndIdProfessorNot(String email, Integer idProfessor) {
        return repository.existsByEmailAndIdProfessorNot(email, idProfessor);
    }
}