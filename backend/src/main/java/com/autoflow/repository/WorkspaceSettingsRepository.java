package com.autoflow.repository;

import com.autoflow.entity.WorkspaceSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceSettingsRepository extends JpaRepository<WorkspaceSettings, Long> {
}
