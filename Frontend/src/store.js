import { configureStore } from '@reduxjs/toolkit'
import loaderReducer from './slices/loaderSlice'
import snackbarReducer from "./slices/snackbarSlice";

export default configureStore({
  reducer: {
    loader: loaderReducer,
    snackbar: snackbarReducer,
  },
})