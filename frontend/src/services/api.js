import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://pitcernia.ninja/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        // If successful, update the tokens
        localStorage.setItem("accessToken", response.data.access);

        // Update the authorization header
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.access}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const apiService = {
  // Auth endpoints
  register: (userData) => api.post("/auth/register/", userData),
  login: (credentials) => api.post("/auth/jwt/create/", credentials),
  activateAccount: (data) => api.post("/auth/users/activation/", data),
  getUserProfile: () => api.get("/auth/user/"),
  updateUserProfile: (profileData) => api.patch("/auth/user/", profileData),
  changePassword: (passwordData) =>
    api.post("/auth/password/change/", passwordData),
  changeEmail: (emailData) => api.post("/auth/email/change/", emailData),
  requestPasswordReset: (email) => api.post("/auth/password/reset/", { email }),
  resetPassword: (resetData) =>
    api.post("/auth/password/reset/confirm/", resetData),

  // Category endpoints
  getCategories: () => api.get("/menu/categories/"),

  // Pizza endpoints
  getPizzas: (params) => api.get("/menu/pizzas/", { params }),
  getPizzaBySlug: (slug) => api.get(`/menu/pizzas/${slug}/`),
  getFeaturedPizzas: () => api.get("/menu/pizzas/featured/"),

  // Topping endpoints
  getToppings: () => api.get("/menu/toppings/"),

  // Order endpoints
  createOrder: (orderData) => api.post("/orders/", orderData),
  getUserOrders: () => api.get("/orders/user/"),
  getOrderDetails: (orderId) => api.get(`/orders/${orderId}/`),
  trackOrder: (orderId, email) =>
    api.get(`/orders/track/?id=${orderId}&email=${encodeURIComponent(email)}`),

  // Address endpoints
  getUserAddresses: () => api.get("/addresses/"),
  createAddress: (addressData) => api.post("/addresses/", addressData),
  updateAddress: (addressId, addressData) =>
    api.put(`/addresses/${addressId}/`, addressData),
  deleteAddress: (addressId) => api.delete(`/addresses/${addressId}/`),

  // Review endpoints
  getPizzaReviews: (pizzaId) => api.get(`/reviews/pizza/${pizzaId}/`),
  createReview: (reviewData) => api.post("/reviews/", reviewData),
  updateReview: (reviewId, reviewData) =>
    api.put(`/reviews/${reviewId}/`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}/`),
};

export default apiService;
