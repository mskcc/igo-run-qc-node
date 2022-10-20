import { createSlice } from '@reduxjs/toolkit';
import { FURTHER_SEQ_STATE_ID, NEEDS_REVIEW_STATE_ID, PENDING_REQUESTS_STATE_ID } from '../../resources/constants';
import { getSeqAnalysisProjects } from '../../services/igo-qc-service';

const initialState = {
    entities: {}
};

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
        }
    }
});

export const { setNeedsReviewData, setFurtherSeqData, setPendingRequestsData } = homeSlice.actions;

export default homeSlice.reducer;

// Actions
export const getSeqData = () => async (dispatch) => {
    const response = await getSeqAnalysisProjects();
    const { projectsToReview, projectsToSequenceFurther, requestsPending } = response.data;
    dispatch(setNeedsReviewData(projectsToReview));
    dispatch(setFurtherSeqData(projectsToSequenceFurther));
    dispatch(setPendingRequestsData(requestsPending));
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
