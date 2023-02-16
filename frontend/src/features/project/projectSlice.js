import { createSlice } from '@reduxjs/toolkit';
import { PROJECT_QC_STATE_ID, QC_STATUS_PICKLIST, PROJECT_CROSSCHECK_METRICS } from '../../resources/constants';

const initialState = {
  entities: {}
};

// Reducers
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectQCData: {
      reducer(state, action) {
        const { projectQc, projectId } = action.payload;
        const id = `${PROJECT_QC_STATE_ID}_${projectId}`;
        state.entities[id] = projectQc;
      },
      prepare(projectQc, projectId) {
        return {
          payload: { projectQc, projectId }
        };
      }
    },
    setQcStatusPicklist(state, action) {
      const data = action.payload;
      const id = QC_STATUS_PICKLIST;
      state.entities[id] = data;
    },
    setProjectCrosscheckMetrics: {
      reducer(state, action) {
        const { metricsData, projectId } = action.payload;
        const id = `${PROJECT_CROSSCHECK_METRICS}_${projectId}`;
        state.entities[id] = metricsData;
      },
      prepare(metricsData, projectId) {
        return {
          payload: { metricsData, projectId }
        };
      }
    },
  }
});

export const { setProjectQCData, setQcStatusPicklist, setProjectCrosscheckMetrics } = projectSlice.actions;

export default projectSlice.reducer;

// Selectors
const selectProjectEntities = state => state.project.entities;

export const selectProjectDataById = (state, projectId) => {
  const stateId = `${PROJECT_QC_STATE_ID}_${projectId}`;
  return selectProjectEntities(state)[stateId];
};

export const selectQcStatusPicklist = state => {
  return selectProjectEntities(state)[QC_STATUS_PICKLIST];
};

export const selectProjectCrosscheckMetricsById = (state, projectId) => {
  const stateId = `${PROJECT_CROSSCHECK_METRICS}_${projectId}`;
  return selectProjectEntities(state)[stateId];
};
