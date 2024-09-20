import { createReducer, on } from '@ngrx/store';
import * as OrderActions from '../actions/order.actions';
import { Order } from '../../core/models/order.model';


export interface State {
  orders: Order[];
  error: string;
}

const initialState: State = {
  orders: [],
  error: ''
};

export const ordersReducer = createReducer<State>(
  initialState,
  on(OrderActions.loadOrdersSuccess, (state, action) => ({
    ...state,
    orders: action.orders
  })),
  on(OrderActions.loadOrdersFail, (state, action) => ({
    ...state,
    error: action.error
  }))
);
