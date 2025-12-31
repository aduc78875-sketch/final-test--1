// Script để thêm column city vào bảng users
const mysql = require('mysql2/promise');

async function addCityColumn() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'project_huce'
    });
    
    try {
        console.log('🔧 Kiểm tra column city...');
        
        // Kiểm tra xem column city đã tồn tại không
        const [rows] = await connection.query(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='users' AND COLUMN_NAME='city'"
        );
        
        if (rows.length === 0) {
            console.log('➕ Thêm column city...');
            await connection.query(
                "ALTER TABLE users ADD COLUMN city VARCHAR(100)"
            );
            console.log('✅ Column city đã được thêm vào bảng users');
        } else {
            console.log('✅ Column city đã tồn tại');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

addCityColumn();
