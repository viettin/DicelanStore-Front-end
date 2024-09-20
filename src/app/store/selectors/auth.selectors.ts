import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducer';

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');

export const getUser = createSelector(
  getAuthState,
  state => state.user
);

export const getAuthError = createSelector(
  getAuthState,
  state => state.error
);
