// phone-book.ts
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { OfficeModel } from '../../../models/office/office.model';
import { CallLogService } from '../../../services/call-log/call-log.service';
// import { PhoneBookService } from '../../services/phone-book/phone-book.service';
// import { ConfirmDialog } from '../common/confirm-dialog/confirm-dialog';
// import { PhoneBookFormDialog } from './phone-book-form-dialog/phone-book-form-dialog';

export interface OfficeEntry {
  id: number;
  officeName: string;
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
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './phone-book.html',
  styleUrl: './phone-book.css',
})
export class PhoneBook implements OnInit, AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly callLogService = inject(CallLogService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = [
    'index',
    'officeUserName',
    'officeLevel',
    'contactNumber',
    'alternateContactNumber',
    'email',
    'address',
    'actions',
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
    this.callLogService.getOffices().subscribe({
      next: (data: OfficeModel[]) => {
        this.dataSource.data = data;
        this.cdr.detectChanges(); // ← fixes NG0100
      },
      error: (err) => {
        console.error('Error loading offices', err);
        this.showSnackbar('Failed to load offices.', 'error');
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

  // ── Add ────────────────────────────────────────────────
  openAddDialog(): void {
    // Uncomment once PhoneBookFormDialog is created:
    // const ref = this.dialog.open(PhoneBookFormDialog, {
    //   width: '480px',
    //   panelClass: 'cls-dialog',
    //   disableClose: true,
    //   data: { mode: 'add' },
    // });
    // ref.afterClosed().subscribe(result => {
    //   if (result) this.loadOffices();
    // });
    console.log('Add dialog — wire up PhoneBookFormDialog');
  }

  // ── Edit ───────────────────────────────────────────────
  openEditDialog(office: OfficeEntry): void {
    // Uncomment once PhoneBookFormDialog is created:
    // const ref = this.dialog.open(PhoneBookFormDialog, {
    //   width: '480px',
    //   panelClass: 'cls-dialog',
    //   disableClose: true,
    //   data: { mode: 'edit', office },
    // });
    // ref.afterClosed().subscribe(result => {
    //   if (result) this.loadOffices();
    // });
    console.log('Edit dialog — wire up PhoneBookFormDialog', office);
  }

  // ── Delete ─────────────────────────────────────────────
  // openDeleteDialog(office: OfficeEntry): void {
  //   const ref = this.dialog.open(ConfirmDialog, {
  //     width: '420px',
  //     panelClass: 'cls-dialog',
  //     disableClose: true,
  //     data: { issue: office.officeName },
  //   });

  //   ref.afterClosed().subscribe((confirmed: boolean) => {
  //     if (!confirmed) return;
  //     this.phoneBookSvc.deleteOffice(office.id).subscribe({
  //       next: () => {
  //         this.showSnackbar('Office deleted successfully.', 'success');
  //         this.loadOffices();
  //       },
  //       error: (err) => {
  //         console.error('Delete error', err);
  //         this.showSnackbar('Failed to delete office.', 'error');
  //       },
  //     });
  //   });
  // }

  // ── Snackbar ───────────────────────────────────────────
  private showSnackbar(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`cls-snackbar-${type}`],
    });
  }
}
