import { createSlice } from "@reduxjs/toolkit";



interface PracticeState {
    currentPracticeDetails: any
    allPractionersAssociatedWithPractice: any,
    practiceAppointmentTypes: any,
    practionerAvailability:any,
    currentPractionerAvailability:any,
}

const initialState: PracticeState = {
    currentPracticeDetails: null,
    allPractionersAssociatedWithPractice: [],
    practiceAppointmentTypes: [],
    practionerAvailability: [],
    currentPractionerAvailability: {}
}


const slice = createSlice({
    name: "practice",
    initialState,
    reducers: {
        setCurrentPracticeDetails: (state, action) => {
            state.currentPracticeDetails = action.payload
        },
        setAllPractionersAssociatedWithPractice: (state, action) => {
            state.allPractionersAssociatedWithPractice = action.payload
        },
        setPracticeAppointmentTypes: (state, action) => {
            state.practiceAppointmentTypes = action.payload
        }
    }
})


export const {setCurrentPracticeDetails, setAllPractionersAssociatedWithPractice, setPracticeAppointmentTypes} = slice.actions

export default slice.reducer;