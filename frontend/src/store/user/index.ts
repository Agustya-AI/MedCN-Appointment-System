
import { createSlice } from "@reduxjs/toolkit"


interface UserState {
    userDetails: any,
}


const initialState: UserState = {
    userDetails: {}
}

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUserDetails: (state, action) => {
            state.userDetails = action.payload
        }
    }
})

export const {setCurrentUserDetails} = slice.actions

export default slice.reducer