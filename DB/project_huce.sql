-- Tạo database
CREATE DATABASE IF NOT EXISTS project_huce;
USE project_huce;

-- Bảng users (người dùng)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng products (sản phẩm)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    description TEXT,
    image VARCHAR(255),
    category VARCHAR(50),
    sold VARCHAR(50),
    date_added DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng orders (đơn hàng)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng order_items (chi tiết đơn hàng)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Bảng cart_items (giỏ hàng)
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Bảng notifications (thông báo)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Thêm dữ liệu mẫu cho sản phẩm (15 sản phẩm)
INSERT INTO products (name, price, description, image, category, sold, date_added) VALUES 
('Cà phê Robusta Nguyên Chất 500g Đậm Vị', 145000, 'Cà phê Robusta nguyên chất chất lượng cao', 'https://images.unsplash.com/photo-1611854779393-1b2ae9634151?auto=format&fit=crop&w=600&q=80', 'hat', '12k', '2025-08-10'),
('Máy Pha Cà Phê Espresso Gia Đình Tiện Lợi', 1699000, 'Máy espresso tự động tiện lợi cho gia đình', 'https://images.unsplash.com/photo-1585507963323-2410a7065992?auto=format&fit=crop&w=600&q=80', 'may', '532', '2025-05-03'),
('Phin Cà Phê Nhôm Cao Cấp Màu Đen Bóng', 25000, 'Phin cà phê nhôm cao cấp màu đen bóng', 'https://images.unsplash.com/photo-1552346989-e069318e20a5?auto=format&fit=crop&w=600&q=80', 'dungcu', '9k', '2025-11-01'),
('Hạt Arabica Cầu Đất 250g Hương Trái Cây', 110000, 'Hạt Arabica từ Cầu Đất với hương trái cây', 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80', 'hat', '1.2k', '2025-09-15'),
('Ca Đánh Sữa Inox 350ml Vạch Chia', 89000, 'Ca đánh sữa inox chất lượng cao với vạch chia', 'https://images.unsplash.com/photo-1551988470-7603f90b91d2?auto=format&fit=crop&w=600&q=80', 'dungcu', '2.1k', '2025-06-20'),
('Máy Xay Cà Phê Hạt Bằng Tay Cối Gỗ', 350000, 'Máy xay cà phê hạt bằng tay với cối gỗ', 'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?auto=format&fit=crop&w=600&q=80', 'may', '450', '2025-04-12'),
('Combo 1kg Cà Phê Blend (Rob + Ara)', 290000, 'Combo 1kg cà phê blend Robusta + Arabica', 'https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?auto=format&fit=crop&w=600&q=80', 'hat', '5k', '2025-07-01'),
('Giấy Lọc Cà Phê V60 Hario (100 tờ)', 120000, 'Giấy lọc cà phê V60 Hario 100 tờ chất lượng', 'https://images.unsplash.com/photo-1517080319559-42b78a994796?auto=format&fit=crop&w=600&q=80', 'dungcu', '800', '2025-10-02'),
('Cân Tiểu Ly Điện Tử Có Timer', 250000, 'Cân tiểu ly điện tử có timer chính xác', 'https://images.unsplash.com/photo-1599557285579-2479dbd0046e?auto=format&fit=crop&w=600&q=80', 'dungcu', '3k', '2025-03-30'),
('Bình Ngâm Cold Brew Hario 1L', 450000, 'Bình ngâm cold brew Hario dung tích 1L', 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=600&q=80', 'may', '120', '2025-02-14'),
('Siro Caramel 700ml Pháp', 185000, 'Siro Caramel nhập khẩu từ Pháp 700ml', 'https://images.unsplash.com/photo-1623959648937-293699c30368?auto=format&fit=crop&w=600&q=80', 'nguyenlieu', '200', '2025-09-30'),
('Bột Cacao Nguyên Chất 500g', 95000, 'Bột cacao nguyên chất 100% dung tích 500g', 'https://images.unsplash.com/photo-1547476602-0e9723c2c1f9?auto=format&fit=crop&w=600&q=80', 'nguyenlieu', '600', '2025-01-10'),
('Ly Giữ Nhiệt Inox 500ml Khắc Tên', 120000, 'Ly giữ nhiệt inox 500ml có thể khắc tên', 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=600&q=80', 'dungcu', '4k', '2025-12-01'),
('Bộ Ấm Trà Sứ Trắng Phong Cách Bắc Âu', 550000, 'Bộ ấm trà sứ trắng phong cách Bắc Âu', 'https://images.unsplash.com/photo-1596710629198-d168fb99b7b7?auto=format&fit=crop&w=600&q=80', 'dungcu', '80', '2025-06-05'),
('Sữa Đặc Ngôi Sao Phương Nam (Thùng 24 lon)', 480000, 'Sữa đặc Ngôi Sao Phương Nam thùng 24 lon', 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=600&q=80', 'nguyenlieu', '100', '2025-08-25');

-- Thêm dữ liệu mẫu cho người dùng
INSERT INTO users (email, password, name, phone, address) VALUES 
('user@example.com', '123456', 'Nguyễn Văn A', '0901234567', 'Hà Nội'),
('user2@example.com', '123456', 'Trần Thị B', '0912345678', 'TP.HCM');
