package com.autoflow.entity;

public enum WorkflowStatus {
    ACTIVE,
    PAUSED;

    public String getDisplay() {
        return this == ACTIVE ? "Active" : "Paused";
    }

    public static WorkflowStatus fromString(String val) {
        if (val == null) return ACTIVE;
        return val.trim().equalsIgnoreCase("paused") ? PAUSED : ACTIVE;
    }
}
