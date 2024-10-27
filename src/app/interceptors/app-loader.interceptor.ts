import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { setLoading } from '../store/actions/loading.action';

@Injectable()
export class AppLoadingInterceptor implements HttpInterceptor {
  excluded_urls = ['tsa/ss6/getTestSpec', 'rsa/ss6/getLLMresults'];

constructor(private store: Store<AppState>) {
}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.store.dispatch(setLoading({ show: true }));
      return next.handle(request).pipe(finalize(()=> this.store.dispatch(setLoading({ show: false }))));
  }
}
