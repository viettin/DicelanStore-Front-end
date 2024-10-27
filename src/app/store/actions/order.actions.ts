import { createAction, props } from '@ngrx/store';
import { Order } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';

export const loadOrders = createAction('[Order] Load Orders');
export const loadOrdersSuccess = createAction(
  '[Order] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ product: Product }>()
);
export const addToCartSuccess = createAction(
  '[Cart] Add To Cart Success',
  props<{ product: Product }>()
);
export const addToCartFail = createAction(
  '[Cart] Add To Cart Fail',
  props<{ error: string }>()
);

export const proceedToPayment = createAction(
  '[Cart] Proceed To Payment',
  props<{ selectedProducts: Product[] }>()
);
export const loadOrdersFail = createAction('[Order] Load Orders Fail', props<{ error: string }>());
