import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slices/userDataSlice";
import consignmentReducer from "./slices/consignmentSlice";

const store = configureStore({
  reducer: {
    userData: dataReducer,
    consignment: consignmentReducer,
  },
});

export default store;
