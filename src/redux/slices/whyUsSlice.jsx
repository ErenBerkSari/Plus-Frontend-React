import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getWhyUs = createAsyncThunk(
  "whyUs/getWhyUs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/whyUs/getWhyUs`);
      console.log("Response:", response.data); // Konsola yazdır

      return response.data;
    } catch (error) {
      console.error("Hata:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateWhyUs = createAsyncThunk(
  "whyUs/updateWhyUs",
  async (whyUsData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/whyUs/updateWhyUs",
        whyUsData,
        {
          headers: {
            "Content-Type": "application/json", // JSON olduğunu belirt
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("WhyUs güncellenirken hata:", error);
      return rejectWithValue(
        error.response?.data?.message || "Bilinmeyen bir hata oluştu."
      );
    }
  }
);

const whyUsSlice = createSlice({
  name: "whyUs",
  initialState: {
    whyUs: {},
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWhyUs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWhyUs.fulfilled, (state, action) => {
        state.whyUs = action.payload;
        state.isLoading = false;
      })
      .addCase(getWhyUs.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateWhyUs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWhyUs.fulfilled, (state, action) => {
        state.whyUs = action.payload;
        state.isLoading = false;
      })
      .addCase(updateWhyUs.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
export const {} = whyUsSlice.actions;

export default whyUsSlice.reducer;
