package com.autoflow.repository;

import com.autoflow.entity.AutomationTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomationTagRepository extends JpaRepository<AutomationTag, Long> {
}
