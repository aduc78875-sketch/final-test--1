const API_BASE = 'http://localhost:3000/api';

document.querySelector('form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;

    if (!email || !password) {
        if (typeof toast !== 'undefined') {
            toast.warning('Vui lòng nhập email và mật khẩu');
        } else {
            alert('Vui lòng nhập email và mật khẩu');
        }
        return;
    }
    
    try {
        // Gọi API server để đăng nhập
        const response = await fetch(`${API_BASE}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Lưu token và user data
            localStorage.setItem('token', 'loggedIn_' + Date.now());
            
            const userData = {
                id: data.data.id,
                name: data.data.name,
                email: data.data.email
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            if (typeof onLoginSuccess === 'function') {
                await onLoginSuccess(userData);
            }
            
            if (typeof toast !== 'undefined') {
                toast.success('Đăng nhập thành công!');
            } else {
                alert('Đăng nhập thành công!');
            }
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        } else {
            if (typeof toast !== 'undefined') {
                toast.error(data.message || 'Email hoặc mật khẩu không chính xác');
            } else {
                alert(data.message || 'Email hoặc mật khẩu không chính xác');
            }
        }
    } catch (error) {
        if (typeof toast !== 'undefined') {
            toast.error('Lỗi: ' + error.message);
        } else {
            alert('Lỗi: ' + error.message);
        }
    }
});
