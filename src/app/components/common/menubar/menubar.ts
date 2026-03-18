import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menubar',
  imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
})
export class Menubar {
  readonly router = inject(Router);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
