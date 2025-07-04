import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from '../src/features/authentication/AuthenticationSlice'
import UsermanagmentSlice from '../src/features/usermanagment/UsermanagmentSlice'
import LeadmanagmentSlice from '../src/features/leadmanagment/LeadmanagmentSlice'
import NotificationSlice from '../src/features/Notifications/NotificationSlice'

export const store = configureStore({
  reducer: {
   authentication : AuthenticationSlice,
   usermanagement: UsermanagmentSlice,
   leadmanagement: LeadmanagmentSlice,
   notifications : NotificationSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;