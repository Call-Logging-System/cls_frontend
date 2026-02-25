import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/common/header/header/header";
import { Footer } from "./components/common/footer/footer/footer";
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from "@angular/material/sidenav";
import { Menubar } from "./components/common/menubar/menubar/menubar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, MatSidenavContainer, MatSidenav, Menubar, MatSidenavContent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cls_frontend');
}
