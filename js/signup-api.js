const API_BASE = 'http://localhost:3000/api';

document.querySelector('form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.querySelector('input[name="name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;
    
    if (!name || !email || !password || !confirmPassword) {
        if (typeof toast !== 'undefined') {
            toast.warning('Vui lòng điền đầy đủ thông tin');
        } else {
            alert('Vui lòng điền đầy đủ thông tin');
        }
        return;
    }
    
    if (password !== confirmPassword) {
        if (typeof toast !== 'undefined') {
            toast.error('Mật khẩu xác nhận không khớp');
        } else {
            alert('Mật khẩu xác nhận không khớp');
        }
        return;
    }
    
    if (password.length < 6) {
        if (typeof toast !== 'undefined') {
            toast.warning('Mật khẩu phải có ít nhất 6 ký tự');
        } else {
            alert('Mật khẩu phải có ít nhất 6 ký tự');
        }
        return;
    }
    
    try {
        // Gọi API server để đăng ký
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (typeof toast !== 'undefined') {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            } else {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
            }

            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 1500);
        } else {
            if (typeof toast !== 'undefined') {
                toast.error(data.message || 'Lỗi khi đăng ký');
            } else {
                alert(data.message || 'Lỗi khi đăng ký');
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
