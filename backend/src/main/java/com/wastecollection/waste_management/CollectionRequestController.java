
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
@RequestMapping("/api/requests")
public class CollectionRequestController {

    private final JdbcTemplate jdbcTemplate;

    public CollectionRequestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Create a new collection request
    @PostMapping
    public String createRequest(
            @RequestBody Map<String, Object> request) {

        String sql = """
            INSERT INTO collection_requests
            (user_id, category_id, staff_id,
             pickup_location, scheduled_date)
            VALUES (?, ?, ?, ?, ?)
            """;

        jdbcTemplate.update(
            sql,
            request.get("user_id"),
            request.get("category_id"),
            request.get("staff_id"),
            request.get("pickup_location"),
            request.get("scheduled_date")
        );

        return "Collection request created successfully!";
    }

    // Display all collection requests
    @GetMapping
    public List<Map<String, Object>> getAllRequests() {

        return jdbcTemplate.queryForList(
            "SELECT * FROM collection_requests"
        );
    }

    // Display a request using its ID
    @GetMapping("/{id}")
    public List<Map<String, Object>> getRequestById(
            @PathVariable int id) {

        return jdbcTemplate.queryForList(
            "SELECT * FROM collection_requests WHERE request_id = ?",
            id
        );
    }

    // Update collection request status
    @PutMapping("/{id}/status")
    public String updateRequestStatus(
            @PathVariable int id,
            @RequestBody Map<String, String> request) {

        String status = request.get("status");

        // Allow only valid statuses
        if (!List.of("Pending", "Approved", "Completed")
                .contains(status)) {

            throw new IllegalArgumentException(
                "Invalid request status"
            );
        }

        // Completion happens through the collection record API
        if ("Completed".equals(status)) {

            throw new IllegalArgumentException(
                "Complete a request by recording its waste collection."
            );
        }

        int rows = jdbcTemplate.update(
            "UPDATE collection_requests SET status = ? WHERE request_id = ?",
            status,
            id
        );

        if (rows == 0) {
            return "Collection request not found!";
        }

        return "Collection request status updated successfully!";
    }
    // Assign or reassign collection staff
@PutMapping("/{id}/assign-staff")
public String assignStaff(
        @PathVariable int id,
        @RequestBody Map<String, Integer> request) {

    Integer staffId = request.get("staff_id");

    if (staffId == null) {
        throw new IllegalArgumentException("Staff ID is required");
    }

    // Check whether the staff member exists
    Integer staffExists = jdbcTemplate.queryForObject(
        "SELECT COUNT(*) FROM collection_staff WHERE staff_id = ?",
        Integer.class,
        staffId
    );

    if (staffExists == null || staffExists == 0) {
        throw new IllegalArgumentException("Staff member not found");
    }

    // Update the assigned staff member
    int rows = jdbcTemplate.update(
        "UPDATE collection_requests SET staff_id = ? WHERE request_id = ?",
        staffId,
        id
    );

    if (rows == 0) {
        return "Collection request not found!";
    }

    return "Staff assigned successfully!";
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
