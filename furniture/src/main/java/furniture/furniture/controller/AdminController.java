package furniture.furniture.controller;

import furniture.furniture.dto.AdminUserRequest;
import furniture.furniture.dto.DashboardStatsDto;
import furniture.furniture.dto.ReportDto;
import furniture.furniture.service.AdminService;
import furniture.furniture.dto.SalesTrendDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getRegisteredUsers() {
        return ResponseEntity.ok(adminService.getRegisteredUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<?> addUser(@jakarta.validation.Valid @RequestBody AdminUserRequest request) {
        try {
            adminService.addUser(request);
            return ResponseEntity.ok(Map.of("message", "User created successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @jakarta.validation.Valid @RequestBody AdminUserRequest request) {
        try {
            adminService.updateUser(id, request);
            return ResponseEntity.ok(Map.of("message", "User updated successfully!"));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("User not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully!"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("User not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/sales-trend")
    public ResponseEntity<List<SalesTrendDto>> getSalesTrend(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(adminService.getSalesTrend(startDate, endDate));
    }
}
