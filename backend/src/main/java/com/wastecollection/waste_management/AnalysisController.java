
package com.wastecollection.waste_management;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    private final Path projectRoot = findProjectRoot();

    private final Path outputDirectory =
        projectRoot.resolve("python-analysis/output");

    private static Path findProjectRoot() {
        Path current = Path.of("").toAbsolutePath();

        if (Files.exists(current.resolve("python-analysis/analysis.py"))) {
            return current;
        }

        return current.getParent();
    }

    private final Set<String> allowedCharts = Set.of(
        "area_wise_collection.png",
        "quantity_by_category.png",
        "request_status_analysis.png",
        "staff_performance.png",
        "waste_category_analysis.png"
    );

    @PostMapping("/refresh")
    public Map<String, Object> refreshAnalysis() {

        Map<String, Object> response = new HashMap<>();

        try {
            Path scriptPath =
                projectRoot.resolve("python-analysis/analysis.py");

            String pythonCommand;

            if (Files.exists(Path.of("/opt/venv/bin/python"))) {
                pythonCommand = "/opt/venv/bin/python";
            } else {
                pythonCommand = "python";
            }

            ProcessBuilder builder = new ProcessBuilder(
                pythonCommand,
                scriptPath.toString()
            );

            builder.directory(projectRoot.toFile());
            builder.redirectErrorStream(true);

            Process process = builder.start();

            StringBuilder output = new StringBuilder();

            try (var reader = new java.io.BufferedReader(
                    new java.io.InputStreamReader(
                        process.getInputStream()))) {

                String line;

                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();

            response.put("success", exitCode == 0);
            response.put("message", exitCode == 0
                ? "Analysis refreshed successfully"
                : "Python analysis failed");
            response.put("output", output.toString());

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    @GetMapping(
        value = "/charts/{filename}",
        produces = MediaType.IMAGE_PNG_VALUE
    )
    public ResponseEntity<Resource> getChart(
            @PathVariable String filename) {

        if (!allowedCharts.contains(filename)) {
            return ResponseEntity.notFound().build();
        }

        Path chartPath = outputDirectory.resolve(filename);

        if (!Files.exists(chartPath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(chartPath);

        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(resource);
    }
}
