import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";
import { toast } from "react-toastify";

export const fetchUserAddresses = createAsyncThunk(
  "addresses/fetchUserAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserAddresses();
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Nie udało się pobrać adresów";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createAddress = createAsyncThunk(
  "addresses/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await apiService.createAddress(addressData);
      toast.success("Adres dodany pomyślnie!");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Nie udało się dodać adresu";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  addresses: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        // Upewniamy się, że action.payload jest tablicą
        state.addresses = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        // Upewniamy się, że state.addresses jest tablicą przed użyciem .push
        if (!Array.isArray(state.addresses)) {
          state.addresses = [];
        }
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
