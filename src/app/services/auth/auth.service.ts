import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ChangePasswordModel } from '../../models/setting/change-password.model';

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API = 'http://localhost:8081/api/auth';

  private currentUser = signal<AuthUser | null>(null);

  // Public computed values — components read these
  // computed() automatically updates when currentUser changes
  readonly user = computed(() => this.currentUser());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly userRole = computed(() => this.currentUser()?.role ?? null);
  readonly userName = computed(() => this.currentUser()?.name ?? null);

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(
        `${this.API}/login`,
        { email, password },
      )
      .pipe(
        tap((user) => this.currentUser.set(user)),
      );
  }

  logout(): void {
    this.http.post(`${this.API}/logout`, {}, { responseType: 'text' }).subscribe({
      complete: () => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      },
    });
  }

  restoreSession(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(`${this.API}/me`, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  setUser(user: AuthUser | null): void {
    this.currentUser.set(user);
  }

  changePassword(payload: ChangePasswordModel): Observable<any> {
    return this.http.post(`${this.API}/change-password`, payload);
  }
}
