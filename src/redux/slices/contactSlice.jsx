import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getContact = createAsyncThunk(
  "contact/getContact",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/contact/getContact`);

      return response.data;
    } catch (error) {
      console.error("Hata:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateContact = createAsyncThunk(
  "contact/updateContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/contact/updateContact",
        contactData,
        {
          headers: {
            "Content-Type": "application/json", // JSON olduğunu belirt
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("contact güncellenirken hata:", error);
      return rejectWithValue(
        error.response?.data?.message || "Bilinmeyen bir hata oluştu."
      );
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contact: {},
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContact.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.contact = action.payload;
        state.isLoading = false;
      })
      .addCase(getContact.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateContact.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.contact = action.payload;
        state.isLoading = false;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});
export const {} = contactSlice.actions;

export default contactSlice.reducer;
