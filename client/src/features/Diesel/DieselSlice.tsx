import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  dieseldata: [],
  signlediesel:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetDiesel= createAsyncThunk(
  "GetDiesel /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-diesel`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetDieselSingle= createAsyncThunk(
  "GetDieselSingle/getSingle",
  async (id:string, thunkAPI) => {
    console.log(id)
    try {
      const response = await axios.get(`${apiUrl}/diesel-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addDiesel = createAsyncThunk(
  "Diesel/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-diesel`,
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

  export const updateDiesel = createAsyncThunk("Diesel/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-diesel/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteDiesel= createAsyncThunk(
  "Diesel/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-diesel/${userId}`);
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



const DieselSlice = createSlice({
  name: "diesel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetDiesel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDiesel.fulfilled, (state, action) => {
        state.loading = false;
        state.dieseldata = action.payload;
      })
      .addCase(GetDiesel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetDieselSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDieselSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signlediesel = action.payload;
      })
      .addCase(GetDieselSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addDiesel.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addDiesel.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateDiesel.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateDiesel.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteDiesel.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteDiesel.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default DieselSlice.reducer;

