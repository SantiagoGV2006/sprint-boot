package com.university.crud_basic.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.university.crud_basic.model.StudentDTO;
import com.university.crud_basic.repository.StudentRepository;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository repository;
    
    public List<StudentDTO> findAll() {
        return repository.findAll();
    }
    
    public Optional<StudentDTO> findById(Integer id) {
        return repository.findById(id);
    }
    
    public StudentDTO create(StudentDTO student) {
        student.setIdStudent(null); // Asegurar que es una nueva entidad
        return repository.save(student);
    }
    
    public Optional<StudentDTO> update(Integer id, StudentDTO student) {
        if (!repository.existsById(id)) {
            return Optional.empty();
        }
        
        student.setIdStudent(id);
        return Optional.of(repository.save(student));
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
    
    public boolean existsByEmailAndIdStudentNot(String email, Integer idStudent) {
        return repository.existsByEmailAndIdStudentNot(email, idStudent);
    }
}