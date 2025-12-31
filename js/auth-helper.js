async function logoutUser() {
    const user = localStorage.getItem('user');
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            const userCartKey = `cart_user_${userData.id}`;
            localStorage.removeItem(userCartKey);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    // Xóa token và user
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Hiển thị thông báo
    if (typeof toast !== 'undefined') {
        toast.success('Đã đăng xuất!');
    }
    
    // Chuyển hướng về trang chủ
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// Hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    
    if (token && user) {
        try {
            const userData = JSON.parse(user);
            // Hide auth buttons, show user info
            if (authButtons) authButtons.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            // Update user name and initial
            const initialEl = document.getElementById('user-initial');
            const nameEl = document.getElementById('user-name');
            if (initialEl) initialEl.textContent = userData.name.charAt(0).toUpperCase();
            if (nameEl) nameEl.textContent = userData.name;
        } catch (e) {
            console.error('Error parsing user data:', e);
            authButtons.style.display = 'flex';
            userInfo.style.display = 'none';
        }
    } else {
        // Not logged in - show auth buttons, hide user info
        if (authButtons) authButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
    }
}

async function onLoginSuccess(userData) {
    // Lưu user vào localStorage trước tiên
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Migrate cart từ anonymous sang user
    if (typeof cartManager !== 'undefined' && typeof cartManager.migrateCartOnLogin === 'function') {
        try {
            await cartManager.migrateCartOnLogin(userData.id);
        } catch (error) {
            console.error('Error migrating cart on login:', error);
        }
    }
}
