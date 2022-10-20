// import projectsReducer from "./redux/reducers/projectsReducer";
import homeReducer from "./features/home/homeSlice";
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
      home: homeReducer
    }
  });

export default store;
