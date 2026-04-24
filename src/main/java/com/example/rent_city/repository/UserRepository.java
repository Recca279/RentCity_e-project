package com.example.rent_city.repository;

import com.example.rent_city.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmail(String email);

    // Thêm 2 dòng này để validate lúc đăng ký
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}