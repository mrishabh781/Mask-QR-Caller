import { createSlice } from '@reduxjs/toolkit'

export const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    value: { 
      home_page: 'loaded'
     },
  },
  reducers: {
    toggleLoader: (state, action) => {
      state.value[action.payload.resource] = action.payload.loading_state
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleLoader } = loaderSlice.actions

export default loaderSlice.reducer