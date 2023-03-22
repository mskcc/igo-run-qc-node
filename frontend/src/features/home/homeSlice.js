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
  // const response = await getRecentRuns(numDays);
  const response = {
    'data':{
        'recentRuns':[
            {
                'date':'2019-12-21 16:30',
                'path':'static/html/FASTQ/MICHELLE_0189_BHMVTTDMXX_A1_laneBarcode.html',
                'runName':'MICHELLE_0189_BHMVTTDMXX_A1_laneBarcode.html',
                'runStats':'getInterOpsData?runId=MICHELLE_0189_BHMVTTDMXX_A1_laneBarcode.html'
            },
            {
              'date':'2019-12-19 19:17',
              'path':'static/html/FASTQ/PITT_0439_BHFTCNBBXY_laneBarcode.html',
              'runName':'PITT_0439_BHFTCNBBXY_laneBarcode.html',
              'runStats':'getInterOpsData?runId=PITT_0439_BHFTCNBBXY_laneBarcode.html'
            },
            {
                'date':'2019-12-21 15:24',
                'path':'static/html/FASTQ/MICHELLE_0189_BHMVTTDMXX_laneBarcode.html',
                'runName':'MICHELLE_0189_BHMVTTDMXX_laneBarcode.html',
                'runStats':'getInterOpsData?runId=MICHELLE_0189_BHMVTTDMXX_laneBarcode.html'
            },
            {
                'date':'2019-12-21 13:04',
                'path':'static/html/FASTQ/SCOTT_0167_AHTNKVBGXC_laneBarcode.html',
                'runName':'SCOTT_0167_AHTNKVBGXC_laneBarcode.html',
                'runStats':'getInterOpsData?runId=SCOTT_0167_AHTNKVBGXC_laneBarcode.html'
            },
            {
                'date':'2019-12-21 06:50',
                'path':'static/html/FASTQ/JAX_0399_BHCYWCBBXY_laneBarcode.html',
                'runName':'JAX_0399_BHCYWCBBXY_laneBarcode.html',
                'runStats':'getInterOpsData?runId=JAX_0399_BHCYWCBBXY_laneBarcode.html'
            },
            {
              'date':'2019-12-22 11:15',
              'path':'static/html/FASTQ/AYYAN_0015_000000000-CPK5W_laneBarcode.html',
              'runName':'AYYAN_0015_000000000-CPK5W_laneBarcode.html',
              'runStats':'getInterOpsData?runId=AYYAN_0015_000000000-CPK5W_laneBarcode.html'
            },
            {
                'date':'2019-12-21 03:58',
                'path':'static/html/FASTQ/JAX_0398_AHCYYGBBXY_laneBarcode.html',
                'runName':'JAX_0398_AHCYYGBBXY_laneBarcode.html',
                'runStats':'getInterOpsData?runId=JAX_0398_AHCYYGBBXY_laneBarcode.html'
            },
            {
                'date':'2019-12-21 01:06',
                'path':'static/html/FASTQ/JOHNSAWYERS_0224_000000000-G4F65_laneBarcode.html',
                'runName':'JOHNSAWYERS_0224_000000000-G4F65_laneBarcode.html',
                'runStats':'getInterOpsData?runId=JOHNSAWYERS_0224_000000000-G4F65_laneBarcode.html'
            },
            {
                'date':'2019-12-20 12:08',
                'path':'static/html/FASTQ/TOMS_5380_000000000-CP35V_laneBarcode.html',
                'runName':'TOMS_5380_000000000-CP35V_laneBarcode.html',
                'runStats':'getInterOpsData?runId=TOMS_5380_000000000-CP35V_laneBarcode.html'
            },
            {
                'date':'2019-12-20 05:30',
                'path':'static/html/FASTQ/KIM_0761_AHC2GMBCX3_laneBarcode.html',
                'runName':'KIM_0761_AHC2GMBCX3_laneBarcode.html',
                'runStats':'getInterOpsData?runId=KIM_0761_AHC2GMBCX3_laneBarcode.html'
            },
            {
              'date':'2019-12-22 12:13',
              'path':'static/html/FASTQ/VIC_2475_000000000-CP949_laneBarcode.html',
              'runName':'VIC_2475_000000000-CP949_laneBarcode.html',
              'runStats':'getInterOpsData?runId=VIC_2475_000000000-CP949_laneBarcode.html'
            },
            {
                'date':'2019-12-20 01:42',
                'path':'static/html/FASTQ/DIANA_0153_AHYG33DSXX_laneBarcode.html',
                'runName':'DIANA_0153_AHYG33DSXX_laneBarcode.html',
                'runStats':'getInterOpsData?runId=DIANA_0153_AHYG33DSXX_laneBarcode.html'
            },
            {
                'date':'2019-12-19 06:28',
                'path':'static/html/FASTQ/SCOTT_0166_AHKNNFBGXC_laneBarcode.html',
                'runName':'SCOTT_0166_AHKNNFBGXC_laneBarcode.html',
                'runStats':'getInterOpsData?runId=SCOTT_0166_AHKNNFBGXC_laneBarcode.html'
            },
            {
                'date':'2019-12-18 00:28',
                'path':'static/html/FASTQ/SCOTT_0165_AHKLMWBGXC_laneBarcode.html',
                'runName':'SCOTT_0165_AHKLMWBGXC_laneBarcode.html',
                'runStats':'getInterOpsData?runId=SCOTT_0165_AHKLMWBGXC_laneBarcode.html'
            },
            {
                'date':'2019-12-17 04:09',
                'path':'static/html/FASTQ/DIANA_0152_AHYF3JDSXX_laneBarcode.html',
                'runName':'DIANA_0152_AHYF3JDSXX_laneBarcode.html',
                'runStats':'getInterOpsData?runId=DIANA_0152_AHYF3JDSXX_laneBarcode.html'
            }
        ]
    },
    'status':'success',
    'success':true
};
  const { recentRuns } = response.data;
  recentRuns.sort((a, b) => (a.date > b.date) ? 1 : -1);
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
