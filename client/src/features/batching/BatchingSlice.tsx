import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  batchingdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetBatching = createAsyncThunk(
  "GetBatching/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-all-batching`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addBatching = createAsyncThunk(
  "addBatching/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create-batching`,
        formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response.data.error || error.message || "Something went wrong"
      );
    }
  }
);

 export const updateBatching = createAsyncThunk(
  "updateBatching/update",
  async (updatedUser: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-batching/${updatedUser?.id}`,
        updatedUser
      );
      return response.data;
    } catch (error: any) {
      // Extract server error message
     const message =
        error?.response?.data?.message ||  // <-- your backend should send this
        error?.response?.data?.error ||    // optional fallback
        error?.message || 
        "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

export const deleteBatching = createAsyncThunk(
  "deleteBatching/delete",
  async (userId: string | number, { rejectWithValue }) => {
  
    try {
      await axios.delete(`${apiUrl}/delete-batching/${userId}`);
      return userId; // success
    } catch (error: any) {
      // If the error has a response from server
      if (error.response && error.response.data) {
        // return the error message from server response
        return rejectWithValue(error.response.data.message || "Failed to delete user");
      } else {
        // generic error message
        return rejectWithValue(error.message || "Failed to delete user");
      }
    }
  }
);



const BatchingSlice = createSlice({
  name: "batching",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetBatching.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetBatching.fulfilled, (state, action) => {
        state.loading = false;
        state.batchingdata = action.payload;
      })
      .addCase(GetBatching.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addBatching.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addBatching.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateBatching.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateBatching.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteBatching.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteBatching.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default BatchingSlice.reducer;

