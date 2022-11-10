// import projectsReducer from "./redux/reducers/projectsReducer";
import homeReducer from "./features/home/homeSlice";
import projectReducer from "./features/project/projectSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    home: homeReducer,
    project: projectReducer
  }
});

export default store;
