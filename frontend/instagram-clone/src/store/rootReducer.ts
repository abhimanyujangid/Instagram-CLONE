import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  // Add other reducers here as you implement them
});

export default rootReducer;
