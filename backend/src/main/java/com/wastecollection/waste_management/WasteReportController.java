
package com.wastecollection.waste_management;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class WasteReportController {

    private final JdbcTemplate jdbcTemplate;

    public WasteReportController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Submit a new waste report
    @PostMapping
    public String createReport(@RequestBody Map<String, Object> report) {

        String sql = """
            INSERT INTO waste_reports
            (user_id, category_id, location, description, image_path)
            VALUES (?, ?, ?, ?, ?)
            """;

        jdbcTemplate.update(
            sql,
            report.get("user_id"),
            report.get("category_id"),
            report.get("location"),
            report.get("description"),
            report.get("image_path")
        );

        return "Waste report submitted successfully!";
    }

    // Display all waste reports
    @GetMapping
    public List<Map<String, Object>> getAllReports() {

        return jdbcTemplate.queryForList(
            "SELECT * FROM waste_reports"
        );
    }

    // Search report by ID
    @GetMapping("/{id}")
    public List<Map<String, Object>> getReportById(
            @PathVariable int id) {

        return jdbcTemplate.queryForList(
            "SELECT * FROM waste_reports WHERE report_id = ?", id
        );
    }
}
