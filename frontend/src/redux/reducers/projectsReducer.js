import { SET_PROJECTS } from "../actionTypes";

const initialState = {};

const projectsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROJECTS: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export default projectsReducer;
