package com.autoflow.repository;

import com.autoflow.entity.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkflowRepository extends JpaRepository<Workflow, Long> {
    List<Workflow> findAllByOrderByCreatedAtDesc();
    java.util.Optional<Workflow> findByN8nWorkflowId(String n8nWorkflowId);
    java.util.Optional<Workflow> findByName(String name);
}
