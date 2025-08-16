import { createSlice } from "@reduxjs/toolkit";



interface PracticeState {
    currentPracticeDetails: any
    allPractionersAssociatedWithPractice: any,
    practiceAppointmentTypes: any,
    practionerAvailability:any,
    currentPractionerAvailability:any,
    practiceMembers: any,
}

const initialState: PracticeState = {
    currentPracticeDetails: null,
    allPractionersAssociatedWithPractice: [],
    practiceAppointmentTypes: [],
    practionerAvailability: [],
    currentPractionerAvailability: {},
    practiceMembers: [],
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
        },
        setPracticeMembers: (state, action) => {
            state.practiceMembers = action.payload
        },
        setPractionerAvailability: (state, action) => {
            state.practionerAvailability = action.payload
        },
        setCurrentPractionerAvailability: (state, action) => {
            state.currentPractionerAvailability = action.payload
        },
    }
})


export const {setCurrentPracticeDetails, setAllPractionersAssociatedWithPractice, setPracticeAppointmentTypes, setPracticeMembers, setPractionerAvailability, setCurrentPractionerAvailability} = slice.actions

export default slice.reducer;