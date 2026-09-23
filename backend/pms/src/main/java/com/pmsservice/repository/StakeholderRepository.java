package com.pmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pmsservice.entity.StakeholderInfo;
import com.pmsservice.enums.StakeholderType;

@Repository
public interface StakeholderRepository extends JpaRepository<StakeholderInfo, Integer> {

    List<StakeholderInfo> findByStakeholderCategory(
            StakeholderType stakeholderType);

}