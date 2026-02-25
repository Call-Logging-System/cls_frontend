import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menubar',
  imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, RouterOutlet, NgIf],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
})
export class Menubar {
  
}
