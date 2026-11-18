
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
@RequestMapping("/api/users")
public class UserController {

    private final JdbcTemplate jdbcTemplate;

    public UserController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Register a new user
    @PostMapping
    public String registerUser(@RequestBody Map<String, String> user) {

        String sql = """
            INSERT INTO users (name, email, phone, address, role)
            VALUES (?, ?, ?, ?, ?)
            """;

        jdbcTemplate.update(
            sql,
            user.get("name"),
            user.get("email"),
            user.get("phone"),
            user.get("address"),
            user.getOrDefault("role", "citizen")
        );

        return "User registered successfully!";
    }

    // Display all users
    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return jdbcTemplate.queryForList(
            "SELECT * FROM users"
        );
    }

    // Search user by ID
    @GetMapping("/{id}")
    public List<Map<String, Object>> getUserById(
            @PathVariable int id) {

        return jdbcTemplate.queryForList(
            "SELECT * FROM users WHERE user_id = ?", id
        );
    }
}
