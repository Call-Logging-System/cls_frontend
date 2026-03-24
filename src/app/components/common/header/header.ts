import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  appName = 'CLS - Call Logging System';
  @Output() menuClick = new EventEmitter<void>();

  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
