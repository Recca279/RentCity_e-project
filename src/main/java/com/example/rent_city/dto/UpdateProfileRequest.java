package com.example.rent_city.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String email;
    private String phone;
    private String street;
    private String city;
    private String postalCode;
}
