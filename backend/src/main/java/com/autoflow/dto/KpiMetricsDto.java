package com.autoflow.dto;

public class KpiMetricsDto {
    private long totalAutomations;
    private long enabledAutomations;
    private long runs24h;
    private long failedRuns;

    public KpiMetricsDto() {}

    public KpiMetricsDto(long totalAutomations, long enabledAutomations, long runs24h, long failedRuns) {
        this.totalAutomations = totalAutomations;
        this.enabledAutomations = enabledAutomations;
        this.runs24h = runs24h;
        this.failedRuns = failedRuns;
    }

    public long getTotalAutomations() {
        return totalAutomations;
    }

    public void setTotalAutomations(long totalAutomations) {
        this.totalAutomations = totalAutomations;
    }

    public long getEnabledAutomations() {
        return enabledAutomations;
    }

    public void setEnabledAutomations(long enabledAutomations) {
        this.enabledAutomations = enabledAutomations;
    }

    public long getRuns24h() {
        return runs24h;
    }

    public void setRuns24h(long runs24h) {
        this.runs24h = runs24h;
    }

    public long getFailedRuns() {
        return failedRuns;
    }

    public void setFailedRuns(long failedRuns) {
        this.failedRuns = failedRuns;
    }
}
