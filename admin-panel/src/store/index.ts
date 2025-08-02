import { configureStore } from "@reduxjs/toolkit";
import practiceReducer from "./practice"

export const store = configureStore({
    reducer: {
        practiceService: practiceReducer
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
