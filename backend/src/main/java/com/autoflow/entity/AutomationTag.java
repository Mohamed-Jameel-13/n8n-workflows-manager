package com.autoflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "automation_tags")
public class AutomationTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String label;

    @Column(length = 20)
    private String variant; // 'default', 'blue', 'green', 'purple'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "automation_id")
    @JsonBackReference
    private Automation automation;

    public AutomationTag() {
        this.variant = "default";
    }

    public AutomationTag(String label, String variant) {
        this.label = label;
        this.variant = variant != null ? variant : "default";
    }

    public AutomationTag(String label, String variant, Automation automation) {
        this.label = label;
        this.variant = variant != null ? variant : "default";
        this.automation = automation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Automation getAutomation() {
        return automation;
    }

    public void setAutomation(Automation automation) {
        this.automation = automation;
    }
}
