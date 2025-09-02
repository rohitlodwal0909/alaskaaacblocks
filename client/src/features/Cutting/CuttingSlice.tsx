import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  cuttingdata: [],         
  risingdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetCutting= createAsyncThunk(
  "GetCutting /fetch",
  async (id:any, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-cutting/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const GetRisingdate= createAsyncThunk(
  "GetRising /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-risingdate`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);



export const addCutting = createAsyncThunk(
  "Cutting/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-cutting`,
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

  export const updateCutting = createAsyncThunk("Cutting/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-cutting/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteCutting= createAsyncThunk(
  "Cutting/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-cutting/${userId}`);
      return userId; // success
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "Failed to delete user");
      } else {
        return rejectWithValue(error.message || "Failed to delete user");
      }
    }
  }
);



const CuttingSlice = createSlice({
  name: "cutting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetCutting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCutting.fulfilled, (state, action) => {
        state.loading = false;
        state.cuttingdata = action.payload;
      })
      .addCase(GetCutting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(GetRisingdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetRisingdate.fulfilled, (state, action) => {
        state.loading = false;
        state.risingdata = action.payload;
      })
      .addCase(GetRisingdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(addCutting.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addCutting.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateCutting.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateCutting.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteCutting.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteCutting.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default CuttingSlice.reducer;

