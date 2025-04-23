package com.university.crud_basic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.university.crud_basic.model.InscriptionDetailDTO;

@Repository
public interface InscriptionDetailRepository extends JpaRepository<InscriptionDetailDTO, Integer> {
    List<InscriptionDetailDTO> findByIdInscription(Integer idInscription);
    List<InscriptionDetailDTO> findByIdInscriptionAndIdCourse(Integer idInscription, Integer idCourse);
    
    // Verifica si existe un detalle para la inscripción y curso especificados
    boolean existsByIdInscriptionAndIdCourse(Integer idInscription, Integer idCourse);
}