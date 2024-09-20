import { createAction, props } from '@ngrx/store';
import { Product } from '../../core/models/product.model';

export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFail = createAction('[Product] Load Products Fail', props<{ error: string }>());

// Add to cart action
export const addToCart = createAction('[Product] Add to Cart', props<{ productId: number }>());
