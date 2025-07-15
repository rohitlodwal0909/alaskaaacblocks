import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from '../src/features/authentication/AuthenticationSlice'
import UsermanagmentSlice from '../src/features/usermanagment/UsermanagmentSlice'
import LeadmanagmentSlice from '../src/features/leadmanagment/LeadmanagmentSlice'
import NotificationSlice from '../src/features/Notifications/NotificationSlice'
import BatchingSlice from '../src/features/batching/BatchingSlice'
import RisingSlice from '../src/features/Rising/RisingSlice'
import CuttingSlice from '../src/features/Cutting/CuttingSlice'
import AutoclaveSlice from '../src/features/Autoclave/AutoclaveSlice'
import SegregationSlice from '../src/features/Segregation/SegregationSlice'

export const store = configureStore({
  reducer: {
   authentication : AuthenticationSlice,
   usermanagement: UsermanagmentSlice,
   leadmanagement: LeadmanagmentSlice,
   notifications : NotificationSlice,
   batching: BatchingSlice,
   rising:RisingSlice,
   cutting:CuttingSlice,
   autoclave:AutoclaveSlice,
   segregation: SegregationSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;