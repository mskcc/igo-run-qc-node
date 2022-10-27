import { createSlice } from '@reduxjs/toolkit';
import { PROJECT_QC_STATE_ID } from '../../resources/constants';

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
                  payload: { projectQc, projectId },
                }
              },
        }
    }
});

export const { setProjectQCData } = projectSlice.actions;

export default projectSlice.reducer;

// Selectors
const selectProjectEntities = (state) => state.project.entities;

export const selectProjectDataById = (state, projectId) => {
    const stateId = `${PROJECT_QC_STATE_ID}_${projectId}`;
    return selectProjectEntities(state)[stateId];
};
