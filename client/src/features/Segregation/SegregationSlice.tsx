import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  segregationdata: [],
  signlesegregation:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetSegregation= createAsyncThunk(
  "GetSegregation /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-segregation`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetSegregationSingle= createAsyncThunk(
  "GetSegregationSingle/getSingle",
  async (id:string, thunkAPI) => {
    console.log(id)
    try {
      const response = await axios.get(`${apiUrl}/segregation-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addSegregation = createAsyncThunk(
  "Segregation/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-segregation`,
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

  export const updateSegregation = createAsyncThunk("Segregation/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-segregation/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteSegregation= createAsyncThunk(
  "Segregation/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-segregation/${userId}`);
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



const SegregationSlice = createSlice({
  name: "Segregation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetSegregation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetSegregation.fulfilled, (state, action) => {
        state.loading = false;
        state.segregationdata = action.payload;
      })
      .addCase(GetSegregation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetSegregationSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetSegregationSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signlesegregation = action.payload;
      })
      .addCase(GetSegregationSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addSegregation.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addSegregation.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateSegregation.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateSegregation.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteSegregation.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteSegregation.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default SegregationSlice.reducer;

