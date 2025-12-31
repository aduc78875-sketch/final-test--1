// Cart Management System
const cartManager = {
    API_BASE: 'http://localhost:3000/api',
    
    isUserLoggedIn() {
        return localStorage.getItem('user') !== null;
    },
    
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    getLocalCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    
    setLocalCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    
    async addToCart(product_id, quantity = 1) {
        const user = this.getCurrentUser();
        
        if (user) {
            try {
                const response = await fetch(`${this.API_BASE}/cart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.id,
                        product_id,
                        quantity
                    })
                });
                
                const data = await response.json();
                return { success: data.success, message: data.message };
            } catch (error) {
                return { success: false, message: 'Lỗi: ' + error.message };
            }
        } else {
            const cart = this.getLocalCart();
            const existing = cart.find(item => item.product_id === product_id);
            
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({ product_id, quantity });
            }
            
            this.setLocalCart(cart);
            return { success: true, message: 'Thêm vào giỏ hàng thành công' };
        }
    },
    
    async getCart() {
        const user = this.getCurrentUser();
        
        if (user) {
            try {
                const response = await fetch(`${this.API_BASE}/cart/user/${user.id}`);
                const data = await response.json();
                return data.success ? data.data : [];
            } catch (error) {
                console.error('Error fetching cart:', error);
                return [];
            }
        } else {
            return this.getLocalCart();
        }
    },
    
    async removeFromCart(productId) {
        const user = this.getCurrentUser();
        
        if (user) {
            try {
                const cart = await this.getCart();
                const cartItem = cart.find(item => item.product_id === productId);
                
                if (!cartItem || !cartItem.id) {
                    console.error('Không tìm thấy item trong giỏ hàng');
                    return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
                }
                
                const response = await fetch(`${this.API_BASE}/cart/${cartItem.id}`, {
                    method: 'DELETE'
                });
                
                const data = await response.json();
                return { success: data.success, message: data.message };
            } catch (error) {
                console.error('Error removing item:', error);
                return { success: false, message: 'Lỗi: ' + error.message };
            }
        } else {
            const cart = this.getLocalCart();
            const filtered = cart.filter(item => item.product_id !== productId);
            this.setLocalCart(filtered);
            return { success: true, message: 'Xóa khỏi giỏ hàng thành công' };
        }
    },
    
    async updateQuantity(productId, quantity) {
        const user = this.getCurrentUser();
        
        if (quantity <= 0) {
            return this.removeFromCart(productId);
        }
        
        if (user) {
            try {
                const cart = await this.getCart();
                const cartItem = cart.find(item => item.product_id === productId);
                
                if (!cartItem || !cartItem.id) {
                    console.error('Không tìm thấy item trong giỏ hàng');
                    return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
                }
                
                const response = await fetch(`${this.API_BASE}/cart/${cartItem.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity })
                });
                
                const data = await response.json();
                return { success: data.success, message: data.message };
            } catch (error) {
                console.error('Error updating quantity:', error);
                return { success: false, message: 'Lỗi: ' + error.message };
            }
        } else {
            const cart = this.getLocalCart();
            const item = cart.find(item => item.product_id === productId);
            if (item) {
                item.quantity = quantity;
                this.setLocalCart(cart);
                return { success: true, message: 'Cập nhật giỏ hàng thành công' };
            }
            return { success: false, message: 'Không tìm thấy sản phẩm' };
        }
    },
    
    async getCartCount() {
        const cart = await this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    async clearCart() {
        const user = this.getCurrentUser();
        
        if (user) {
            try {
                const response = await fetch(`${this.API_BASE}/cart/user/${user.id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                return { success: data.success, message: data.message };
            } catch (error) {
                console.error('Error clearing cart:', error);
                return { success: false, message: 'Lỗi: ' + error.message };
            }
        } else {
            localStorage.removeItem('cart');
            return { success: true, message: 'Đã xóa giỏ hàng' };
        }
    },
    
    async migrateCartOnLogin(user_id) {
        const localCart = this.getLocalCart();
        
        if (localCart.length > 0) {
            try {
                for (const item of localCart) {
                    await fetch(`${this.API_BASE}/cart`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id,
                            product_id: item.product_id,
                            quantity: item.quantity
                        })
                    });
                }
                
                localStorage.removeItem('cart');
                notification.info('✓ Đã cập nhật giỏ hàng từ lần trước');
            } catch (error) {
                console.error('Error migrating cart:', error);
            }
        }
    }
};
