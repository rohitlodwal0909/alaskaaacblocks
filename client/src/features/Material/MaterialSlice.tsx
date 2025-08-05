import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  materialdata: [],
  signlematerial:[],
  addResult: null,  
  updateResult: null,
  deleteResult: null 
};

export const GetMaterial= createAsyncThunk(
  "GetMaterial /fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-material`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const GetMaterialSingle= createAsyncThunk(
  "GetMaterialSingle/getSingle",
  async (id:string, thunkAPI) => {
  
    try {
      const response = await axios.get(`${apiUrl}/material-signle/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user modules.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const addMaterial = createAsyncThunk(
  "Material/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/store-material`,
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

  export const updateMaterial = createAsyncThunk("Material/update", async (updatedUser:any) => {
  const response = await axios.put(
     `${apiUrl}/update-material/${updatedUser?.id}`,
    updatedUser,
    
  );
  return response.data;
});

export const deleteMaterial= createAsyncThunk(
  "Material/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-material/${userId}`);
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



const MaterialSlice = createSlice({
  name: "Material",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materialdata = action.payload;
      })
      .addCase(GetMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // single user
    .addCase(GetMaterialSingle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMaterialSingle.fulfilled, (state, action) => {
        state.loading = false;
        state.signlematerial = action.payload;
      })
      .addCase(GetMaterialSingle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD user
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(addMaterial.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // DELETE user
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default MaterialSlice.reducer;

