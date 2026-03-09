import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';

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
  ],
  templateUrl: './add-call-log-form.html',
  styleUrl: './add-call-log-form.css',
})
export class AddCallLogForm implements OnInit {
  officeUserName!: string;
  officeLevel!: string;

  callLog = {
    issueReported: '',
    callDate: '',
    issueType: '',
    priority: '',
    description: '',

    reportedBy: null,
    reportedTo: null,
    status: '',

    callStartTime: '',
    callEndTime: '',
    solvedBy: null,

    isReleased: false,
    releaseDate: null,
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.officeUserName = params['officeUserName'];
      this.officeLevel = params['officeLevel'];
    });
  }

  saveCallLog() {
    console.log('Call Log:', this.callLog);
  }
}
