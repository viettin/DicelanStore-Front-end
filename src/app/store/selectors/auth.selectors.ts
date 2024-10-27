import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../reducers/auth.reducer';

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');

export const getUser = createSelector(
  getAuthState,
  state => !!state.user ? state.user: null
);

export const isLoggedIn = createSelector(
  getAuthState,
  state => state.isLoggedIn
);

export const getAuthError = createSelector(
  getAuthState,
  state => state.error
);
