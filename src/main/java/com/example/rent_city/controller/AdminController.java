package com.example.rent_city.controller;

import com.example.rent_city.repository.UserRepository;
import com.example.rent_city.repository.VehicleRepository;
import com.example.rent_city.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private VehicleRepository vehicleRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Gọi hàm tính tổng tiền thật thay vì hardcode
        Double realRevenue = bookingRepository.calculateTotalRevenue();

        stats.put("totalRevenue", realRevenue);
        stats.put("activeRentals", bookingRepository.countByStatus("CONFIRMED"));
        stats.put("totalBookings", bookingRepository.count());
        stats.put("registeredUsers", userRepository.count());

        return ResponseEntity.ok(stats);
    }
}