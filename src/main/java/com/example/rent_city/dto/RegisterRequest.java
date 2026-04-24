package com.example.rent_city.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone; // Bắt buộc phải có để sau này Booking nó nhận ra nhau
}