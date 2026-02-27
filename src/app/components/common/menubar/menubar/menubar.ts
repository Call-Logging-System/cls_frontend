import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-menubar',
  imports: [MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
})
export class Menubar {
  
}
