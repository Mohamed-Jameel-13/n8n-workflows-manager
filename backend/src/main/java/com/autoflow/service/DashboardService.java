package com.autoflow.service;

import com.autoflow.dto.DailyChartDto;
import com.autoflow.dto.KpiMetricsDto;
import com.autoflow.dto.LogDto;
import com.autoflow.entity.AutomationStatus;
import com.autoflow.entity.ExecutionLog;
import com.autoflow.entity.RunStatus;
import com.autoflow.repository.AutomationRepository;
import com.autoflow.repository.ExecutionLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AutomationRepository automationRepository;
    private final ExecutionLogRepository executionLogRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");

    public DashboardService(AutomationRepository automationRepository,
                            ExecutionLogRepository executionLogRepository) {
        this.automationRepository = automationRepository;
        this.executionLogRepository = executionLogRepository;
    }

    @Transactional(readOnly = true)
    public KpiMetricsDto getKpiMetrics() {
        LocalDateTime last24h = LocalDateTime.now().minusHours(24);
        long total = automationRepository.count();
        long enabled = automationRepository.countByStatus(AutomationStatus.ENABLED);
        long runs24h = executionLogRepository.countByTimestampAfter(last24h);
        long failedRuns = executionLogRepository.countByStatusAndTimestampAfter(RunStatus.FAILED, last24h);

        return new KpiMetricsDto(total, enabled, runs24h, failedRuns);
    }

    @Transactional(readOnly = true)
    public List<DailyChartDto> getWeeklyChartData() {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        List<DailyChartDto> chart = new ArrayList<>();

        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

        for (int i = 0; i < 7; i++) {
            LocalDate date = monday.plusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
            long count = executionLogRepository.countRunsBetween(startOfDay, endOfDay);
            chart.add(new DailyChartDto(days[i], count));
        }

        return chart;
    }

    @Transactional(readOnly = true)
    public List<LogDto> getRecentActivities() {
        return executionLogRepository.findTop10ByOrderByTimestampDesc()
                .stream()
                .limit(5)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private LogDto toDto(ExecutionLog l) {
        String displayTime = formatDisplayTime(l.getTimestamp());
        return new LogDto(
                l.getId(),
                displayTime,
                l.getStatus().toLowerCase(),
                l.getMessage(),
                l.getDuration(),
                l.getTrigger(),
                l.getAutomationName()
        );
    }

    private String formatDisplayTime(LocalDateTime time) {
        if (time == null) return "Unknown";
        LocalDateTime now = LocalDateTime.now();
        if (time.toLocalDate().isEqual(now.toLocalDate())) {
            return time.format(TIME_FORMATTER);
        } else if (time.toLocalDate().isEqual(now.toLocalDate().minusDays(1))) {
            return "Yesterday";
        } else {
            return time.format(DateTimeFormatter.ofPattern("MMM dd"));
        }
    }
}
