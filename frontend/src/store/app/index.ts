import { createSlice } from "@reduxjs/toolkit";


interface AppState {
    isSidebarOpen: boolean;
}

const initialState: AppState = {
    isSidebarOpen: false,
}

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
    },
});

export const { setSidebarOpen } = slice.actions;

export default slice.reducer;