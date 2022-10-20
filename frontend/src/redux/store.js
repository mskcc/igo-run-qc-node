import projectsReducer from "./reducers/projectsReducer";
import homeReducer from "./reducers/homeReducer";
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
      projects: projectsReducer,
      home: homeReducer
    }
  });

export default store;
