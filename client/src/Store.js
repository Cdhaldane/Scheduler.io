import { configureStore } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

// Define a slice for the time frame
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

export const selectedPersonnel = createSlice({
  name: "selectedPersonnel",
  initialState: {
    value: "",
  },
  reducers: {
    setPersonnel: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const availability = createSlice({
  name: "availability",
  initialState: {
    value: "false",
  },
  reducers: {
    setAvailability: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const organizationSettings = createSlice({
  name: "organizationSettings",
  initialState: {
    value: {},
  },
  reducers: {
    setOrganizationSettings: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTime } = timeFrame.actions;
export const { setPersonnel } = selectedPersonnel.actions;
export const { setAvailability } = availability.actions;
export const { setOrganizationSettings } = organizationSettings.actions;

export default configureStore({
  reducer: {
    timeFrame: timeFrame.reducer,
    selectedPersonnel: selectedPersonnel.reducer,
    availability: availability.reducer,
    organizationSettings: organizationSettings.reducer,
  },
});
