package com.autoflow.controller;

import com.autoflow.dto.CreateWorkflowRequest;
import com.autoflow.dto.WorkflowDto;
import com.autoflow.service.WorkflowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping
    public ResponseEntity<List<WorkflowDto>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.getAllWorkflows());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowDto> getWorkflowById(@PathVariable Long id) {
        return workflowService.getWorkflowById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WorkflowDto> createWorkflow(@RequestBody CreateWorkflowRequest request) {
        WorkflowDto created = workflowService.createWorkflow(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<WorkflowDto> toggleStatus(@PathVariable Long id) {
        return workflowService.toggleWorkflowStatus(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkflow(@PathVariable Long id) {
        boolean deleted = workflowService.deleteWorkflow(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Workflow deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
