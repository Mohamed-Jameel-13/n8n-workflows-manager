package com.autoflow.dto;

public class ApiKeyDto {
    private Long id;
    private String name;
    private String key;
    private String created;
    private String lastUsed;

    public ApiKeyDto() {}

    public ApiKeyDto(Long id, String name, String key, String created, String lastUsed) {
        this.id = id;
        this.name = name;
        this.key = key;
        this.created = created;
        this.lastUsed = lastUsed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getLastUsed() {
        return lastUsed;
    }

    public void setLastUsed(String lastUsed) {
        this.lastUsed = lastUsed;
    }
}
