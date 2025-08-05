import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  rowaterdata: [],
  signlerowater:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetROwater= createAsyncThunk(
  "GetRO-water /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-ro-water`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetROwaterSingle= createAsyncThunk(
  "GetRO-waterSingle/getSingle",
  async (id:string, thunkAPI) => {
    console.log(id)
    try {
      const response = await axios.get(`${apiUrl}/ro-water-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addROwater = createAsyncThunk(
  "RO-water/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-ro-water`,
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

  export const updateROwater = createAsyncThunk("ROwater/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-ro-water/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteROwater= createAsyncThunk(
  "ROwater/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-ro-water/${userId}`);
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



const ROwaterSlice = createSlice({
  name: "rowater",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetROwater.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetROwater.fulfilled, (state, action) => {
        state.loading = false;
        state.rowaterdata = action.payload;
      })
      .addCase(GetROwater.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetROwaterSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetROwaterSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signlerowater = action.payload;
      })
      .addCase(GetROwaterSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addROwater.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addROwater.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateROwater.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateROwater.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteROwater.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteROwater.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ROwaterSlice.reducer;

