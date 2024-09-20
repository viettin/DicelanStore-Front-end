import { createReducer, on } from '@ngrx/store';
import * as ProductActions from '../actions/product.actions';
import { Product } from '../../core/models/product.model';

export interface State {
  products: Product[];
  cart: number[];
  error: string;
}

const initialState: State = {
  products: [],
  cart: [],
  error: ''
};

export const productsReducer = createReducer<State>(
  initialState,
  on(ProductActions.loadProductsSuccess, (state, action) => ({
    ...state,
    products: action.products
  })),
  on(ProductActions.loadProductsFail, (state, action) => ({
    ...state,
    error: action.error
  })),
  on(ProductActions.addToCart, (state, action) => ({
    ...state,
    cart: [...state.cart, action.productId]
  }))
);
