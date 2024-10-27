import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromOrders from '../reducers/order.reducer';

export const getOrderState = createFeatureSelector<fromOrders.State>('orders');

export const getOrders = createSelector(
  getOrderState,
  state => state.orders
);

export const getOrderError = createSelector(
  getOrderState,
  state => state.error
);

export const getCart = createSelector(
  getOrderState,
  state => state.cart
);

export const getProductsForPayment = createSelector(
  getOrderState,
  state => state.selectedForPayment
);

