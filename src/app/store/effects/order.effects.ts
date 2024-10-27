import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import * as OrderActions from '../actions/order.actions';
import { OrderService } from '../../services/order.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { isLoggedIn } from '../selectors/auth.selectors';
import { Router } from '@angular/router';

@Injectable()
export class OrdersEffects {
  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  loadOrders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      mergeMap(() =>
        this.orderService.getOrders().pipe(
          map((orders) => OrderActions.loadOrdersSuccess({ orders })),
          catchError((error) => of(OrderActions.loadOrdersFail({ error })))
        )
      )
    );
  });

  // addToCart$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(OrderActions.addToCart),
  //     withLatestFrom(this.store.select(isLoggedIn)),
  //     mergeMap(([action]) => {
  //         return this.orderService.addToCart(action.product.id).pipe(
  //           map(() =>
  //             OrderActions.addToCartSuccess({ product: action.product })
  //           ),
  //           catchError((error) =>
  //             of(OrderActions.addToCartFail({ error: error.message }))
  //           )
  //         );
  //     })
  //   )
  // });
}
