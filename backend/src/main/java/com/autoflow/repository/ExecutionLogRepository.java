package com.autoflow.repository;

import com.autoflow.entity.ExecutionLog;
import com.autoflow.entity.RunStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ExecutionLogRepository extends JpaRepository<ExecutionLog, Long> {
    List<ExecutionLog> findAllByOrderByTimestampDesc();
    List<ExecutionLog> findTop10ByOrderByTimestampDesc();
    List<ExecutionLog> findByAutomationIdOrderByTimestampDesc(Long automationId);

    long countByTimestampAfter(LocalDateTime after);
    long countByStatusAndTimestampAfter(RunStatus status, LocalDateTime after);

    @Query("SELECT COUNT(e) FROM ExecutionLog e WHERE e.timestamp >= :startTime AND e.timestamp < :endTime")
    long countRunsBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
}
