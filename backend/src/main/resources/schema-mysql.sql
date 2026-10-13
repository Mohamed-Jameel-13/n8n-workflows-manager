-- ==========================================================
-- AutoFlow (n8n Workflow Manager) - MySQL Database Schema
-- Database: autoflow_db
-- ==========================================================

CREATE DATABASE IF NOT EXISTS autoflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE autoflow_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Automations Table
CREATE TABLE IF NOT EXISTS automations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ENABLED',
    type VARCHAR(20) NOT NULL DEFAULT 'N8N',
    last_run_time DATETIME,
    last_run_status VARCHAR(20),
    run_count INT NOT NULL DEFAULT 0,
    n8n_workflow_id VARCHAR(100),
    webhook_url VARCHAR(255),
    cron_expression VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Automation Tags Table
CREATE TABLE IF NOT EXISTS automation_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    automation_id BIGINT NOT NULL,
    label VARCHAR(50) NOT NULL,
    variant VARCHAR(20) DEFAULT 'default',
    CONSTRAINT fk_tag_automation FOREIGN KEY (automation_id) REFERENCES automations(id) ON DELETE CASCADE
);

-- 4. Execution Logs Table
CREATE TABLE IF NOT EXISTS execution_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    automation_id BIGINT,
    automation_name VARCHAR(150),
    timestamp DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    message VARCHAR(500),
    duration VARCHAR(50),
    trigger_type VARCHAR(100),
    n8n_execution_id VARCHAR(100),
    payload TEXT,
    CONSTRAINT fk_log_automation FOREIGN KEY (automation_id) REFERENCES automations(id) ON DELETE SET NULL
);

-- 5. Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    steps INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    last_edited DATETIME DEFAULT CURRENT_TIMESTAMP,
    n8n_workflow_id VARCHAR(100),
    definition_json LONGTEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    masked_key VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_used DATETIME,
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);

-- 7. Workspace Settings Table
CREATE TABLE IF NOT EXISTS workspace_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workspace_name VARCHAR(100) DEFAULT 'Acme Corp',
    workspace_slug VARCHAR(50) DEFAULT 'acme',
    plan VARCHAR(20) DEFAULT 'PRO',
    n8n_base_url VARCHAR(255) DEFAULT 'http://localhost:5678',
    n8n_api_key VARCHAR(255) DEFAULT '',
    n8n_webhook_base_url VARCHAR(255) DEFAULT 'http://localhost:5678/webhook'
);
