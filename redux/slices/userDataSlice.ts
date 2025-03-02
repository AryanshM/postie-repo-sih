import api from "@/hooks/api/retrievToken";
import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

export const fetchData = createAsyncThunk("data/fetchData", async () => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  const response = await api.get("/employee/get_employee_details/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response?.data;
});

interface UserDataState {
  data: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserDataState = {
  data: [],
  status: "idle",
  error: null,
};

const dataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: { resetUserData: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        if (JSON.stringify(state.data) !== JSON.stringify(action.payload)) {
          state.data = action.payload;
        }
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { resetUserData } = dataSlice.actions;

export default dataSlice.reducer;
