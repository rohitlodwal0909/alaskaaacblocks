import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  boilerdata: [],
  signleboiler:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetBoiler= createAsyncThunk(
  "GetBoiler /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-boiler`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetBoilerSingle= createAsyncThunk(
  "GetBoilerSingle/getSingle",
  async (id:string, thunkAPI) => {
    console.log(id)
    try {
      const response = await axios.get(`${apiUrl}/boiler-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addBoiler = createAsyncThunk(
  "Boiler/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-boiler`,
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

  export const updateBoiler = createAsyncThunk(
  "Boiler/update",
  async (updatedUser: any, { rejectWithValue }) => {
  
    try {
      const response = await axios.put(
        `${apiUrl}/update-boiler/${updatedUser?.id}`,
        updatedUser
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

export const deleteBoiler= createAsyncThunk(
  "Boiler/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-boiler/${userId}`);
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


const BoilerSlice = createSlice({
  name: "Boiler",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetBoiler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetBoiler.fulfilled, (state, action) => {
        state.loading = false;
        state.boilerdata = action.payload;
      })
      .addCase(GetBoiler.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetBoilerSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetBoilerSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signleboiler = action.payload;
      })
      .addCase(GetBoilerSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addBoiler.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addBoiler.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateBoiler.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateBoiler.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteBoiler.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteBoiler.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default BoilerSlice.reducer;

