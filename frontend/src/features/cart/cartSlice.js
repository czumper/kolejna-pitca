import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  items: [],
  total: 0,
};

// Helper function to calculate cart total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    const toppingsPrice = item.toppings.reduce((toppingSum, topping) => {
      return toppingSum + topping.price * item.quantity;
    }, 0);

    return sum + item.price * item.quantity + toppingsPrice;
  }, 0);
};

// Load cart from localStorage
const loadCart = () => {
  try {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : initialState;
  } catch (error) {
    console.error("Błąd wczytywania koszyka", error);
    return initialState;
  }
};

// Save cart to localStorage
const saveCart = (cart) => {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  } catch (error) {
    console.error("Błąd zapisu koszyka", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart(),
  reducers: {
    addItem: (state, action) => {
      const {
        pizza,
        size,
        price,
        quantity,
        toppings = [],
        specialInstructions = "",
      } = action.payload;

      // Check if this pizza with the same size and toppings already exists in cart
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.pizza.id === pizza.id &&
          item.size === size &&
          JSON.stringify(item.toppings.map((t) => t.id).sort()) ===
            JSON.stringify(toppings.map((t) => t.id).sort()) &&
          item.specialInstructions === specialInstructions
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        state.items[existingItemIndex].quantity += quantity;
        toast.info(`Zaktualizowano ilość ${pizza.name} (${size})`);
      } else {
        // Add new item
        state.items.push({
          id: Date.now().toString(),
          pizza,
          size,
          price,
          quantity,
          toppings,
          specialInstructions,
        });
        toast.success(`Dodano ${pizza.name} (${size}) do koszyka`);
      }

      // Update total
      state.total = calculateTotal(state.items);

      // Save to localStorage
      saveCart(state);
    },

    removeItem: (state, action) => {
      const { id } = action.payload;
      const removedItem = state.items.find((item) => item.id === id);

      if (removedItem) {
        state.items = state.items.filter((item) => item.id !== id);
        state.total = calculateTotal(state.items);
        toast.info(`Usunięto ${removedItem.pizza.name} z koszyka`);

        // Save to localStorage
        saveCart(state);
      }
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.quantity = quantity;
        state.total = calculateTotal(state.items);

        // Save to localStorage
        saveCart(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;

      // Save to localStorage
      saveCart(state);
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
