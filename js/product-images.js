const productImages = {
    1: 'https://images.unsplash.com/photo-1555939594-58d7cb561537?w=500&h=500&fit=crop',      // Bánh ngọt
    2: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',      // Cà phê
    3: 'https://images.unsplash.com/photo-1557808005-57f151cf8e8f?w=500&h=500&fit=crop',        // Cốc
    4: 'https://images.unsplash.com/photo-1559056169-641ef13ff271?w=500&h=500&fit=crop',       // Chếu
    5: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop',     // Tách
    6: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd94837?w=500&h=500&fit=crop',     // Bánh donut
    7: 'https://images.unsplash.com/photo-1585328707802-83ca3da3187d?w=500&h=500&fit=crop',     // Bánh mì
    8: 'https://images.unsplash.com/photo-1562619642-e4e6b66f153d?w=500&h=500&fit=crop',       // Bánh sandwich
    9: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=500&fit=crop',    // Bánh nhoài
    10: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=500&fit=crop',    // Thức uống lạnh
    11: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop',    // Cà phê đen
    12: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=500&fit=crop',    // Cà phê nóng
};

/**
 * Lấy ảnh cho một sản phẩm
 * @param {number} productId - ID sản phẩm
 * @returns {string} URL ảnh
 */
function getProductImage(productId) {
    return productImages[productId] || 'https://via.placeholder.com/500?text=No+Image';
}

/**
 * Cập nhật ảnh cho sản phẩm (nếu cần)
 * @param {number} productId - ID sản phẩm
 * @param {string} imageUrl - URL ảnh mới
 */
function setProductImage(productId, imageUrl) {
    productImages[productId] = imageUrl;
}
