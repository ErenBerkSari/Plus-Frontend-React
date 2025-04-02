import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getAllImages = createAsyncThunk(
  "gallery/getAllImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/gallery/getAllImages");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Resimler alınırken hata oluştu."
      );
    }
  }
);

export const addImage = createAsyncThunk(
  "gallery/addImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/gallery/uploadImage",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Resim yüklenirken hata oluştu."
      );
    }
  }
);

export const deleteImage = createAsyncThunk(
  "gallery/deleteImage",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/gallery/deleteImage/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Resim silinirken hata oluştu."
      );
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    images: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllImages.fulfilled, (state, action) => {
        state.images = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.images.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter((img) => img._id !== action.payload);
        state.isLoading = false;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default gallerySlice.reducer;
