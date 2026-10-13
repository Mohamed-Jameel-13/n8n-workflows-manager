package com.autoflow.dto;

public class LastRunDto {
    private String time;
    private String status;

    public LastRunDto() {}

    public LastRunDto(String time, String status) {
        this.time = time;
        this.status = status;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
