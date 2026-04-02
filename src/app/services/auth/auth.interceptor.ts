import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../common/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and add withCredentials: true
    const clonedReq = req.clone({
      withCredentials: true, // tells browser to send the cls_token cookie
    });

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Backend returned an unsuccessful response code
          if (error.status === 401) {
            errorMessage = 'Invalid credentials. Please check your username and password.';
          } else if (error.status === 403) {
            errorMessage = 'Access denied. You do not have permission to perform this action.';
          } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = `Error: ${error.status} - ${error.message}`;
          }
        }
        this.notificationService.showError(errorMessage);
        return throwError(error);
      })
    );
  }
}
