package com.example.rent_city.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data //
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private UUID vehicleId;
    private UUID userId;
    private String customerPhone;

    // Đảm bảo viết đúng CamelCase để nó sinh ra hàm getStartDateTime
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private java.math.BigDecimal totalAmount;
}