import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//isolate localStorage interactions
const saveToken = (token) => localStorage.setItem("token", token);
const getToken = () => localStorage.getItem("token");
const removeToken = () => localStorage.removeItem("token");

const initialState = {
  token: getToken(),
  loading: false,
  error: null,
  success: false,
};

export const login = createAsyncThunk(
  "loginSlice/login",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "https://note-sigma-black.vercel.app/api/v1/users/signIn",
        values
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      removeToken();
    },
  },
  extraReducers: function (builder) {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.success = true;
      saveToken(action.payload.token);
    });
  },
});

export default loginSlice.reducer;
export const { logout } = loginSlice.actions;
