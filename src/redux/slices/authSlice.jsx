import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials, {
        withCredentials: true,
      });
      const { userId, email, role, username } = response.data;

      return { userId, email, role, username };
    } catch (error) {
      console.error("Login işlemi sırasında hata: ", error);
      if (error.response) {
        return rejectWithValue(
          error.response.data.message || "Bilinmeyen bir hata oluştu."
        );
      } else if (error.request) {
        return rejectWithValue(
          "Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin."
        );
      } else {
        return rejectWithValue("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      return true; // Logout başarılıysa state'i sıfırlamak için true dönelim
    } catch (error) {
      console.log("Logout isteği başarısız", error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(
          "Çıkış işlemi başarısız oldu. Lütfen tekrar deneyin."
        );
      }
    }
  }
);
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/getAuthUser", {
        withCredentials: true, // Çerezdeki tokeni otomatik olarak backend'e gönderir
      });
      const { userId, role } = response.data;
      return { userId, role };
    } catch (error) {
      console.error("Kullanıcı bilgileri yüklenirken hata:", error);
      return rejectWithValue("Oturum bilgileri yüklenemedi.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
    authIsLoading: false,
    error: null,
  },
  reducers: {
    clearUserState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        state.authIsLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.authIsLoading = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.authIsLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        console.log("Logout başarılı");
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
        state.authIsLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.authIsLoading = true;
      })
      .addCase(logout.rejected, (state, action) => {
        console.log("Logout başarısız", action.payload);
        state.error = action.payload;
        state.authIsLoading = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
        state.authIsLoading = false;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload;
        state.authIsLoading = false;
      })
      .addCase(loadUser.pending, (state) => {
        state.authIsLoading = true;
      });
  },
});
export const { clearUserState } = authSlice.actions;
export default authSlice.reducer;
