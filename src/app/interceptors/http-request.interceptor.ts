import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { isLoggedIn } from '../store/selectors/auth.selectors';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private store: Store
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let modifiedRequest = request;
    this.store.select(isLoggedIn).subscribe(isLoggedIn => {
      if (isLoggedIn && !request.url.includes("provinces.open-api")) {
        const token = localStorage.getItem('access_token');
        if (token) {
          modifiedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }
    });
    return next.handle(modifiedRequest);
  }
}
