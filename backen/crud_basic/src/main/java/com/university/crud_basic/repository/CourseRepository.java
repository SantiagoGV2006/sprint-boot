package com.university.crud_basic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.crud_basic.model.CourseDTO;

@Repository
public interface CourseRepository extends JpaRepository<CourseDTO, Integer> {
}