import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
  selectUserState,
  (state: UserState) => state.currentUser
);

export const selectIsLoggedIn = createSelector(
  selectCurrentUser,
  (user) => user !== null
);

export const selectInitialized = createSelector(
  selectUserState,
  (state: UserState) => state.initialized
);