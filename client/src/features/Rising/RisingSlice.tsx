import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  risingdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetRising = createAsyncThunk(
  "GetRising /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-rising`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const addRising = createAsyncThunk(
  "Rising/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-rising`,
        formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

  export const updateRising = createAsyncThunk("Rising/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-rising/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteRising = createAsyncThunk(
  "Rising/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-rising/${userId}`);
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



const RisingSlice = createSlice({
  name: "rising",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetRising.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetRising.fulfilled, (state, action) => {
        state.loading = false;
        state.risingdata = action.payload;
      })
      .addCase(GetRising.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addRising.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addRising.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateRising.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateRising.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteRising.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteRising.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default RisingSlice.reducer;

