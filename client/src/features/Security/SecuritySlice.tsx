import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  securitydata: [],
  signlesecurity:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetSecurity= createAsyncThunk(
  "GetSecurity /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-security`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetSecuritySingle= createAsyncThunk(
  "GetSecuritySingle/getSingle",
  async (id:string, thunkAPI) => {

    try {
      const response = await axios.get(`${apiUrl}/security-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addSecurity = createAsyncThunk(
  "Security/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-security`,
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

  export const updateSecurity = createAsyncThunk("Security/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-security/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteSecurity= createAsyncThunk(
  "Security/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-security/${userId}`);
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



const SecuritySlice = createSlice({
  name: "Security",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetSecurity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetSecurity.fulfilled, (state, action) => {
        state.loading = false;
        state.securitydata = action.payload;
      })
      .addCase(GetSecurity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetSecuritySingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetSecuritySingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signlesecurity = action.payload;
      })
      .addCase(GetSecuritySingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addSecurity.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addSecurity.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateSecurity.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateSecurity.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteSecurity.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteSecurity.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default SecuritySlice.reducer;

