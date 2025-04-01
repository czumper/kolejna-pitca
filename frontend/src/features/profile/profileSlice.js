import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";

// Async thunk do pobierania profilu użytkownika
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get("/account"); // Endpoint backendu
      return response.data; // Zakładamy, że backend zwraca dane profilu
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Nie udało się pobrać profilu użytkownika"
      );
    }
  }
);

// Async thunk do pobierania adresów użytkownika
export const fetchUserAddresses = createAsyncThunk(
    "profile/fetchUserAddresses",
    async (_, { rejectWithValue }) => {
      try {
        const response = await apiService.get("/addresses"); // Endpoint backendu
        return response.data; // Zakładamy, że backend zwraca listę adresów
      } catch (error) {
        return rejectWithValue(
          error.response?.data || "Nie udało się pobrać adresów użytkownika"
        );
      }
    }
  );
  
  // Async thunk do dodawania nowego adresu
  export const addAddress = createAsyncThunk(
    "profile/addAddress",
    async (addressData, { rejectWithValue }) => {
      try {
        const response = await apiService.post("/addresses", addressData); // Endpoint backendu
        return response.data; // Zakładamy, że backend zwraca nowo dodany adres
      } catch (error) {
        return rejectWithValue(
          error.response?.data || "Nie udało się dodać adresu"
        );
      }
    }
  );
  
  // Async thunk do usuwania adresu
  export const deleteAddress = createAsyncThunk(
    "profile/deleteAddress",
    async (addressId, { rejectWithValue }) => {
      try {
        await apiService.delete(`/addresses/${addressId}`); // Endpoint backendu
        return addressId; // Zwracamy ID usuniętego adresu
      } catch (error) {
        return rejectWithValue(
          error.response?.data || "Nie udało się usunąć adresu"
        );
      }
    }
  );
  
  // Async thunk do ustawiania domyślnego adresu
  export const setDefaultAddress = createAsyncThunk(
    "profile/setDefaultAddress",
    async (addressId, { rejectWithValue }) => {
      try {
        const response = await apiService.patch(`/addresses/${addressId}/default`); // Endpoint backendu
        return response.data; // Zakładamy, że backend zwraca zaktualizowany adres
      } catch (error) {
        return rejectWithValue(
          error.response?.data || "Nie udało się ustawić domyślnego adresu"
        );
      }
    }
  );
  
  // Zaktualizowany stan początkowy
  const initialState = {
    profile: null, // Dane profilu użytkownika
    addresses: [], // Lista adresów użytkownika
    loading: false, // Status ładowania
    error: null, // Błędy podczas pobierania
  };
  
  // Slice
  const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
      // Możesz dodać dodatkowe akcje, jeśli będą potrzebne
    },
    extraReducers: (builder) => {
      builder
        // Obsługa profilu użytkownika
        .addCase(fetchUserProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.profile = action.payload;
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
        // Obsługa adresów użytkownika
        .addCase(fetchUserAddresses.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserAddresses.fulfilled, (state, action) => {
          state.loading = false;
          state.addresses = action.payload;
        })
        .addCase(fetchUserAddresses.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(addAddress.fulfilled, (state, action) => {
          state.addresses.push(action.payload);
        })
        .addCase(deleteAddress.fulfilled, (state, action) => {
          state.addresses = state.addresses.filter(
            (address) => address.id !== action.payload
          );
        })
        .addCase(setDefaultAddress.fulfilled, (state, action) => {
          state.addresses = state.addresses.map((address) =>
            address.id === action.payload.id
              ? { ...address, is_default: true }
              : { ...address, is_default: false }
          );
        });
    },
  });
  
  export default profileSlice.reducer;