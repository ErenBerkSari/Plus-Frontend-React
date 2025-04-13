import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getAbout = createAsyncThunk(
  "about/getAbout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/about/getAbout`);

      return response.data;
    } catch (error) {
      console.error("Hata:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAbout = createAsyncThunk(
  "about/updateAbout",
  async (aboutData, { rejectWithValue }) => {
    try {
      // aboutList formatını kontrol et
      if (aboutData.has("aboutList")) {
        const aboutList = aboutData.get("aboutList");
        if (typeof aboutList === "string") {
          // JSON.parse kullanarak gelen string'i dizi haline getir
          try {
            const parsedList = JSON.parse(aboutList);
            aboutData.set("aboutList", parsedList);
          } catch (e) {
            console.warn("aboutList JSON parse error:", e);
          }
        }
      }

      const response = await axiosInstance.put(
        "/about/updateAbout",
        aboutData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("About güncellenirken hata:", error);
      return rejectWithValue(
        error.response?.data?.message || "Bilinmeyen bir hata oluştu."
      );
    }
  }
);

const aboutSlice = createSlice({
  name: "about",
  initialState: {
    about: {},
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAbout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAbout.fulfilled, (state, action) => {
        state.about = action.payload;
        state.isLoading = false;
      })
      .addCase(getAbout.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateAbout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAbout.fulfilled, (state, action) => {
        state.about = action.payload;
        state.isLoading = false;
      })
      .addCase(updateAbout.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default aboutSlice.reducer;
