
package com.wastecollection.waste_management;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/records")
public class CollectionRecordController {

    private final JdbcTemplate jdbcTemplate;

    public CollectionRecordController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Add a new collection record
    @PostMapping
    @Transactional
    public String addRecord(
            @RequestBody Map<String, Object> record) {

        String sql = """
            INSERT INTO collection_records
            (request_id, staff_id, collected_quantity,
             quantity_unit, remarks)
            VALUES (?, ?, ?, ?, ?)
            """;

        // Step 1: Insert collection record
        jdbcTemplate.update(
            sql,
            record.get("request_id"),
            record.get("staff_id"),
            record.get("collected_quantity"),
            record.getOrDefault("quantity_unit", "kg"),
            record.get("remarks")
        );

        // Step 2: Update request status to Completed
        jdbcTemplate.update(
            "UPDATE collection_requests SET status = 'Completed' WHERE request_id = ?",
            record.get("request_id")
        );

        return "Collection record added and request marked as Completed!";
    }

    // Display all collection records
    @GetMapping
    public List<Map<String, Object>> getAllRecords() {

        return jdbcTemplate.queryForList(
            "SELECT * FROM collection_records"
        );
    }

    // Display a collection record by ID
    @GetMapping("/{id}")
    public List<Map<String, Object>> getRecordById(
            @PathVariable int id) {

        return jdbcTemplate.queryForList(
            "SELECT * FROM collection_records WHERE record_id = ?",
            id
        );
    }
}
