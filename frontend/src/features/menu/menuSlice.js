import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/api";

export const fetchCategories = createAsyncThunk(
  "menu/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Nie udało się pobrać kategorii"
      );
    }
  }
);

export const fetchPizzas = createAsyncThunk(
  "menu/fetchPizzas",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.getPizzas(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Nie udało się pobrać pizz"
      );
    }
  }
);

export const fetchFeaturedPizzas = createAsyncThunk(
  "menu/fetchFeaturedPizzas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getFeaturedPizzas();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Nie udało się pobrać wybranych pizz"
      );
    }
  }
);

export const fetchPizzaBySlug = createAsyncThunk(
  "menu/fetchPizzaBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await apiService.getPizzaBySlug(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Nie udało się pobrać pizzy"
      );
    }
  }
);

export const fetchToppings = createAsyncThunk(
  "menu/fetchToppings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getToppings();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Nie udało się pobrać składników"
      );
    }
  }
);

const initialState = {
  categories: [],
  pizzas: [],
  featuredPizzas: [],
  currentPizza: null,
  toppings: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearCurrentPizza: (state) => {
      state.currentPizza = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch pizzas
      .addCase(fetchPizzas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.loading = false;
        state.pizzas = action.payload;
      })
      .addCase(fetchPizzas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch featured pizzas
      .addCase(fetchFeaturedPizzas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedPizzas.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredPizzas = action.payload;
      })
      .addCase(fetchFeaturedPizzas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch pizza by slug
      .addCase(fetchPizzaBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPizzaBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPizza = action.payload;
      })
      .addCase(fetchPizzaBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch toppings
      .addCase(fetchToppings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchToppings.fulfilled, (state, action) => {
        state.loading = false;
        state.toppings = action.payload;
      })
      .addCase(fetchToppings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPizza } = menuSlice.actions;
export default menuSlice.reducer;
