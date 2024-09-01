import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
 
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = true;
      
    },
    clearLoading(state) {
      state.loading = false;
     
    },
  },
});

export const loadingReducer = loadingSlice.reducer;
export const { setLoading, clearLoading } = loadingSlice.actions;
export const loadingSelector = (state) => state.loadingReducer;
