import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../services/api";
import { clearCart } from "../cart/cartSlice";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.createOrder(orderData);
      dispatch(clearCart());
      toast.success("Twoje zamówienie zostało złożone pomyślnie!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.items?.[0]?.size?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
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
      console.log("fetchUserOrders response:", response.data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Nie udało się pobrać zamówień";
      console.log("fetchUserOrders error:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await apiService.getOrderDetails(orderId);
      console.log("fetchOrderDetails response:", response.data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        "Nie udało się pobrać szczegółów zamówienia";
      console.log("fetchOrderDetails error:", errorMessage);
      return rejectWithValue(errorMessage);
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

const ordersSlice = createSlice({
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
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentOrder = null;
      })
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

export const { clearCurrentOrder, clearTrackedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
