package com.example.rent_city;

import com.example.rent_city.entity.User;
import com.example.rent_city.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RentCityApplication {

	public static void main(String[] args) {

        SpringApplication.run(RentCityApplication.class, args);
	}

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository) {
        return args -> {
            // Kiểm tra theo email cho chắc vì email là duy nhất (unique)
            if (userRepository.findByEmail("admin@demo.com").isEmpty()) {
                User admin = new User();

                admin.setEmail("admin@demo.com");
                admin.setPasswordHash("123456");
                admin.setFullName("Super Admin");
                admin.setPhone("0000000000");
                admin.setRole("ADMIN");
                admin.setStatus("ACTIVE");

                userRepository.save(admin);
                System.out.println(">>> Đã khởi tạo Admin: admin@demo.com / 123456");
            }
        };
    }

}
