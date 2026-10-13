package com.autoflow.entity;

public enum AutomationType {
    WHATSAPP,
    N8N,
    CRON;

    public String toLowerCase() {
        return name().toLowerCase();
    }

    public static AutomationType fromString(String val) {
        if (val == null) return N8N;
        return switch (val.trim().toLowerCase()) {
            case "whatsapp" -> WHATSAPP;
            case "cron" -> CRON;
            default -> N8N;
        };
    }
}
