import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from '../src/features/authentication/AuthenticationSlice'
import UsermanagmentSlice from '../src/features/usermanagment/UsermanagmentSlice'
import LeadmanagmentSlice from '../src/features/leadmanagment/LeadmanagmentSlice'

export const store = configureStore({
  reducer: {
   authentication : AuthenticationSlice,
   usermanagement: UsermanagmentSlice,
  leadmanagement: LeadmanagmentSlice
  }
});
