package com.example.rent_city.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.ZonedDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash; // Tuyệt đối không lưu pass thô [cite: 32, 183]

    private String fullName;

    @Column(unique = true)
    private String phone;

    private String role = "CUSTOMER"; // CUSTOMER | STAFF | ADMIN [cite: 28, 170]
    private String status = "ACTIVE";
    private Integer loyaltyPoints = 0;
    private String tier = "STANDARD";
    
    // Address fields
    private String street;
    private String city;
    private String postalCode;

    private ZonedDateTime createdAt = ZonedDateTime.now(); // Quy tắc 3
}