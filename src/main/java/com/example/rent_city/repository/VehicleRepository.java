package com.example.rent_city.repository;

import com.example.rent_city.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    List<Vehicle> findByStatus(String status);
    // Tìm theo biển số xe
    Optional<Vehicle> findByPlateNumber(String plateNumber);
}