package com.university.crud_basic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.crud_basic.model.StudentDTO;

@Repository
public interface StudentRepository extends JpaRepository<StudentDTO, Integer> {
}