import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConsignmentState {
  senderDetails: object | null;
  receiverDetails: object | null;
  articleDetails: object | null;
  fareDetails: object | null;
  pickupDetails: object | null;
}

const initialState: ConsignmentState = {
  senderDetails: null,
  receiverDetails: null,
  articleDetails: null,
  fareDetails: null,
  pickupDetails: null,
};

const consignmentSlice = createSlice({
  name: "consignment",
  initialState,
  reducers: {
    setsenderDetails: (state, action: PayloadAction<object | null>) => {
      state.senderDetails = action.payload;
    },
    setreceiverDetails: (state, action: PayloadAction<object | null>) => {
      state.receiverDetails = action.payload;
    },
    setarticleDetails: (state, action: PayloadAction<object | null>) => {
      state.articleDetails = action.payload;
    },
    setfareDetails: (state, action: PayloadAction<object | null>) => {
      state.fareDetails = action.payload;
    },
    setpickupDetails: (state, action: PayloadAction<object | null>) => {
      state.pickupDetails = action.payload;
    },

    clearDetails: (state) => {
      state.senderDetails = null;
      state.receiverDetails = null;
      state.articleDetails = null;
      state.fareDetails = null;
      state.pickupDetails = null;
    },
  },
});

// Exporting the actions
export const {
  setsenderDetails,
  setreceiverDetails,
  setarticleDetails,
  setfareDetails,
  setpickupDetails,
  clearDetails,
} = consignmentSlice.actions;

// Exporting the reducer
export default consignmentSlice.reducer;
