const express = require('express');
const router = express.Router();
const pool = require('./db-config');

// ===== CART API =====
router.post('/cart', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    
    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đầy đủ thông tin'
        });
    }
    
    try {
        const connection = await pool.getConnection();
        const [existing] = await connection.query(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );
        
        if (existing.length > 0) {
            await connection.execute(
                'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, user_id, product_id]
            );
        } else {
            await connection.execute(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [user_id, product_id, quantity]
            );
        }
        
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Thêm vào giỏ hàng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm vào giỏ',
            error: error.message
        });
    }
});

router.get('/cart/user/:user_id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.id 
             WHERE ci.user_id = ?`,
            [req.params.user_id]
        );
        connection.release();
        
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy giỏ hàng',
            error: error.message
        });
    }
});

router.delete('/cart/:cart_id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'DELETE FROM cart_items WHERE id = ?',
            [req.params.cart_id]
        );
        connection.release();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm trong giỏ'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Xóa khỏi giỏ hàng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa khỏi giỏ',
            error: error.message
        });
    }
});

router.put('/cart/:cart_id', async (req, res) => {
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Số lượng phải lớn hơn 0'
        });
    }
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE cart_items SET quantity = ? WHERE id = ?',
            [quantity, req.params.cart_id]
        );
        connection.release();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm trong giỏ'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Cập nhật giỏ hàng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật giỏ',
            error: error.message
        });
    }
});

// ===== PRODUCTS API =====
router.get('/products', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM products');
        connection.release();
        
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy dữ liệu sản phẩm',
            error: error.message
        });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id]
        );
        connection.release();
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy chi tiết sản phẩm',
            error: error.message
        });
    }
});

router.post('/products', async (req, res) => {
    const { name, price, description, image } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đầy đủ tên và giá sản phẩm'
        });
    }
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)',
            [name, price, description || '', image || '']
        );
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Thêm sản phẩm thành công',
            data: {
                id: result.insertId,
                name,
                price,
                description,
                image
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm sản phẩm',
            error: error.message
        });
    }
});

router.put('/products/:id', async (req, res) => {
    const { name, price, description, image } = req.body;
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?',
            [name || '', price || 0, description || '', image || '', req.params.id]
        );
        connection.release();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm để cập nhật'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Cập nhật sản phẩm thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error.message
        });
    }
});

// ===== AUTH API =====
router.post('/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đầy đủ thông tin'
        });
    }
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [email, password, name]
        );
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                id: result.insertId,
                email,
                name
            }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Email đã tồn tại'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng ký',
            error: error.message
        });
    }
});

router.post('/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập email và mật khẩu'
        });
    }
    
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );
        connection.release();
        
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                id: rows[0].id,
                email: rows[0].email,
                name: rows[0].name
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đăng nhập',
            error: error.message
        });
    }
});

// ===== USERS API =====
router.put('/users/:id', async (req, res) => {
    const { name, email, phone, address, city } = req.body;
    const userId = req.params.id;
    
    console.log('Cập nhật user ID:', userId, 'Data:', { name, email, phone, address });
    
    try {
        const connection = await pool.getConnection();
        
        // Kiểm tra user có tồn tại không
        const [checkUser] = await connection.query(
            'SELECT id FROM users WHERE id = ?',
            [userId]
        );
        console.log('User tìm thấy:', checkUser.length > 0);
        
        if (checkUser.length === 0) {
            connection.release();
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user để cập nhật'
            });
        }
        
        const [result] = await connection.execute(
            'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, city = ? WHERE id = ?',
            [name || '', email || '', phone || '', address || '', city || '', userId]
        );
        connection.release();
        
        console.log('Cập nhật rows:', result.affectedRows);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user để cập nhật'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            data: {
                id: req.params.id,
                name,
                email,
                phone,
                address,
                city
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thông tin',
            error: error.message
        });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT id, email, name, phone, address, city FROM users WHERE id = ?',
            [req.params.id]
        );
        connection.release();
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }
        
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin user',
            error: error.message
        });
    }
});

// ===== NOTIFICATIONS API =====
router.post('/notifications', async (req, res) => {
    const { user_id, title, message, type } = req.body;
    
    if (!user_id || !title || !message) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đầy đủ thông tin'
        });
    }
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [user_id, title, message, type || 'info']
        );
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Tạo thông báo thành công',
            data: {
                id: result.insertId,
                user_id,
                title,
                message,
                type
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo thông báo',
            error: error.message
        });
    }
});

router.get('/notifications/user/:user_id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
            [req.params.user_id]
        );
        connection.release();
        
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông báo',
            error: error.message
        });
    }
});

// ===== ORDERS API =====
router.post('/orders', async (req, res) => {
    const { user_id, total_price } = req.body;

    if (!user_id || total_price === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập user_id và tổng tiền'
        });
    }
    
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
            [user_id, total_price || 0, 'pending']
        );
        connection.release();
        
        res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công',
            data: {
                order_id: result.insertId,
                user_id,
                total_price: total_price || 0,
                status: 'pending'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo đơn hàng',
            error: error.message
        });
    }
});

router.get('/orders/user/:user_id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.params.user_id]
        );
        connection.release();
        
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy đơn hàng',
            error: error.message
        });
    }
});

module.exports = router;
