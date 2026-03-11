// app.ts
import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Header } from './components/common/header/header';
import { Footer } from './components/common/footer/footer';
import { Menubar } from './components/common/menubar/menubar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    Header,
    Footer,
    Menubar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);

  // Signal that updates on every route change
  private currentUrl = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentUrl.set(e.urlAfterRedirects);
      });
  }

  isLoginRoute(): boolean {
    const url = this.currentUrl();
    return url === '/login' || url === '/' || url === '';
  }
}