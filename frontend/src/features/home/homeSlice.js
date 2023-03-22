import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  FURTHER_SEQ_STATE_ID,
  NEEDS_REVIEW_STATE_ID,
  PENDING_REQUESTS_STATE_ID,
  RECENT_DELIVERIES_STATE_ID,
  RECENT_RUNS_STATE_ID,
  METRICS_PROJECT_LIST_STATE_ID
} from '../../resources/constants';
import {
  getSeqAnalysisProjects,
  getRequestProjects,
  getRecentRuns,
  getCrosscheckMetrics
} from '../../services/igo-qc-service';
import { setProjectFlags } from '../../resources/projectHelper';

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
    },
    setCrosscheckMetricsProjList(state, action) {
      const data = action.payload;
      const id = METRICS_PROJECT_LIST_STATE_ID;
      state.entities[id] = data;
    }
  }
});

export const {
  setNeedsReviewData,
  setFurtherSeqData,
  setPendingRequestsData,
  setRecentDeliveriesData,
  setRecentRunsData,
  setCrosscheckMetricsProjList
} = homeSlice.actions;

export default homeSlice.reducer;

// Actions
export const getSeqData = () => async dispatch => {
  const response = await getSeqAnalysisProjects();
  const {
    projectsToReview,
    projectsToSequenceFurther,
    requestsPending
  } = response.data;

  
  // Call crosscheck metrics on all projects in @resp
  const projectsToReviewList = projectsToReview.map((proj) => {return proj['requestId'];});
  const projectsToSequenceFurtherList = projectsToSequenceFurther.map((proj) => {return proj['requestId'];});
  const projectList = projectsToSequenceFurtherList.concat(projectsToReviewList);
  const crossCheckResp = await getCrosscheckMetrics(projectList);
  const crossCheckData = crossCheckResp.data ? crossCheckResp.data.metricsData : {};
  dispatch(setCrosscheckMetricsProjList(crossCheckData));
  const projectsToReviewWithFlags = setProjectFlags(projectsToReview, crossCheckData);
  const projectsToSeqFurtherWithFlags = setProjectFlags(projectsToSequenceFurther, crossCheckData);

  dispatch(setNeedsReviewData(projectsToReviewWithFlags));
  dispatch(setFurtherSeqData(projectsToSeqFurtherWithFlags));
  dispatch(setPendingRequestsData(requestsPending));
};

export const getRecentDeliveries = () => async dispatch => {
  const response = await getRequestProjects();
  const { recentDeliveries } = response.data;

  // Call crosscheck metrics on all projects in @resp
  const projectList = recentDeliveries.map((proj) => { return proj['requestId']; });
  const crossCheckResp = await getCrosscheckMetrics(projectList);
  const crossCheckData = crossCheckResp.data ? crossCheckResp.data.metricsData : {};
  dispatch(setCrosscheckMetricsProjList(crossCheckData));
  
  const recentDeliveriesWithFlags = setProjectFlags(recentDeliveries, crossCheckData);
  dispatch(setRecentDeliveriesData(recentDeliveriesWithFlags));
};

export const getRecentRunsData = (numDays) => async dispatch => {
  const response = await getRecentRuns(numDays);
  const { recentRuns } = response.data;
  if (recentRuns.length > 1) {
    recentRuns.sort((a, b) => (a.date < b.date) ? 1 : -1);
  }
  dispatch(setRecentRunsData(recentRuns));
};

// Selectors
const selectHomeEntities = state => state.home.entities;

export const selectHomeData = createSelector(selectHomeEntities, (entities) =>
  Object.values(entities)
);

export const selectNeedsReviewData = state => {
  return selectHomeEntities(state)[NEEDS_REVIEW_STATE_ID];
};
export const selectFurtherSeqData = state => {
  return selectHomeEntities(state)[FURTHER_SEQ_STATE_ID];
};
export const selectPendingRequestsData = state => {
  return selectHomeEntities(state)[PENDING_REQUESTS_STATE_ID];
};
export const selectRecentDeliveriesData = state => {
  return selectHomeEntities(state)[RECENT_DELIVERIES_STATE_ID];
};
export const selectRecentRunsData = state => {
  return selectHomeEntities(state)[RECENT_RUNS_STATE_ID];
};
export const selectCrosscheckMetrics = state => {
  return selectHomeEntities(state)[METRICS_PROJECT_LIST_STATE_ID];
};
