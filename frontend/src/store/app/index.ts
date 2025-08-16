import { createSlice } from "@reduxjs/toolkit";


interface AppState {
    isSidebarOpen: boolean;
    all_practices: any[];
    
}

const initialState: AppState = {
    isSidebarOpen: false,
    all_practices: [],
}

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSidebarOpen: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        setAllPractices: (state, action) => {
            state.all_practices = action.payload;
        },
    },
});

export const { setSidebarOpen, setAllPractices } = slice.actions;

export default slice.reducer;