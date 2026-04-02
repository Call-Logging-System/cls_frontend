import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-menubar',
  imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menubar {
  roles = ['Admin', 'Support'];
  readonly router = inject(Router);
  readonly authService = inject(AuthService);

  readonly navItems = [
    { path: '/call-logs', icon: 'call', label: 'Call Logs' },
    { path: '/phone-book', icon: 'contacts', label: 'Phone Book' },
    { path: '/user-management', icon: 'people', label: 'Users' },
  ];

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
