import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./Slices/loginSlice";
import registerReducer from "./Slices/registerSlice";
import notesReducer from "./Slices/notesSlice";

export const store = configureStore({
  //data to be shared
  reducer: {
    loginReducer,
    registerReducer,
    notesReducer,
  },
});
