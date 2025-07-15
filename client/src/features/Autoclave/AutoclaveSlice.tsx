import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  autoclavedata: [],
  signleautoclave:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetAutoclave= createAsyncThunk(
  "GetAutoclave /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-autoclave`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetAutoclaveSingle= createAsyncThunk(
  "GetAutoclaveSingle/getSingle",
  async (id:string, thunkAPI) => {
    console.log(id)
    try {
      const response = await axios.get(`${apiUrl}/autoclave-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addAutoclave = createAsyncThunk(
  "Autoclave/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-autoclave`,
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

  export const updateAutoclave = createAsyncThunk("Autoclave/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-autoclave/${updatedUser?.id}`,
    updatedUser
  );
  return response.data;
});

export const deleteAutoclave= createAsyncThunk(
  "Autoclave/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-autoclave/${userId}`);
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



const AutoclaveSlice = createSlice({
  name: "Autoclave",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetAutoclave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAutoclave.fulfilled, (state, action) => {
        state.loading = false;
        state.autoclavedata = action.payload;
      })
      .addCase(GetAutoclave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetAutoclaveSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAutoclaveSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signleautoclave = action.payload;
      })
      .addCase(GetAutoclaveSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addAutoclave.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addAutoclave.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateAutoclave.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateAutoclave.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteAutoclave.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteAutoclave.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default AutoclaveSlice.reducer;

