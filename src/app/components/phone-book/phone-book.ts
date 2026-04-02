// phone-book.ts
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { OfficeModel } from '../../models/office/office.model';
import { NotificationService } from '../../services/common/notification.service';
import { PhoneBookService } from '../../services/phone-book/phone-book.service';
import { EditPhoneBookDialog } from './edit-phone-book-dialog/edit-phone-book-dialog';
// import { PhoneBookService } from '../../services/phone-book/phone-book.service';
// import { ConfirmDialog } from '../common/confirm-dialog/confirm-dialog';
// import { PhoneBookFormDialog } from './phone-book-form-dialog/phone-book-form-dialog';

export interface OfficeEntry {
  id: number;
  officeUserName: string;
  officeLevel: number; // 2=Circle, 3=Division, 4=Range
  contactNumber: string;
  email?: string;
  location?: string;
}

@Component({
  selector: 'app-phone-book',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './phone-book.html',
  styleUrl: './phone-book.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneBook implements OnInit, AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly phoneBookService = inject(PhoneBookService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificationService = inject(NotificationService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = [
    'index',
    'officeUserName',
    'officeLevel',
    'contactNumber',
    'alternateContactNumber',
    'email',
    'edit',
  ];

  dataSource = new MatTableDataSource<OfficeModel>([]);

  ngOnInit(): void {
    this.loadOffices();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOffices(): void {
    this.phoneBookService.getOffices().subscribe({
      next: (data: OfficeModel[]) => {
        this.dataSource.data = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading offices', err);
      },
    });
  }

  // ── Search ─────────────────────────────────────────────
  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  // ── Stat card counts ───────────────────────────────────
  getCount(level: 'Circle' | 'Division' | 'Range'): number {
    const map = { Circle: 2, Division: 3, Range: 4 };
    return this.dataSource.data.filter((o: OfficeModel) => o.officeLevel === map[level]).length;
  }

  // ── Level helpers ──────────────────────────────────────
  getLevelLabel(level: number): string {
    return { 2: 'Circle', 3: 'Division', 4: 'Range' }[level] ?? '—';
  }

  getLevelClass(level: number): string {
    return { 2: 'level-circle', 3: 'level-division', 4: 'level-range' }[level] ?? '';
  }

  openEdit(office: any): void {
    const ref = this.dialog.open(EditPhoneBookDialog, {
      panelClass: 'cls-dialog',
      data: office, // passes the full row object
    });

    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.loadOffices(); // refresh your list
        this.notificationService.showSuccess('Office updated successfully.');
      }
    });
  }
}
