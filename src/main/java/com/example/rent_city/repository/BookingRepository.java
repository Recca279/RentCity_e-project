package com.example.rent_city.repository;

import com.example.rent_city.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    long countByStatus(String status);

    // FIX: Đổi theo field customer của entity
    List<Booking> findByCustomerId(UUID customerId);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status IN ('CONFIRMED', 'COMPLETED')")
    Double calculateTotalRevenue();
}