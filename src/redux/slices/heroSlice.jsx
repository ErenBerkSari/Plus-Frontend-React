import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getHero = createAsyncThunk(
  "hero/getHero",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/hero/getHero`);
      console.log("Response:", response.data); // Konsola yazdır

      return response.data;
    } catch (error) {
      console.error("Hata:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateHero = createAsyncThunk(
  "hero/updateHero",
  async (heroData, { rejectWithValue }) => {
    try {
      // heroData is already a FormData object from the component
      const response = await axiosInstance.put("/hero/updateHero", heroData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      console.error("Hero güncellenirken hata:", error);
      return rejectWithValue(
        error.response?.data?.message || "Bilinmeyen bir hata oluştu."
      );
    }
  }
);

const heroSlice = createSlice({
  name: "hero",
  initialState: {
    hero: {},
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHero.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHero.fulfilled, (state, action) => {
        state.hero = action.payload;
        state.isLoading = false;
      })
      .addCase(getHero.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateHero.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateHero.fulfilled, (state, action) => {
        state.hero = action.payload;
        state.isLoading = false;
      })
      .addCase(updateHero.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
export const {} = heroSlice.actions;

export default heroSlice.reducer;
