import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CallLogService } from '../../../services/call-log/call-log.service';

@Component({
  selector: 'app-add-call-log-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './add-call-log-form.html',
  styleUrl: './add-call-log-form.css',
})
export class AddCallLogForm implements OnInit {
  officeUserName!: string;
  officeLevel!: number;

  callLog = {
    officeUserName: '',
    officeLevel: 0,
    callDate: '',
    callStartTime: '',
    callEndTime: '',
    description: '',
    isReleased: false,
    issueReported: '',
    issueType: '',
    priority: '',
    releaseDate: null,
    reportedTo: null,
    solvedBy: null,
    status: '',
  };

  users: { key: number; value: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  private readonly callLogService = inject(CallLogService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('Query Params:', params);
      this.officeUserName = params['officeUserName'];
      this.officeLevel = +params['officeLevel'];
    });

    this.callLogService.getUsersDropdown().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Error loading users', err),
    });
  }

  saveCallLog() {
    this.callLog = {
      ...this.callLog,
      officeUserName: this.officeUserName,
      officeLevel: this.officeLevel,
    };
    console.log('Call Log:', this.callLog);

    this.callLogService.saveCallLog(this.callLog).subscribe({
      next: (res) => {
        console.log('Call log saved successfully', res);
        this.router.navigate(['/call-logs']);
      },
      error: (err) => {
        console.error('Error saving call log', err);
      },
    });
  }
  goBack() {
    this.router.navigate(['/call-logs']);
  }
}
