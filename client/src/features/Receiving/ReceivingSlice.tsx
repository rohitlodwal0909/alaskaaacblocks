import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  receivingdata: [],
  signlereceiving:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetReceiving= createAsyncThunk(
  "GetReceiving /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-receiving`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetReceivingSingle= createAsyncThunk(
  "GetReceivingSingle/getSingle",
  async (id:string, thunkAPI) => {
  
    try {
      const response = await axios.get(`${apiUrl}/receiving-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addReceiving = createAsyncThunk(
  "Receiving/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-receiving`,
        formdata );
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

  export const updateReceiving = createAsyncThunk("Receiving/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-receiving/${updatedUser?.id}`,
    updatedUser,
    
  );
  return response.data;
});

export const deleteReceiving= createAsyncThunk(
  "Receiving/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-receiving/${userId}`);
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



const ReceivingSlice = createSlice({
  name: "receiving",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetReceiving.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetReceiving.fulfilled, (state, action) => {
        state.loading = false;
        state.receivingdata = action.payload;
      })
      .addCase(GetReceiving.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetReceivingSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetReceivingSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signlereceiving = action.payload;
      })
      .addCase(GetReceivingSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addReceiving.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addReceiving.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateReceiving.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateReceiving.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteReceiving.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteReceiving.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default ReceivingSlice.reducer;

