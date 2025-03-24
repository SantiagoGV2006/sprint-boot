package com.university.crud_basic.repository;

import com.university.crud_basic.model.InscriptionDetailDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InscriptionDetailRepository extends JpaRepository<InscriptionDetailDTO, Integer> {
    List<InscriptionDetailDTO> findByIdInscription(Integer idInscription);
    List<InscriptionDetailDTO> findByIdInscriptionAndIdCourse(Integer idInscription, Integer idCourse);
}