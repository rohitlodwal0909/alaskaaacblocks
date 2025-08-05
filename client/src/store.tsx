import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from '../src/features/authentication/AuthenticationSlice'
import UsermanagmentSlice from '../src/features/usermanagment/UsermanagmentSlice'
import LeadmanagmentSlice from '../src/features/leadmanagment/LeadmanagmentSlice'
import NotificationSlice from '../src/features/Notifications/NotificationSlice'
import BatchingSlice from '../src/features/batching/BatchingSlice'
import RisingSlice from '../src/features/Rising/RisingSlice'
import CuttingSlice from '../src/features/Cutting/CuttingSlice'
import AutoclaveSlice from '../src/features/Autoclave/AutoclaveSlice'
import DispatchSlice from '../src/features/Dispatch/DispatchSlice'
import SegregationSlice from '../src/features/Segregation/SegregationSlice'
import BoilerSlice from '../src/features/Boiler/BoilerSlice'
import ROwaterSlice from '../src/features/RO-water/ROwaterSlice'
import DieselSlice from '../src/features/Diesel/DieselSlice'
import SecuritySlice from '../src/features/Security/SecuritySlice'
import ReceivingSlice from '../src/features/Receiving/ReceivingSlice'
import MaterialSlice from '../src/features/Material/MaterialSlice'

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
   segregation:SegregationSlice,
   boiler:BoilerSlice,
   rowater:ROwaterSlice,
   diesel:DieselSlice,
   security:SecuritySlice,
   dispatch: DispatchSlice,
    material: MaterialSlice,
    receiving: ReceivingSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;