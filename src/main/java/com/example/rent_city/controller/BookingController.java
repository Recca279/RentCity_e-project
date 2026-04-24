package com.example.rent_city.controller;

import com.example.rent_city.dto.BookingRequest;
import com.example.rent_city.entity.Booking;
import com.example.rent_city.service.BookingService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Lấy tất cả cho Admin Dashboard
    @GetMapping("/admin/all")
    public ResponseEntity<List<Booking>> getAllBookingsForAdmin() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Cập nhật trạng thái (Duyệt đơn)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(bookingService.updateStatus(id, status.toUpperCase()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // Xóa đơn hàng (Dùng chung cho cả xóa đơn Pending và đơn đã Confirm)
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable UUID id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok("Đã xóa đơn hàng và giải phóng xe!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody BookingRequest req) {
        return ResponseEntity.ok(bookingService.createBooking(req));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> getInvoice(@PathVariable UUID id) {
        try {
            Booking b = bookingService.getBookingById(id);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document doc = new Document(pdf);
            
            doc.add(new Paragraph("RENT CITY - INVOICE")
                .setBold()
                .setFontSize(24)
                .setTextAlignment(TextAlignment.CENTER));
            
            doc.add(new Paragraph("Booking ID: " + b.getId().toString()));
            doc.add(new Paragraph("Status: " + (b.getStatus() != null ? b.getStatus() : "N/A")));
            doc.add(new Paragraph("Created At: " + (b.getCreatedAt() != null ? b.getCreatedAt().toString() : "N/A")));
            doc.add(new Paragraph("\n--- VEHICLE DETAILS ---"));
            if (b.getVehicle() != null) {
                doc.add(new Paragraph("Vehicle: " + b.getVehicle().getBrand() + " " + b.getVehicle().getModel()));
                doc.add(new Paragraph("License Plate: " + (b.getVehicle().getPlateNumber() != null ? b.getVehicle().getPlateNumber() : "N/A")));
            }
            
            doc.add(new Paragraph("\n--- CUSTOMER DETAILS ---"));
            doc.add(new Paragraph("Contact Phone: " + (b.getCustomerPhone() != null ? b.getCustomerPhone() : "N/A")));
            if (b.getCustomer() != null) {
                doc.add(new Paragraph("Customer Name: " + b.getCustomer().getFullName()));
                doc.add(new Paragraph("Email: " + b.getCustomer().getEmail()));
            } else {
                doc.add(new Paragraph("Guest Booking"));
            }

            doc.add(new Paragraph("\n--- RENTAL PERIOD ---"));
            doc.add(new Paragraph("Pickup: " + (b.getStartDateTime() != null ? b.getStartDateTime().toString() : "N/A")));
            doc.add(new Paragraph("Return: " + (b.getEndDateTime() != null ? b.getEndDateTime().toString() : "N/A")));

            doc.add(new Paragraph("\nTOTAL AMOUNT: " + (b.getTotalAmount() != null ? b.getTotalAmount().toString() : "0") + " VND")
                .setBold()
                .setFontSize(16));
            
            doc.close();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename("Invoice_" + id + ".pdf").build());
            
            return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}