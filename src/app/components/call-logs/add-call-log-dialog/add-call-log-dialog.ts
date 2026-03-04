import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-call-log-dialog',
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './add-call-log-dialog.html',
  styleUrl: './add-call-log-dialog.css',
})
export class AddCallLogDialog {
  username: string = '';

  constructor(private dialogRef: MatDialogRef<AddCallLogDialog>) {}

  save() {
    this.dialogRef.close(this.username);
  }

  close() {
    this.dialogRef.close();
  }
}
