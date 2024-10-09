import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.js'; 

export const selectUser = (state: RootState) => state.user;

export const selectFullName = createSelector(
  selectUser,
  (user) => user.full_name
);

export const selectEmail = createSelector(
  selectUser,
  (user) => user.email
);
