import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CallLog } from '../../models/call-log/call-log.model';
import { CallLogService } from '../../services/call-log/call-log.service';
import { AddCallLogDialog } from './add-call-log-dialog/add-call-log-dialog';

@Component({
  selector: 'app-call-logs',
  templateUrl: './call-logs.html',
  styleUrls: ['./call-logs.css'],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule],
})
export class CallLogs implements AfterViewInit {
  callLogs = signal<CallLog[]>([]);

  private readonly callLogService = inject(CallLogService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  displayedColumns: string[] = [
    'date',
    'issue',
    'type',
    'reportedBy',
    'status',
    'duration',
    'edit',
    'delete',
  ];

  statusMap: any = {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.loadCallLogs();
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
          duration: item.timeTakenMinutes,
        }));

        this.callLogs.set(mappedData);
      },
      error: (err) => {
        console.error('Error loading call logs', err);
      },
    });
  }

  openAddLogForm() {
    this.router.navigate(['/add-call-log']);
  }

  openDeleteDialog(element: CallLog) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the call log for "${element.issue}"?`,
    );
    if (confirmed) {
      this.callLogService.deleteCallLog(element.id).subscribe({
        next: () => {
          this.callLogs.update((logs) => logs.filter((log) => log.id !== element.id));
        },
        error: (err) => {
          console.error('Error deleting call log', err);
        },
      });
    }
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '—';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
}
