import { ActionReducerMap } from '@ngrx/store';
import * as fromProducts from './reducers/product.reducer';
import *  as fromAuth from './reducers/auth.reducer';
import *  as fromOrders from './reducers/order.reducer';

export interface AppState {
  products: fromProducts.State;
  auth: fromAuth.State;
  orders: fromOrders.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  products: fromProducts.productsReducer,
  auth: fromAuth.authReducer,
  orders: fromOrders.ordersReducer,
};
