import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../services/api";
import { clearCart } from "../cart/cartSlice";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.createOrder(orderData);

      // Clear the cart after successful order
      dispatch(clearCart());

      toast.success("Twoje zamówienie zostało złożone pomyślnie!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        "Nie udało się złożyć zamówienia. Spróbuj ponownie.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Nie udało się pobrać zamówień"
      );
    }
  }
);

export const trackOrder = createAsyncThunk(
  "order/trackOrder",
  async ({ orderId, email }, { rejectWithValue }) => {
    try {
      const response = await apiService.trackOrder(orderId, email);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Nie udało się znaleźć zamówienia. Sprawdź numer zamówienia i adres e-mail.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  currentOrder: null,
  userOrders: [],
  trackedOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearTrackedOrder: (state) => {
      state.trackedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Track order
      .addCase(trackOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.trackedOrder = action.payload;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.trackedOrder = null;
      });
  },
});

export const { clearCurrentOrder, clearTrackedOrder } = orderSlice.actions;
export default orderSlice.reducer;
