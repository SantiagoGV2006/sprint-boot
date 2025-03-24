package com.university.crud_basic.repository;

import com.university.crud_basic.model.InscriptionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InscriptionRepository extends JpaRepository<InscriptionDTO, Integer> {
}