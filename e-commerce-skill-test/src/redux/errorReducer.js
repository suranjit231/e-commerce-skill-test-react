// redux/errorReducer.js
import { createSlice } from "@reduxjs/toolkit";
import { mapFirebaseError } from "../utils/errorMaping";

const initialState = {
  errorMessage: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError(state, action) {

      console.log("error reducer is calling: ", action)
      let tryingValue =  mapFirebaseError(action.payload);

      console.log("tryingValue: ", tryingValue);
      state.errorMessage = tryingValue;
    },
    clearError(state) {
      state.errorMessage = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export const errorSelector = (state) => state.errorReducer;
export const errorReducer = errorSlice.reducer;
