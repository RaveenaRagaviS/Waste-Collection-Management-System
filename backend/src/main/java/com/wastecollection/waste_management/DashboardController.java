
package com.wastecollection.waste_management;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final JdbcTemplate jdbcTemplate;

    public DashboardController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Get dashboard statistics
    @GetMapping
    public Map<String, Object> getDashboardData() {

        String sql = """
            SELECT
                (SELECT COUNT(*) FROM users)
                    AS total_users,

                (SELECT COUNT(*) FROM waste_reports)
                    AS total_reports,

                (SELECT COUNT(*) FROM collection_staff)
                    AS total_staff,

                (SELECT COUNT(*) FROM collection_requests)
                    AS total_requests,

                (SELECT COUNT(*) FROM collection_requests
                    WHERE status = 'Pending')
                    AS pending_requests,

                (SELECT COUNT(*) FROM collection_requests
                    WHERE status = 'Completed')
                    AS completed_requests,

                (SELECT COALESCE(SUM(collected_quantity), 0)
                    FROM collection_records)
                    AS total_waste_collected
            """;

        return jdbcTemplate.queryForMap(sql);
    }
}
