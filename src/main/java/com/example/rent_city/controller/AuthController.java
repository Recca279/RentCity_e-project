package com.example.rent_city.controller;

import com.example.rent_city.dto.LoginRequest;
import com.example.rent_city.dto.RegisterRequest;
import com.example.rent_city.entity.User;
import com.example.rent_city.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.ZonedDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getPhone() == null || !request.getPhone().trim().matches("^0\\d{9}$")) {
            return ResponseEntity.badRequest().body("Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có đúng 10 số)!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email này đã được sử dụng!");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            return ResponseEntity.badRequest().body("Số điện thoại này đã được đăng ký!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setPasswordHash(request.getPassword()); // Pass thô (Demo)
        user.setRole("CUSTOMER");
        user.setStatus("ACTIVE");
        user.setLoyaltyPoints(0);
        user.setTier("STANDARD");
        user.setCreatedAt(ZonedDateTime.now());

        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // CHỐT CHẶN: Kiểm tra xem User có bị Admin khóa không
            if ("BANNED".equals(user.getStatus())) {
                return ResponseEntity.status(403).body("Tài khoản của cậu đã bị khóa do vi phạm chính sách!");
            }

            if (user.getPasswordHash().equals(request.getPassword())) {
                System.out.println(">>> [SUCCESS] User logged in: " + user.getEmail());
                return ResponseEntity.ok(user); // Trả về thông tin user cho Frontend lưu localStorage
            }
        }

        return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu rồi cậu ơi!");
    }
}