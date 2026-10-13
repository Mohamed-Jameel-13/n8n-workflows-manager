package com.autoflow.entity;

public enum AutomationStatus {
    ENABLED,
    DISABLED;

    public String toLowerCase() {
        return name().toLowerCase();
    }

    public static AutomationStatus fromString(String val) {
        if (val == null) return DISABLED;
        return val.trim().equalsIgnoreCase("enabled") ? ENABLED : DISABLED;
    }
}
