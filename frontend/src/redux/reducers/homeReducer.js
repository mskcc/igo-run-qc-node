import {
    SET_NEEDS_REVIEW,
    SET_REQUIRES_FURTHER_SEQUENCING,
    SET_AWAITING_FURTHER_ACTION,
    SET_RECENT_DELIVERIES,
    SET_RECENT_RUNS
} from "../actionTypes";
import { createSlice } from '@reduxjs/toolkit'

const initialState = {};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        
    }
})


const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NEEDS_REVIEW: 
            return {
                ...state,
                needs_review: action.payload
            };
        case SET_REQUIRES_FURTHER_SEQUENCING: 
            return {
                ...state,
                requires_further_seq: action.payload
            };
        case SET_AWAITING_FURTHER_ACTION: 
            return {
                ...state,
                awaiting_further_action: action.payload
            };
        case SET_RECENT_DELIVERIES: 
            return {
                ...state,
                recent_deliveries: action.payload
            };
        case SET_RECENT_RUNS: 
            return {
                ...state,
                recent_runs: action.payload
            };
        default: {
            return state;
        }
    }
};

export default homeReducer;