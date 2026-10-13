package com.autoflow.entity;

public enum RunStatus {
    SUCCESS,
    FAILED,
    PENDING,
    RUNNING;

    public String toLowerCase() {
        return name().toLowerCase();
    }

    public static RunStatus fromString(String val) {
        if (val == null) return SUCCESS;
        return switch (val.trim().toLowerCase()) {
            case "failed" -> FAILED;
            case "pending" -> PENDING;
            case "running" -> RUNNING;
            default -> SUCCESS;
        };
    }
}
