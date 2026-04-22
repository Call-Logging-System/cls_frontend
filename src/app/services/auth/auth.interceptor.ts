import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../common/notification.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

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
            // JWT token expired or invalid
            errorMessage = 'Your session has expired. Please log in again.';
            // Clear the user from auth service
            this.authService.setUser(null);
            // Redirect to login page
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            errorMessage = 'Access denied. You do not have permission to perform this action.';
            this.authService.setUser(null);
            this.router.navigate(['/login']);
          } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            errorMessage = error.error.message || `Error: ${error.status} - ${error.message}`;
          }
        }
        this.notificationService.showError(errorMessage);
        return throwError(error);
      })
    );
  }
}
