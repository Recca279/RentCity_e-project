package com.example.rent_city.controller;

import com.example.rent_city.dto.UpdateProfileRequest;

import com.example.rent_city.entity.User;
import com.example.rent_city.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // THĂNG CẤP ADMIN
    @PutMapping("/{id}/upgrade-admin")
    public ResponseEntity<?> upgradeToAdmin(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
        user.setRole("ADMIN"); // Đảm bảo viết HOA
        userRepository.save(user);
        return ResponseEntity.ok("Cấp quyền Admin thành công!");
    }

    // GIÁNG CHỨC (REVOKE ADMIN)
    @PutMapping("/{id}/revoke-admin")
    public ResponseEntity<?> revokeAdmin(@PathVariable UUID id, @RequestParam UUID adminId) {
        User performer = userRepository.findById(adminId).orElse(null);
        if (performer != null && "ADMIN".equals(performer.getRole())) {
            User targetUser = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User!"));

            if (targetUser.getId().equals(adminId)) {
                return ResponseEntity.badRequest().body("Cậu không thể tự tước quyền của chính mình!");
            }

            targetUser.setRole("CUSTOMER");
            userRepository.save(targetUser);
            return ResponseEntity.ok("Đã hạ cấp xuống Customer.");
        }
        return ResponseEntity.status(403).body("Cậu không có quyền thực hiện hành động này!");
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable UUID id, @RequestParam UUID adminId) {
        User performer = userRepository.findById(adminId).orElse(null);
        if (performer != null && "ADMIN".equals(performer.getRole())) {
            User targetUser = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy User!"));
            if (targetUser.getId().equals(adminId)) return ResponseEntity.badRequest().body("Lỗi!");
            targetUser.setStatus("BANNED");
            userRepository.save(targetUser);
            return ResponseEntity.ok("Banned!");
        }
        return ResponseEntity.status(403).build();
    }

    @PatchMapping("/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable UUID id, @RequestParam UUID adminId) {
        User performer = userRepository.findById(adminId).orElse(null);
        if (performer != null && "ADMIN".equals(performer.getRole())) {
            User targetUser = userRepository.findById(id).orElseThrow();
            targetUser.setStatus("ACTIVE");
            userRepository.save(targetUser);
            return ResponseEntity.ok("Unbanned!");
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable UUID id, @RequestBody UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
        
        if (request.getPhone() != null && !request.getPhone().trim().matches("^0\\d{9}$")) {
            return ResponseEntity.badRequest().body("Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có đúng 10 số)!");
        }

        // Kiểm tra xem SDT có bị trùng với người khác không
        if (request.getPhone() != null && !request.getPhone().equals(user.getPhone())) {
            if (userRepository.existsByPhone(request.getPhone())) {
                return ResponseEntity.badRequest().body("Số điện thoại này đã được sử dụng bởi người khác!");
            }
        }

        // Kiểm tra xem Email có bị trùng không
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email này đã được sử dụng bởi người khác!");
            }
        }

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getStreet() != null) user.setStreet(request.getStreet());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getPostalCode() != null) user.setPostalCode(request.getPostalCode());
        
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}