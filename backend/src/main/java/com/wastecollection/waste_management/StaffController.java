
package com.wastecollection.waste_management;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final JdbcTemplate jdbcTemplate;

    public StaffController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Add new collection staff
    @PostMapping
    public String addStaff(@RequestBody Map<String, String> staff) {

        String sql = """
            INSERT INTO collection_staff
            (staff_name, phone, assigned_area)
            VALUES (?, ?, ?)
            """;

        jdbcTemplate.update(
            sql,
            staff.get("staff_name"),
            staff.get("phone"),
            staff.get("assigned_area")
        );

        return "Collection staff added successfully!";
    }

    // Display all collection staff
    @GetMapping
    public List<Map<String, Object>> getAllStaff() {
        return jdbcTemplate.queryForList(
            "SELECT * FROM collection_staff"
        );
    }

    // Display staff by ID
    @GetMapping("/{id}")
    public List<Map<String, Object>> getStaffById(
            @PathVariable int id) {

        return jdbcTemplate.queryForList(
            "SELECT * FROM collection_staff WHERE staff_id = ?", id
        );
    }

    // Update staff availability
    @PutMapping("/{id}/availability")
    public String updateStaffAvailability(
            @PathVariable int id,
            @RequestBody Map<String, String> request) {

        String availability = request.get("availability");

        if (!List.of("Available", "Unavailable").contains(availability)) {
            throw new IllegalArgumentException(
                "Invalid availability status"
            );
        }

        int rows = jdbcTemplate.update(
            "UPDATE collection_staff SET availability = ? WHERE staff_id = ?",
            availability,
            id
        );

        if (rows == 0) {
            return "Staff member not found!";
        }

        return "Staff availability updated successfully!";
    }
}
