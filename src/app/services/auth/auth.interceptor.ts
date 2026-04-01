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
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        this.notificationService.showError(errorMessage);
        return throwError(error);
      })
    );
  }
}
