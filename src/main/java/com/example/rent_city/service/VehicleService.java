package com.example.rent_city.service;

import com.example.rent_city.entity.Vehicle;
import com.example.rent_city.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VehicleService {
    @Autowired
    private VehicleRepository vehicleRepository;

    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    public void deleteVehicleById(UUID id) { vehicleRepository.deleteById(id); }
    public Optional<Vehicle> getVehicleById(UUID id) {
        return vehicleRepository.findById(id);
    }
}