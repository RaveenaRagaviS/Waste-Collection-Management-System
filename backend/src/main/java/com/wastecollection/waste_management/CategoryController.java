package com.wastecollection.waste_management;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CategoryController {

    private final JdbcTemplate jdbcTemplate;

    public CategoryController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/categories")
    public List<Map<String, Object>> getCategories() {

        String sql = "SELECT category_id, category_name, description FROM waste_categories";

        return jdbcTemplate.queryForList(sql);
    }
}
