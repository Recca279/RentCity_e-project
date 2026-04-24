package com.example.rent_city.config;

import com.example.rent_city.entity.Vehicle;
import com.example.rent_city.repository.BookingRepository;
import com.example.rent_city.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Configuration
public class DataSeeder {

    @Bean
    @Transactional
    CommandLineRunner initDatabase(VehicleRepository vehicleRepository, BookingRepository bookingRepository) {
        return args -> {
            if (vehicleRepository.count() > 0) return;

            System.out.println(">>> [INFO] SEEDING 200 VEHICLES WITH VIETNAMESE PLATES...");

            // --- Dữ liệu xe ---
            Object[][] carData = {
                    {"Toyota",        "Camry 2.5Q",       "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb", 1800000},
                    {"Toyota",        "Fortuner GR Sport","https://images.unsplash.com/photo-1612478586000-b1e62645e8dd", 1600000},
                    {"Toyota",        "Veloz Cross",      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7", 1200000},
                    {"Toyota",        "Innova Cross",     "https://images.unsplash.com/photo-1619767886558-efdc259cde1a", 1300000},
                    {"Ford",          "Mustang GT",       "https://images.unsplash.com/photo-1583121274602-3e2820c69888", 3500000},
                    {"Ford",          "Ranger Wildtrak",  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64", 1400000},
                    {"Ford",          "Territory Sport",  "https://images.unsplash.com/photo-1606611013016-969c19ba27bb", 1100000},
                    {"Tesla",         "Model S Plaid",    "https://images.unsplash.com/photo-1560958089-b8a1929cea89", 4500000},
                    {"Tesla",         "Model Y",          "https://images.unsplash.com/photo-1619767886558-efdc259cde1a", 3200000},
                    {"BMW",           "M4 Competition",   "https://images.unsplash.com/photo-1555215695-3004980ad54e", 4800000},
                    {"BMW",           "3 Series 320i",    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b", 2200000},
                    {"BMW",           "X5 xDrive40i",     "https://images.unsplash.com/photo-1549399542-7e3f8b79c341", 3800000},
                    {"Mercedes-Benz", "S-Class Maybach",  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8", 5500000},
                    {"Mercedes-Benz", "GLC 300 4Matic",   "https://images.unsplash.com/photo-1590362891991-f776e747a588", 3000000},
                    {"Mercedes-Benz", "C300 AMG",         "https://images.unsplash.com/photo-1553440569-bcc63803a83d", 2800000},
                    {"Audi",          "RS7 Sportback",    "https://images.unsplash.com/photo-1606611013016-969c19ba27bb", 5000000},
                    {"Audi",          "Q7 55 TFSI",       "https://images.unsplash.com/photo-1587829741301-dc798b83add3", 3600000},
                    {"Honda",         "Civic Type R",      "https://images.unsplash.com/photo-1592198084033-aade902d1aae", 2100000},
                    {"Honda",         "CR-V L",            "https://images.unsplash.com/photo-1570733577524-3a047079e80d", 1500000},
                    {"Hyundai",       "Ioniq 5",           "https://images.unsplash.com/photo-1665476020121-6893096590b5", 1900000},
                    {"Hyundai",       "Santa Fe Calligraphy","https://images.unsplash.com/photo-1617788138017-80ad40651399", 1700000},
                    {"KIA",           "EV6 GT",            "https://images.unsplash.com/photo-1643194017371-92f703e9365a", 2300000},
                    {"KIA",           "Carnival Limousine","https://images.unsplash.com/photo-1567818735868-e71b99932e29", 2600000},
                    {"VinFast",       "VF 8 Plus",         "https://images.unsplash.com/photo-1671223251025-6ef97a4c0588", 1400000},
                    {"VinFast",       "VF 9",              "https://images.unsplash.com/photo-1671223251025-6ef97a4c0588", 2000000},
                    {"Mazda",         "CX-5 Premium",      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d", 1300000},
                    {"Mazda",         "Mazda3 Sport",      "https://images.unsplash.com/photo-1548286978-f218023f8d18", 1100000},
                    {"Porsche",       "Cayenne GTS",       "https://images.unsplash.com/photo-1503376780353-7e6692767b70", 6000000},
                    {"Porsche",       "Macan Turbo",       "https://images.unsplash.com/photo-1601362840469-51e4d8d58785", 5200000},
                    {"Lexus",         "LX 600 VIP",        "https://images.unsplash.com/photo-1563720223185-11003d516935", 7000000},
            };

            // --- Biển số Việt Nam chuẩn ---
            // Biển HN (29-33) và SG (40-41, 50-59) — xe đăng ký ở đâu cũng được, thuê ở HN
            String[] provinces = {
                "29", "30", "31", "32", "33",          // Hà Nội
                "40", "41",                             // TP.HCM (Sài Gòn cũ)
                "50", "51", "52", "53", "54", "55",    // TP.HCM
                "56", "57", "58", "59"                  // TP.HCM
            };

            // Ký tự sêri (chữ cái dùng trong biển số VN): bỏ các chữ dễ nhầm
            char[] seriesChars = "ABCDEFGHKLMNPSTUVXYZ".toCharArray();

            Random random = new Random(42); // seed cố định để kết quả nhất quán

            // Sinh danh sách biển số không trùng nhau cho 200 xe
            List<String> plates = new ArrayList<>();
            while (plates.size() < 200) {
                String province = provinces[random.nextInt(provinces.length)];
                char series = seriesChars[random.nextInt(seriesChars.length)];
                // Số: từ 10000 đến 99999
                int number = 10000 + random.nextInt(89999);
                String plate = province + series + "-" + String.format("%05d", number);
                if (!plates.contains(plate)) {
                    plates.add(plate);
                }
            }
            Collections.shuffle(plates, random);

            // Các điểm cho thuê xe tại Hà Nội
            String[] locations = {
                "Hoàn Kiếm Hub",
                "Đống Đa Hub",
                "Ba Đình Hub",
                "Cầu Giấy Hub",
                "Hai Bà Trưng Hub",
                "Hoàng Mai Hub",
                "Long Biên Hub",
                "Tây Hồ Hub"
            };

            for (int i = 0; i < 200; i++) {
                Object[] data = carData[i % carData.length];
                String brand    = (String) data[0];
                String model    = (String) data[1];
                String img      = (String) data[2];
                int basePrice   = (int)    data[3];

                // Biến động giá ±20%
                int variance = (int)(basePrice * 0.2);
                BigDecimal price = new BigDecimal(basePrice - variance + random.nextInt(variance * 2));

                Vehicle v = Vehicle.builder()
                        .brand(brand)
                        .model(model)
                        .plateNumber(plates.get(i))
                        .pricePerDay(price)
                        .status("AVAILABLE")
                        .location(locations[i % locations.length])
                        .imageUrl(img + "?w=800&auto=format&fit=crop")
                        .build();

                vehicleRepository.save(v);
            }

            System.out.println(">>> [SUCCESS] 200 VEHICLES SEEDED WITH VIETNAMESE PLATES.");
        };
    }
}