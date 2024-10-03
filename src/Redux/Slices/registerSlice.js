import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

export const register = createAsyncThunk(
  "registerSlice/register",
  async (values, { rejectWithValue }) => {
    try {
      await axios.post(
        "https://note-sigma-black.vercel.app/api/v1/users/signUp",
        values
      );
    } catch (error) {
      return rejectWithValue(error.response.data.msg); // Send the server error message
    }
  }
);

const registerSlice = createSlice({
  name: "registerSlice",
  initialState,
  extraReducers: function (builder) {
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });

    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    });
  },
});

//export reducers for store
export default registerSlice.reducer;
