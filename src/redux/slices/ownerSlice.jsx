import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getAllOwner = createAsyncThunk(
  "owner/getAllOwner",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/owner/getAllOwner`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Bilinmeyen bir hata oluştu."
      );
    }
  }
);

export const addOwner = createAsyncThunk(
  "owner/addOwner",
  async (ownerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/owner/addOwner", ownerData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Owner eklerken hata oluştu."
      );
    }
  }
);

export const deleteOwner = createAsyncThunk(
  "owner/deleteOwner",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/owner/deleteOwner/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Silme işlemi başarısız");
    }
  }
);

export const updateOwner = createAsyncThunk(
  "owner/updateOwner",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      // FormData doğrudan gönderilebilir, tekrar FormData oluşturmaya gerek yok

      const response = await axiosInstance.put(
        `/owner/updateOwner/${id}`,
        updatedData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      return rejectWithValue(
        error.response?.data || { message: "Güncelleme hatası oluştu" }
      );
    }
  }
);

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    owners: [],
    owner: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOwner.fulfilled, (state, action) => {
        state.owners = Array.isArray(action.payload)
          ? action.payload
          : Object.values(action.payload);
        state.isLoading = false;
      })
      .addCase(getAllOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addOwner.fulfilled, (state, action) => {
        state.owners.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteOwner.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteOwner.fulfilled, (state, action) => {
        state.owners = state.owners.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteOwner.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.owners.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.owners[index] = action.payload;
        }
      })
      .addCase(updateOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = ownerSlice.actions;
export default ownerSlice.reducer;
