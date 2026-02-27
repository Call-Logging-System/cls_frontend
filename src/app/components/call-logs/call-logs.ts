import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface CallLog {
  date: string;
  issue: string;
  type: string;
  reportedBy: string;
  status: string;
  duration: string;
}

const CALL_DATA: CallLog[] = [
  {
    date: '27-02-2026',
    issue: 'Login not working',
    type: 'Bug',
    reportedBy: 'Mumbai Office',
    status: 'Solved',
    duration: '15 mins',
  },
  {
    date: '26-02-2026',
    issue: 'Report download issue',
    type: 'Support',
    reportedBy: 'Pune Office',
    status: 'Pending',
    duration: '30 mins',
  },
];

@Component({
  selector: 'app-call-logs',
  templateUrl: './call-logs.html',
  styleUrls: ['./call-logs.css'],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
})
export class CallLogs implements AfterViewInit {
  displayedColumns: string[] = ['date', 'issue', 'type', 'reportedBy', 'status', 'duration'];
  dataSource = new MatTableDataSource(CALL_DATA);

  constructor() {
    console.log(this.dataSource.data);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
