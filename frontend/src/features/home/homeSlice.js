import { createSlice } from '@reduxjs/toolkit';
import {
    FURTHER_SEQ_STATE_ID,
    NEEDS_REVIEW_STATE_ID,
    PENDING_REQUESTS_STATE_ID,
    RECENT_DELIVERIES_STATE_ID,
    RECENT_RUNS_STATE_ID
} from '../../resources/constants';
import {
    getSeqAnalysisProjects,
    getRequestProjects,
    getRecentRuns
} from '../../services/igo-qc-service';

const initialState = {
    entities: {}
};

// Reducers
const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setNeedsReviewData(state, action) {
            const data = action.payload;
            const id = NEEDS_REVIEW_STATE_ID;
            state.entities[id] = data;
        },
        setFurtherSeqData(state, action) {
            const data = action.payload;
            const id = FURTHER_SEQ_STATE_ID;
            state.entities[id] = data;
        },
        setPendingRequestsData(state, action) {
            const data = action.payload;
            const id = PENDING_REQUESTS_STATE_ID;
            state.entities[id] = data;
        },
        setRecentDeliveriesData(state, action) {
            const data = action.payload;
            const id = RECENT_DELIVERIES_STATE_ID;
            state.entities[id] = data;
        },
        setRecentRunsData(state, action) {
            const data = action.payload;
            const id = RECENT_RUNS_STATE_ID;
            state.entities[id] = data;
        }
    }
});

export const {
    setNeedsReviewData,
    setFurtherSeqData,
    setPendingRequestsData,
    setRecentDeliveriesData,
    setRecentRunsData
} = homeSlice.actions;

export default homeSlice.reducer;

// Actions
export const getSeqData = () => async (dispatch) => {
    const response = await getSeqAnalysisProjects();
    const { projectsToReview, projectsToSequenceFurther, requestsPending } = response.data;
    dispatch(setNeedsReviewData(projectsToReview));
    dispatch(setFurtherSeqData(projectsToSequenceFurther));
    dispatch(setPendingRequestsData(requestsPending));
}

export const getRecentDeliveries = () => async (dispatch) => {
    const response = await getRequestProjects();
    const { recentDeliveries } = response.data;
    dispatch(setRecentDeliveriesData(recentDeliveries));
}

export const getRecentRunsData = () => async (dispatch) => {
    const response = await getRecentRuns();
    const { recentRuns } = response.data;
    dispatch(setRecentRunsData(recentRuns));
}

// Selectors
const selectHomeEntities = (state) => state.home.entities;

export const selectNeedsReviewData = (state) => {
    return selectHomeEntities(state)[NEEDS_REVIEW_STATE_ID];
}
export const selectFurtherSeqData = (state) => {
    return selectHomeEntities(state)[FURTHER_SEQ_STATE_ID];
}
export const selectPendingRequestsData = (state) => {
    return selectHomeEntities(state)[PENDING_REQUESTS_STATE_ID];
}
export const selectRecentDeliveriesData = (state) => {
    return selectHomeEntities(state)[RECENT_DELIVERIES_STATE_ID];
}
export const selectRecentRunsData = (state) => {
    return selectHomeEntities(state)[RECENT_RUNS_STATE_ID];
}
