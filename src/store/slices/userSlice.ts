/* eslint-disable @typescript-eslint/no-explicit-any */
// filepath: /home/angera/Projects/PetroFlow/petroflow_web/src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string | null;
  username: string | null;
  email: string | null;
  name: string | null;
  jobTitle: string | null;
  employmentType: string | null;
  department: string | null;
  role: string | null;
  organizationId: string | null;
  facilityId: string | null;
  organizationName: string | null;
  facilityName: string | null;
  address: string | null;
  town: string | null;
  phone: string | null;
  employeeNo: string | null;
}

const initialState: UserState = {
  userId: null,
  username: null,
  email: null,
  name: null,
  jobTitle: null,
  employmentType: null,
  department: null,
  role: null,
  organizationId: null,
  facilityId: null,
  organizationName: null,
  facilityName: null,
  address: null,
  town: null,
  phone: null,
  employeeNo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state: any, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUserData: () => initialState,
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;