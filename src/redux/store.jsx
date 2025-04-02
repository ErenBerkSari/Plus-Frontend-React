import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import heroReducer from "./slices/heroSlice";
import aboutReducer from "./slices/aboutSlice";
import whyUsReducer from "./slices/whyUsSlice";
import menuReducer from "./slices/menuSlice";
import galleryReducer from "./slices/gallerySlice";
import ownerReducer from "./slices/ownerSlice";
import contactReducer from "./slices/contactSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hero: heroReducer,
    about: aboutReducer,
    whyUs: whyUsReducer,
    menu: menuReducer,
    owner: ownerReducer,
    gallery: galleryReducer,
    contact: contactReducer,
  },
});
