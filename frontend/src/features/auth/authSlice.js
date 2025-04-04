import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../services/api";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Get user profile
      const userResponse = await apiService.getUserProfile();
      return userResponse.data;
    } catch (error) {
      const message =
        error.response?.data?.detail || "Logowanie nieudane. Spróbuj ponownie";
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.register(userData);
      return response.data;
    } catch (error) {
      console.log("Szczegóły błędu rejestracji:", error.response);
      const message =
        error.response?.data || "Rejestracja nieudana. Spróbuj ponownie";
      return rejectWithValue(message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return rejectWithValue("Nieznaleziony token");
      }

      const response = await apiService.getUserProfile();
      return response.data;
    } catch (error) {
      // If error, remove tokens to be safe
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue("Błąd weryfikacji");
    }
  }
);

export const updateUserProfile = createAsyncThunk( // Zmieniono z updateProfile na updateUserProfile
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserProfile(profileData);
      toast.success("Profil zaktualizowany!");
      return response.data;
    } catch (error) {
      const message = error.response?.data || "Błąd aktualizacji profilu";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      await apiService.changePassword(passwordData);
      toast.success("Hasło zmienione pomyślnie");
      return true;
    } catch (error) {
      const message = error.response?.data || "Błąd zmiany hasła";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const changeEmail = createAsyncThunk(
  "auth/changeEmail",
  async (emailData, { rejectWithValue }) => {
    try {
      await apiService.changeEmail(emailData);
      toast.success(
        "Zmień adres e-mail pomyślnie. Potwierdź nowy adres e-mail"
      );
      return true;
    } catch (error) {
      const message = error.response?.data || "Błąd zmiany adresu e-mail";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return null;
});

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Update profile
      .addCase(updateUserProfile.pending, (state) => { // Zmieniono na updateUserProfile
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => { // Zmieniono na updateUserProfile
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => { // Zmieniono na updateUserProfile
        state.loading = false;
        state.error = action.payload;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Change email
      .addCase(changeEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, resetRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;