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

  openAddDialog() {
    const dialogRef = this.dialog.open(AddCallLogDialog, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.status === '200') {
        // ✅ safe navigation operator prevents crash on dismiss
        this.router.navigate(['/add-call-log'], {
          queryParams: {
            officeUserName: result.userName,
            officeLevel: result.officeLevel,
          },
        });
      }
    });
  }
}
