import { configureStore } from '@reduxjs/toolkit';

// Dummy reducer to prevent warning - can be removed when actual reducers are added
const dummyReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
    app: dummyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
