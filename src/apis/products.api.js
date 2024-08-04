import http from '~/utils/http';

//--------------------------------------------------------------- PRODUCTS ---------------------------------------------------------------

//lấy danh sách sản phẩm
export const getProducts = (page, limit, categoryId, minPrice, maxPrice) => {
    const params = {
        page: page,
        limit: limit
    };
    if (categoryId !== undefined) {
        params.categoryId = categoryId;
    }
    if (minPrice !== undefined) {
        params.minPrice = minPrice;
    }
    if (maxPrice !== undefined) {
        params.maxPrice = maxPrice;
    }

    return http.get('/products', {
        params: params
    });
};

// lấy sản phẩm
export const getProduct = (id) => http.get(`/products/${id}`);

//cập nhật sản phẩm
export const updateProduct = ({ productId, data }) => http.put(`/products/updateproduct/${productId}`, data);

//--------------------------------------------------------------- ORDER ---------------------------------------------------------------

// thêm giỏ hàng
export const addToCart = (userId, productId, quantity) => {
    return http.post(`/orders/add/${userId}`, {
        productId: productId,
        quantity: quantity
    });
};

// lấy order pending
export const getOderPending = (userId) => http.get(`/orders/orders/pending/${userId}`);

// lấy sản phẩm pending
export const getProductsPending = (userId) => http.get(`/orders/pending/${userId}`);

// đổi số lượng sản phẩm
export const updateProductQuantity = (userId, orderItemId, quantity) =>
    http.put(`/orders/update/${userId}/${orderItemId}`, {
        quantity: quantity
    });

// xóa sản phẩm khỏi order
export const deleteProduct = (userId, orderItemId) => http.delete(`/orders/remove/${userId}/${orderItemId}`);

// Xác nhận đơn
export const confirmOrder = (userId, paymentMethodId, deliveryMethodId) => {
    return http.post(`/orders/confirmorder/${userId}`, {
        paymentMethodId: paymentMethodId,
        deliveryMethodId: deliveryMethodId
    });
};

//lấy order
export const getUserOder = (userId, page, limit) => {
    return http.get(`/orders/getorders/${userId}`, {
        params: {
            page: page,
            limit: limit
        }
    });
};

// quản lý order
export const getOders = (page, limit) => {
    return http.get('/orders/getorders', {
        params: {
            page: page,
            limit: limit
        }
    });
};

//lấy order cùng sản phẩm
export const getOderDetails = (orderId) => http.get(`/orders/orderdetails/${orderId}`);

// cập nhật order
export const updateOderStatus = (orderId, deliStatus, payStatus) => {
    return http.put(`/orders/updateorderstatus/${orderId}`, {
        deliStatus: deliStatus,
        payStatus: payStatus
    });
};
