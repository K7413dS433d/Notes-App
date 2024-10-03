import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const encode = "3b8ny__"; //encode token inside request

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

//get user notes
export const getUserNotes = createAsyncThunk(
  "notesSlice/getUserNotes",
  async (tkn, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        "https://note-sigma-black.vercel.app/api/v1/notes",
        {
          headers: {
            token: encode + tkn,
          },
        }
      );
      return data.notes;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

//add new note
export const addNewNote = createAsyncThunk(
  "notesSlice/addNewNote",
  async ({ note, token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "https://note-sigma-black.vercel.app/api/v1/notes",
        note,
        {
          headers: {
            token: encode + token,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notesSlice/deleteNote",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `https://note-sigma-black.vercel.app/api/v1/notes/${id}`,
        {
          headers: {
            token: encode + token,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

//update note
export const updateNote = createAsyncThunk(
  "notesSlice/updateNote",
  async ({ id, note, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `https://note-sigma-black.vercel.app/api/v1/notes/${id}`,
        note,
        {
          headers: {
            token: encode + token,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

const notesSlice = createSlice({
  name: "notesSlice",
  initialState,
  extraReducers: function (builder) {
    //get notes
    builder.addCase(getUserNotes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserNotes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getUserNotes.fulfilled, (state, action) => {
      state.loading = false;
      state.notes = action.payload;
    });
    //add note
    builder.addCase(addNewNote.pending, (state) => {
      state.error = null;
    });
    builder.addCase(addNewNote.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(addNewNote.fulfilled, (state, action) => {
      state.notes = [...state.notes, action.payload.note];
    });

    //delete note
    builder.addCase(deleteNote.pending, (state) => {
      state.error = null;
    });
    builder.addCase(deleteNote.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(deleteNote.fulfilled, (state, action) => {
      const noteID = action.meta.arg.id;
      state.notes = state.notes.filter((note) => note._id !== noteID);
    });

    //update note
    builder.addCase(updateNote.pending, (state) => {
      state.error = null;
    });
    builder.addCase(updateNote.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(updateNote.fulfilled, (state, action) => {
      state.notes = state.notes.map((note) =>
        note._id === action.payload.note._id ? action.payload.note : note
      );
    });
  },
});

export default notesSlice.reducer;
