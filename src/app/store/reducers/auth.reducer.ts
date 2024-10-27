import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';

export interface State {
  user: any;
  error: string;
  isLoggedIn: boolean
}

const initialState: State = {
  user: null,
  error: '',
  isLoggedIn: false
};

export const authReducer = createReducer<State>(
  initialState,
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    user: action.user,
    isLoggedIn: true
  })),
  on(AuthActions.loginFail, (state, action) => ({
    ...state,
    error: action.error
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null
  }))
);
