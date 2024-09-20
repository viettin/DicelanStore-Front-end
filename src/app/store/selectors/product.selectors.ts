import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProducts from '../reducers/product.reducer';

export const getProductState = createFeatureSelector<fromProducts.State>('products');

export const getProducts = createSelector(
  getProductState,
  state => state.products
);

export const getCart = createSelector(
  getProductState,
  state => state.cart
);
