import { createSlice } from "@reduxjs/toolkit";

const initialToolState = {
  listLoading: false,
  actionsLoading: false,
  data: [],
  error: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const toolListSlice = createSlice({
  name: "tools",
  initialState: initialToolState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    // Tools Fetched
    toolsFetched: (state, action) => {
      const { entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.data = entities;
    },

    //Tools Created
    toolsCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
    },
  },
});
