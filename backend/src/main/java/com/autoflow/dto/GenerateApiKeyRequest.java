package com.autoflow.dto;

public class GenerateApiKeyRequest {
    private String name;

    public GenerateApiKeyRequest() {}

    public GenerateApiKeyRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
