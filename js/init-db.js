const mysql = require('mysql2/promise');
const fs = require('fs');

async function initDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345678',
            multipleStatements: true
        });

        console.log('✓ Đã kết nối MySQL');
        const sql = fs.readFileSync('./project_huce.sql', 'utf8');
        await connection.query(sql);

        console.log('✓ Database đã được khởi tạo thành công!');
        console.log('✓ Đã tạo 15 sản phẩm mẫu');

        await connection.end();
    } catch (error) {
        console.error('✗ Lỗi:', error.message);
        process.exit(1);
    }
}

initDatabase();
