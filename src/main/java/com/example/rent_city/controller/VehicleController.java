package com.example.rent_city.controller;

import com.example.rent_city.entity.Vehicle;
import com.example.rent_city.repository.VehicleRepository;
import com.example.rent_city.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173") // Cho phép Frontend gọi API
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleRepository vehicleRepository;

    // --- 1. LẤY DANH SÁCH TẤT CẢ XE ---
    @GetMapping
    public List<Vehicle> getAll() {
        return vehicleService.getAllVehicles();
    }

    // --- 2. LẤY CHI TIẾT 1 XE ---
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable UUID id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 3. ADMIN: THÊM XE MỚI (Nút "Add New" trên UI) ---
    @PostMapping("/admin/add")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        // Mặc định xe mới luôn là AVAILABLE
        if (vehicle.getStatus() == null) {
            vehicle.setStatus("AVAILABLE");
        }
        return new ResponseEntity<>(vehicleService.saveVehicle(vehicle), HttpStatus.CREATED);
    }

    // --- 4. ADMIN: CẬP NHẬT XE (Nút "Edit" trên UI) ---
    @PutMapping("/admin/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable UUID id, @RequestBody Vehicle vehicleDetails) {
        return vehicleService.getVehicleById(id)
                .map(existingVehicle -> {
                    // Cập nhật từng trường thông tin
                    existingVehicle.setBrand(vehicleDetails.getBrand());
                    existingVehicle.setModel(vehicleDetails.getModel());
                    existingVehicle.setPricePerDay(vehicleDetails.getPricePerDay());
                    existingVehicle.setImageUrl(vehicleDetails.getImageUrl());
                    existingVehicle.setPlateNumber(vehicleDetails.getPlateNumber());
                    existingVehicle.setLocation(vehicleDetails.getLocation());
                    existingVehicle.setStatus(vehicleDetails.getStatus());

                    Vehicle updatedVehicle = vehicleService.saveVehicle(existingVehicle);
                    return ResponseEntity.ok(updatedVehicle);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 5. ADMIN: XÓA XE (Nút "Delete" trên UI) ---
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable UUID id) {
        return vehicleService.getVehicleById(id)
                .map(vehicle -> {
                    // Kiểm tra nếu xe đang bị thuê thì không cho xóa
                    if ("RENTED".equals(vehicle.getStatus()) || "BUSY".equals(vehicle.getStatus())) {
                        return ResponseEntity.badRequest()
                                .body("Không thể xóa xe đang trong trạng thái được thuê!");
                    }
                    // Ở đây tớ giả định cậu có hàm deleteVehicleById trong Service
                    // Nếu chưa có, cậu có thể dùng vehicleRepository.deleteById(id) trực tiếp
                    vehicleService.deleteVehicleById(id);
                    return ResponseEntity.ok("Đã xóa xe thành công!");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/admin/{id}/status")
    public ResponseEntity<Vehicle> updateVehicleStatus(
            @PathVariable UUID id,
            @RequestParam String status) {

        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setStatus(status.toUpperCase());
                    return ResponseEntity.ok(vehicleRepository.save(vehicle));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}