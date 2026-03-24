import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Step 1: If user is already in memory (signal has value), allow immediately
  // This covers normal navigation after login — no need to hit the server

  if (authService.isLoggedIn()) {
    return true;
  }

  // Step 2: Signal is empty (e.g. after page refresh)
  // Try to restore session by calling /api/auth/me
  // If the cookie is still valid, backend returns user info

  return authService.restoreSession().pipe(
    map(() => {
        return true; // Session restored successfully, allow access
    }),

    catchError(() => {
        router.navigate(['/login']); // Session restore failed (e.g. no cookie or invalid), redirect to login
        return of(false); // Block access to the route
    })
  )
};
