import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user"


export const store = configureStore({
    reducer: {
        userService: userReducer
    }
})


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;