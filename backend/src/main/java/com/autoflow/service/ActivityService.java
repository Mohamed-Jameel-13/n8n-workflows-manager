package com.autoflow.service;

import com.autoflow.dto.LogDto;
import com.autoflow.entity.ExecutionLog;
import com.autoflow.repository.ExecutionLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ExecutionLogRepository executionLogRepository;
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");
    private static final DateTimeFormatter CSV_DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ActivityService(ExecutionLogRepository executionLogRepository) {
        this.executionLogRepository = executionLogRepository;
    }

    @Transactional(readOnly = true)
    public List<LogDto> getAllActivities() {
        return executionLogRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public String exportCsv() {
        List<ExecutionLog> logs = executionLogRepository.findAllByOrderByTimestampDesc();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Automation,Trigger,Duration,Timestamp,Status,Message\n");
        for (ExecutionLog log : logs) {
            csv.append(log.getId()).append(",")
               .append("\"").append(escapeCsv(log.getAutomationName())).append("\",")
               .append("\"").append(escapeCsv(log.getTrigger())).append("\",")
               .append(log.getDuration()).append(",")
               .append(log.getTimestamp().format(CSV_DATETIME_FORMATTER)).append(",")
               .append(log.getStatus().toLowerCase()).append(",")
               .append("\"").append(escapeCsv(log.getMessage())).append("\"\n");
        }
        return csv.toString();
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

    private String escapeCsv(String str) {
        if (str == null) return "";
        return str.replace("\"", "\"\"");
    }
}
