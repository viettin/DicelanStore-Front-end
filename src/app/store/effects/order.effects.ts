import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as OrderActions from '../actions/order.actions';
import { OrderService } from '../../services/order.service';

@Injectable()
export class OrdersEffects {
  constructor(private actions$: Actions, private orderService: OrderService) {}

  loadOrders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      mergeMap(() => 
        this.orderService.getOrders().pipe(
          map(orders => OrderActions.loadOrdersSuccess({ orders })),
          catchError(error => of(OrderActions.loadOrdersFail({ error })))
        )
      )
    );
  });
}
