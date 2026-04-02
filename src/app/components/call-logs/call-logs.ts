// call-logs.ts
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CallLog } from '../../models/call-log/call-log.model';
import { CallLogService } from '../../services/call-log/call-log.service';
import { NotificationService } from '../../services/common/notification.service';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-call-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './call-logs.html',
  styleUrl: './call-logs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallLogs implements OnInit,AfterViewInit {
  callLogs = signal<CallLog[]>([]);

  private readonly callLogService = inject(CallLogService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  displayedColumns: string[] = [
    'date',
    'issue',
    'type',
    'reportedBy',
    'status',
    'startTime',
    'endTime',
    'duration',
    'edit',
    'delete',
  ];

  statusMap: Record<string, string> = {
    O: 'Open',
    P: 'In Progress',
    D: 'Pending',
    C: 'Closed',
  };

  dataSource = new MatTableDataSource<CallLog>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.callLogs();
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadCallLogs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCallLogs() {
    this.callLogService.getCallLogs().subscribe({
      next: (data: any[]) => {
        const mappedData: CallLog[] = data.map((item) => ({
          id: item.id,
          date: item.callDate,
          issue: item.issueReported,
          type: item.issueType,
          reportedBy: item.reportedBy,
          status: item.status,
          callStartTime: item.callStartTime,
          callEndTime: item.callEndTime,
          duration: item.timeTakenMinutes,
        }));
        this.callLogs.set(mappedData);
      },
      error: () => {},
    });
  }

  /** Count logs by status — used by stat cards */
  getCount(status: string): number {
    return this.callLogs().filter((log) => log.status === status).length;
  }

  openAddLogForm() {
    this.router.navigate(['/call-logs/add']);
  }

  /** ── Delete with confirmation dialog ── */
  openDeleteDialog(element: CallLog) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      panelClass: 'cls-dialog', // for global dialog styling
      disableClose: true, // must click a button, not backdrop
      data: { issue: element.issue },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.callLogService.deleteCallLog(element.id).subscribe({
        next: () => {
          this.callLogs.update((logs) => logs.filter((log) => log.id !== element.id));
          this.notificationService.showSuccess('Call log deleted successfully.');
        },
        error: () => {},
      });
    });
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  openEditForm(id: number): void {
    this.router.navigate(['/call-logs/edit', id]);
  }

  exportToExcel(): void {
    this.callLogService.exportAllCallLogs().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Forest_CallRegister_Updated.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        this.notificationService.showSuccess('Export downloaded successfully.');
      },
      error: (err) => {
        console.error('Export error:', err);
      },
    });
  }
}
