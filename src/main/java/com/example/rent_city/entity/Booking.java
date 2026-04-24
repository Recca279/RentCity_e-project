package com.example.rent_city.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime; // Đổi từ ZonedDateTime sang LocalDateTime
import java.math.BigDecimal;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    // ĐỔI THÀNH LOCALDATETIME CHO ĐỒNG BỘ VỚI DTO
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    private BigDecimal baseAmount;
    private BigDecimal totalAmount;

    private String status = "PENDING"; // Để mặc định là PENDING theo luồng 4 bước nhé
    private String customerPhone;

    // Đổi cái này luôn cho đồng bộ
    private LocalDateTime createdAt = LocalDateTime.now();
}