import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import menuReducer from "../features/menu/menuSlice";
import ordersReducer from "../features/orders/ordersSlice";
import reviewsReducer from "../features/reviews/reviewsSlice";
import profileReducer from "../features/profile/profileSlice";
import addressReducer from "../features/addresses/addressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    profile: profileReducer,
    addresses: addressReducer,
  },
});

export default store;
