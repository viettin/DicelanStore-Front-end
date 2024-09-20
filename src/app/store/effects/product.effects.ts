import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ProductActions from '../actions/product.actions';
import { ProductService } from '../../services/product.service';

@Injectable()
export class ProductsEffects {
  constructor(private actions$: Actions, private productService: ProductService) {}

  loadProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      mergeMap(() => 
        this.productService.getProducts().pipe(
          map(products => ProductActions.loadProductsSuccess({ products })),
          catchError(error => of(ProductActions.loadProductsFail({ error })))
        )
      )
    );
  });
}
