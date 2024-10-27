import { createReducer, on } from '@ngrx/store';
import * as OrderActions from '../actions/order.actions';
import { Order } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';


export interface State {
  orders: Order[];
  error: string;
  cart: Product[],
  selectedForPayment: Product[]; 
}

const initialState: State = {
  orders: [],
  error: '',
  cart: [],
  selectedForPayment: []
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
  })),
  on(OrderActions.addToCartSuccess, (state, action) => ({
    ...state,
    cart: [...state.cart, action.product]
  })),
  on(OrderActions.proceedToPayment, (state, action) => ({
    ...state,
    selectedForPayment: action.selectedProducts
  }))
);
