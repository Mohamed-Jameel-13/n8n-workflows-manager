package com.autoflow.controller;

import com.autoflow.dto.*;
import com.autoflow.service.AutomationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/automations")
public class AutomationController {

    private final AutomationService automationService;

    public AutomationController(AutomationService automationService) {
        this.automationService = automationService;
    }

    @GetMapping
    public ResponseEntity<List<AutomationDto>> getAutomations(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String query) {
        List<AutomationDto> list = automationService.getAllAutomations(type, query);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AutomationDto> getAutomationById(@PathVariable Long id) {
        return automationService.getAutomationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AutomationDto> createAutomation(@RequestBody CreateAutomationRequest request) {
        AutomationDto created = automationService.createAutomation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AutomationDto> updateAutomation(
            @PathVariable Long id,
            @RequestBody UpdateAutomationRequest request) {
        return automationService.updateAutomation(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<AutomationDto> toggleStatus(@PathVariable Long id) {
        return automationService.toggleStatus(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<RunAutomationResponse> runAutomation(@PathVariable Long id) {
        return automationService.runAutomation(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAutomation(@PathVariable Long id) {
        boolean deleted = automationService.deleteAutomation(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Automation deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
