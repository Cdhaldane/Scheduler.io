import { configureStore } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export const timeFrame = createSlice({
  name: "timeFrame",
  initialState: {
    value: "Week",
  },
  reducers: {
    setTime: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTime } = timeFrame.actions;

export default configureStore({
  reducer: { timeFrame: timeFrame.reducer },
});
