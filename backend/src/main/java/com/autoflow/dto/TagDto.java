package com.autoflow.dto;

public class TagDto {
    private String label;
    private String variant;

    public TagDto() {
        this.variant = "default";
    }

    public TagDto(String label, String variant) {
        this.label = label;
        this.variant = variant != null ? variant : "default";
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getVariant() {
        return variant;
    }

    public void setVariant(String variant) {
        this.variant = variant;
    }
}
