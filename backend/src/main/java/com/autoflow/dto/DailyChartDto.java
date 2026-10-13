package com.autoflow.dto;

public class DailyChartDto {
    private String day;
    private long runs;

    public DailyChartDto() {}

    public DailyChartDto(String day, long runs) {
        this.day = day;
        this.runs = runs;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public long getRuns() {
        return runs;
    }

    public void setRuns(long runs) {
        this.runs = runs;
    }
}
