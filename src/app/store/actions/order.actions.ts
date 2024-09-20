import { createAction, props } from '@ngrx/store';
import { Order } from '../../core/models/order.model';

export const loadOrders = createAction('[Order] Load Orders');
export const loadOrdersSuccess = createAction(
  '[Order] Load Orders Success',
  props<{ orders: Order[] }>()
);
export const loadOrdersFail = createAction('[Order] Load Orders Fail', props<{ error: string }>());
