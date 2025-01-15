import { createSlice } from "@reduxjs/toolkit";
import { getThemeFromStorage, saveThemeToStorage } from "./ThemeService";

interface ThemeState {
  currentTheme: string;
}

const initialState: ThemeState = {
  currentTheme: getThemeFromStorage(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      saveThemeToStorage(action.payload); 
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
