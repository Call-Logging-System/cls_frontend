import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CallLogService } from '../../../services/call-log/call-log.service';

@Component({
  selector: 'app-add-call-log-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './add-call-log-dialog.html',
  styleUrl: './add-call-log-dialog.css',
})
export class AddCallLogDialog {
  username: string = '';
  officeLevel: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddCallLogDialog>,
    private callLogService: CallLogService,
  ) {}

  save() {
    if (!this.username) return;
    const payload = {
      userName: this.username,
      officeLevel: this.officeLevel,
    };
    this.callLogService.saveOffice(payload).subscribe({
      next: (res) => {
        this.dialogRef.close({
          status: '200',
          userName: this.username,
          officeLevel: this.officeLevel,
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  close() {
    this.dialogRef.close();
  }
}
