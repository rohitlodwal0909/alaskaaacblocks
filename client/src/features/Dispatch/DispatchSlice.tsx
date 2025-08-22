import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  dispatchdata: [],
  signledispatch:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetDispatch= createAsyncThunk(
  "GetDispatch /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-dispatch`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetDispatchSingle= createAsyncThunk(
  "GetDispatchSingle/getSingle",
  async (id:string, thunkAPI) => {
  
    try {
      const response = await axios.get(`${apiUrl}/dispatch-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addDispatch = createAsyncThunk(
  "Dispatch/add",
  async (formdata:any, { rejectWithValue }) => {
   console.log (formdata )
       try {
      const response = await axios.post(`${apiUrl}/store-dispatch`,
        formdata , {
         headers: {
    'Content-Type': 'multipart/form-data',
  },
      });
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
         error || error.response?.data?.message ||"Something went wrong"
      );
    }
  }
);

  export const updateDispatch = createAsyncThunk("Dispatch/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-dispatch/${updatedUser?.id}`,
    updatedUser,
     {
         headers: {
    'Content-Type': 'multipart/form-data',
  },
      }

  );
  return response.data;
});

export const deleteDispatch= createAsyncThunk(
  "Dispatch/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-dispatch/${userId}`);
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



const DispatchSlice = createSlice({
  name: "Dispatch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetDispatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDispatch.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatchdata = action.payload;
      })
      .addCase(GetDispatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetDispatchSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDispatchSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signledispatch = action.payload;
      })
      .addCase(GetDispatchSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addDispatch.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addDispatch.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateDispatch.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateDispatch.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteDispatch.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteDispatch.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default DispatchSlice.reducer;

