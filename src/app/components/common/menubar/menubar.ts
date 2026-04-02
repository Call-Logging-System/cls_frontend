import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth/auth.service';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-menubar',
  imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menubar implements OnInit {
  roles = ['Admin', 'Support'];
  readonly router = inject(Router);
  readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  // ← store URL as a property so OnPush template sees the update
  currentUrl = this.router.url;

  readonly navItems = [
    { path: '/call-logs', icon: 'call', label: 'Call Logs' },
    { path: '/phone-book', icon: 'contacts', label: 'Phone Book' },
    { path: '/user-management', icon: 'people', label: 'Users' },
  ];

  readonly bottomItems = [
    { path: '/settings/change-password', icon: 'settings', label: 'Settings' },
  ];

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentUrl = e.urlAfterRedirects;
        this.cdr.markForCheck();
      });
  }

  isAllowed(path: string): boolean {
    const route = routes.find(r => '/' + r.path === path);
    const allowedRoles: number[] = route?.data?.['roles'] ?? [];
    if (allowedRoles.length === 0) return true;
    const userRole = this.authService.userRole();
    return userRole !== null && allowedRoles.includes(userRole);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}