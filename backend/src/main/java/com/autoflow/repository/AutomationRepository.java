package com.autoflow.repository;

import com.autoflow.entity.Automation;
import com.autoflow.entity.AutomationStatus;
import com.autoflow.entity.AutomationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AutomationRepository extends JpaRepository<Automation, Long> {
    List<Automation> findByType(AutomationType type);
    long countByStatus(AutomationStatus status);
    java.util.Optional<Automation> findByName(String name);
    java.util.Optional<Automation> findByN8nWorkflowId(String n8nWorkflowId);

    @Query("SELECT a FROM Automation a WHERE " +
           "(:type IS NULL OR a.type = :type) AND " +
           "(:query IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Automation> searchAutomations(@Param("type") AutomationType type, @Param("query") String query);
}
