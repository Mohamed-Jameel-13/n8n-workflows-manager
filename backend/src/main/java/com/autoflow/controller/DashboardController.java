package com.autoflow.controller;

import com.autoflow.dto.DailyChartDto;
import com.autoflow.dto.KpiMetricsDto;
import com.autoflow.dto.LogDto;
import com.autoflow.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/kpi")
    public ResponseEntity<KpiMetricsDto> getKpiMetrics() {
        return ResponseEntity.ok(dashboardService.getKpiMetrics());
    }

    @GetMapping("/chart")
    public ResponseEntity<List<DailyChartDto>> getWeeklyChart() {
        return ResponseEntity.ok(dashboardService.getWeeklyChartData());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<LogDto>> getRecentActivities() {
        return ResponseEntity.ok(dashboardService.getRecentActivities());
    }
}
