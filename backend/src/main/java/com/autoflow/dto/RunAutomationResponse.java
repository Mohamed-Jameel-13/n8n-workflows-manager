package com.autoflow.dto;

public class RunAutomationResponse {
    private boolean success;
    private String message;
    private String duration;
    private String timestamp;
    private String n8nExecutionId;
    private LogDto executionLog;

    public RunAutomationResponse() {}

    public RunAutomationResponse(boolean success, String message, String duration, String timestamp, String n8nExecutionId, LogDto executionLog) {
        this.success = success;
        this.message = message;
        this.duration = duration;
        this.timestamp = timestamp;
        this.n8nExecutionId = n8nExecutionId;
        this.executionLog = executionLog;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getN8nExecutionId() {
        return n8nExecutionId;
    }

    public void setN8nExecutionId(String n8nExecutionId) {
        this.n8nExecutionId = n8nExecutionId;
    }

    public LogDto getExecutionLog() {
        return executionLog;
    }

    public void setExecutionLog(LogDto executionLog) {
        this.executionLog = executionLog;
    }
}
