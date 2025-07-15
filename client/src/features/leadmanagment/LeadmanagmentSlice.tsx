import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {apiUrl  }from '../../constants/contant'

const initialState = {
  loading: false,
  error: null,
  leadsdata: [],         
  addResult: null,  
  updateResult: null,
  deleteResult: null ,
  getnotesData:null
};

export const GetLeads = createAsyncThunk(
  "GetLeads/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/get-all-leads`);
      return response.data;
    } catch (error) {
      // Optional: Customize error message
      const errorMessage = error.response?.data?.message || "Failed to fetch leads.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);


export const CreateLeads = createAsyncThunk(
  "CreateLeads/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create-lead`,
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

type LeadUpdatePayload = {
  id: any;
  status?: any;
  // Add other optional fields here if needed
  [key: string]: any;
};
export const UpdateLeads =  createAsyncThunk<
  any, // or a specific return type if you know it
  LeadUpdatePayload,
  { rejectValue: string }
>(
  "Leads/update",
  async (updatedUser, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-leads/${updatedUser?.id}`,
        updatedUser
      );
      return response.data;
    } catch (error) {
      // Return a meaningful error message
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const DeleteLeads = createAsyncThunk(
  "users/delete",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/delete-leads/${userId}`);
      return userId; // success
    } catch (error: any) {
      // If the error has a response from server
      if (error.response && error.response.data) {
        // return the error message from server response
        return rejectWithValue(error.response.data.message || "Failed to delete user");
      } else {
        // generic error message
        return rejectWithValue(error.message || "Failed to delete user");
      }
    }
  }
);
export const StatuschangeLeads = createAsyncThunk<
  any, // or a specific return type if you know it
  LeadUpdatePayload,
  { rejectValue: string }
>(
  "Leads/update",
  async ({status,id}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/update-status/${id}/${status}`,
        
      );
      return response.data;
    } catch (error) {
      // Return a meaningful error message
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const FollowupLeads = createAsyncThunk(
  "FollowupLeads/add",
  async (formdata:any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/add-lead-notes`,
        formdata);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);export const GetFollowupLeads = createAsyncThunk<
  any, 
  string, 
  { rejectValue: string }
>(
  "GetFollowupLeads/add",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/get-leads-notes/${id}`);
      return response.data;
    } catch (error) {
      // Return a rejected action containing the error message
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);


const LeadmanagmentSlice = createSlice({
  name: "leadmanagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET users
      .addCase(GetLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leadsdata = action.payload;
      })
      .addCase(GetLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD user
      .addCase(CreateLeads.fulfilled, (state, action) => {
        state.addResult = action.payload;
      })
      .addCase(CreateLeads.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE user
      .addCase(UpdateLeads.fulfilled, (state, action) => {
        state.updateResult = action.payload;
      })
      .addCase(UpdateLeads.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(GetFollowupLeads.fulfilled, (state, action) => {
        state.getnotesData = action.payload;
      })
      .addCase(GetFollowupLeads.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // DELETE user
      .addCase(DeleteLeads.fulfilled, (state, action) => {
        state.deleteResult = action.payload;
      })
      .addCase(DeleteLeads.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default LeadmanagmentSlice.reducer;

