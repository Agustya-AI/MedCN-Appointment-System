import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user"
import appReducer from "./app"

export const store = configureStore({
    reducer: {
        userService: userReducer,
        appService: appReducer
    }
})


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;