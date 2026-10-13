package com.autoflow.service;

import com.autoflow.entity.User;
import com.autoflow.entity.WorkspaceSettings;
import com.autoflow.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AutomationRepository automationRepository;
    private final WorkflowRepository workflowRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;
    private final WorkspaceSettingsRepository workspaceSettingsRepository;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(AutomationRepository automationRepository,
                           WorkflowRepository workflowRepository,
                           ApiKeyRepository apiKeyRepository,
                           UserRepository userRepository,
                           WorkspaceSettingsRepository workspaceSettingsRepository,
                           JdbcTemplate jdbcTemplate) {
        this.automationRepository = automationRepository;
        this.workflowRepository = workflowRepository;
        this.apiKeyRepository = apiKeyRepository;
        this.userRepository = userRepository;
        this.workspaceSettingsRepository = workspaceSettingsRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking database initialization and cleaning mock data...");

        // 1. Ensure columns accommodate long n8n API keys and JWT tokens
        try {
            jdbcTemplate.execute("ALTER TABLE workspace_settings MODIFY COLUMN n8n_api_key TEXT");
            jdbcTemplate.execute("ALTER TABLE workspace_settings MODIFY COLUMN n8n_base_url VARCHAR(500)");
            jdbcTemplate.execute("ALTER TABLE workspace_settings MODIFY COLUMN n8n_webhook_base_url VARCHAR(500)");
            jdbcTemplate.execute("ALTER TABLE automations MODIFY COLUMN webhook_url VARCHAR(500)");
            log.info("Schema columns successfully updated for long API keys and webhook URLs.");
        } catch (Exception e) {
            log.info("Column migration note: {}", e.getMessage());
        }

        // 2. Ensure Default Admin User in MySQL
        if (!userRepository.existsByUsername("admin")) {
            log.info("Creating default admin account in MySQL (username: admin)...");
            userRepository.save(new User("admin", "123", "Admin User", "admin@autoflow.io", "ADMIN"));
        }

        // 3. Ensure Default Workspace Settings in MySQL
        if (workspaceSettingsRepository.count() == 0) {
            log.info("Initializing workspace settings in MySQL...");
            workspaceSettingsRepository.save(new WorkspaceSettings("AutoFlow Workspace", "autoflow", "PRO"));
        }

        // 4. Clean up previously seeded mock automations so the database is clean for real n8n testing
        List<String> mockAutomationNames = List.of(
                "WhatsApp Customer Support",
                "Daily Report Generator",
                "Lead Qualification Workflow",
                "Slack Notification Bot",
                "Database Backup Scheduler",
                "Order Confirmation WhatsApp"
        );
        for (String name : mockAutomationNames) {
            automationRepository.findByName(name).ifPresent(auto -> {
                log.info("Purging mock automation: {}", auto.getName());
                automationRepository.delete(auto);
            });
        }

        // 5. Clean up previously seeded mock workflows
        List<String> mockWorkflowNames = List.of(
                "Lead Qualification to CRM",
                "Weekly Report Generation",
                "Onboarding Sequence"
        );
        for (String wfName : mockWorkflowNames) {
            workflowRepository.findByName(wfName).ifPresent(wf -> {
                log.info("Purging mock workflow: {}", wf.getName());
                workflowRepository.delete(wf);
            });
        }

        // 6. Clean up mock API keys
        apiKeyRepository.findByApiKey("af_live_xk9m2pqr5nvj8tw99a01b").ifPresent(apiKeyRepository::delete);
        apiKeyRepository.findByApiKey("af_dev_3hbz7qye1dlv4sx44z99c").ifPresent(apiKeyRepository::delete);

        log.info("Database cleaned and ready for live n8n workflows and genuine executions.");
    }
}
