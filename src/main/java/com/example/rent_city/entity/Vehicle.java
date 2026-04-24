package com.example.rent_city.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Để Hibernate tự lo UUID
    private UUID id;

    private String brand;
    private String model;

    @Column(name = "plate_number", unique = true, nullable = false)
    private String plateNumber;

    @Column(name = "price_per_day")
    private BigDecimal pricePerDay;

    private String status; // AVAILABLE, BUSY, MAINTENANCE

    @Column(name = "image_url", length = 500)
    private String imageUrl; // Lưu link ảnh từ Internet
    private String location;

}