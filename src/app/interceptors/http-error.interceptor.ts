import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  showDismissButton = true;
  action = '';
  detailedMessage = '';
  link = '';
  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.status === 401) {
            // Redirect to authLogin on 401 error
            this.router.navigate(['/auth/login']);
          }
          else if (error.error.message) {
            errorMessage = `Error: ${error.error.message}`;
          } else if(error?.error?.error?.message){
            errorMessage = `An error occurred. Please try again later`;
          } else {
            errorMessage = `An error occurred. Please try again later`;
          }
          this.messageService.add({ severity: 'error', summary: 'error', detail: errorMessage });
          return throwError(() => errorMessage);
        })
      )
  }
}
