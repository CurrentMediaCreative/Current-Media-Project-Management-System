import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import slices (to be implemented)
// import authReducer from './slices/authSlice';
// import projectsReducer from './slices/projectsSlice';
// import uiReducer from './slices/uiSlice';

// Create a root reducer
const rootReducer = combineReducers({
  // auth: authReducer,
  // projects: projectsReducer,
  // ui: uiReducer,
});

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/refresh/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.arg.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt'],
      },
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
