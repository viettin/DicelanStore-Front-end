import { ActionReducerMap } from '@ngrx/store';
import * as fromProducts from './reducers/product.reducer';
import *  as fromAuth from './reducers/auth.reducer';
import *  as fromOrders from './reducers/order.reducer';
import *  as fromLoading from './reducers/loading.reducer';

export interface AppState {
  products: fromProducts.State;
  auth: fromAuth.State;
  orders: fromOrders.State;
  loading: fromLoading.LoadingState
}

export const appReducer: ActionReducerMap<AppState> = {
  products: fromProducts.productsReducer,
  auth: fromAuth.authReducer,
  orders: fromOrders.ordersReducer,
  loading: fromLoading.loadingReducer
};
