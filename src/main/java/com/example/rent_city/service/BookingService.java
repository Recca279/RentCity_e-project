package com.example.rent_city.service;

import com.example.rent_city.entity.Booking;
import com.example.rent_city.entity.User;
import com.example.rent_city.entity.Vehicle;
import com.example.rent_city.repository.BookingRepository;
import com.example.rent_city.repository.UserRepository;
import com.example.rent_city.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import com.example.rent_city.dto.BookingRequest;

@Service
public class BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private VehicleRepository vehicleRepository;

    // --- HÀM CHO ADMIN ---
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // --- HÀM UPDATE STATUS (Fix lỗi đỏ ở Controller) ---
    @Transactional
    public Booking updateStatus(UUID id, String status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        
        if ("CANCELLED".equals(status) || "COMPLETED".equals(status)) {
            Vehicle v = booking.getVehicle();
            if (v != null) {
                v.setStatus("AVAILABLE");
                vehicleRepository.save(v);
            }
        }
        
        return bookingRepository.save(booking);
    }

    // --- HÀM XÓA ĐƠN (Fix lỗi đỏ ở Controller) ---
    @Transactional
    public void deleteBooking(UUID id) {
        Booking booking = getBookingById(id);
        Vehicle vehicle = booking.getVehicle();
        if (vehicle != null) {
            vehicle.setStatus("AVAILABLE");
            vehicleRepository.save(vehicle);
        }
        bookingRepository.deleteById(id);
    }

    public Booking getBookingById(UUID id) {
        return bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    public List<Booking> getMyBookings(UUID userId) {
        return bookingRepository.findByCustomerId(userId);
    }

    // --- HÀM TẠO ĐƠN ---
    @Transactional
    public Booking createBooking(BookingRequest req) {
        User u = null;
        if (req.getUserId() != null) {
            u = userRepository.findById(req.getUserId()).orElse(null);
        }
        
        // Nếu không có userId hoặc không tìm thấy theo ID, hãy thử tìm theo số điện thoại
        if (u == null && req.getCustomerPhone() != null) {
            u = userRepository.findByPhone(req.getCustomerPhone()).orElse(null);
        }

        Vehicle v = vehicleRepository.findById(req.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        if (!"AVAILABLE".equals(v.getStatus())) {
            throw new RuntimeException("Vehicle is currently not available");
        }
        
        v.setStatus("BUSY");
        vehicleRepository.save(v);

        Booking b = new Booking();
        b.setCustomer(u); // Có thể null (Guest)

        b.setVehicle(v);
        b.setStartDateTime(req.getStartDateTime());
        b.setEndDateTime(req.getEndDateTime());
        b.setTotalAmount(req.getTotalAmount());
        b.setCustomerPhone(req.getCustomerPhone());
        b.setStatus("PENDING");
        b.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(b);
    }
}