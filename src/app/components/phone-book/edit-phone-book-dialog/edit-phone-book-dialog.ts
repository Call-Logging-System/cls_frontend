import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../../services/common/notification.service';
import { PhoneBookService } from '../../../services/phone-book/phone-book.service';

@Component({
  selector: 'app-edit-phone-book-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './edit-phone-book-dialog.html',
  styleUrl: './edit-phone-book-dialog.css',
})
export class EditPhoneBookDialog {
  private readonly dialogRef = inject(MatDialogRef<EditPhoneBookDialog>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly phoneBookSvc = inject(PhoneBookService);
  private readonly notificationService = inject(NotificationService);

  // ── Read-only context ──────────────────────────
  officeUserName: string = this.data.officeUserName ?? '';
  officeLevel: number = this.data.officeLevel ?? null;

  get officeLevelLabel(): string {
    const map: Record<number, string> = { 2: 'Circle', 3: 'Division', 4: 'Range' };
    return this.officeLevel ? (map[this.officeLevel] ?? '') : '';
  }

  // ── Editable fields ────────────────────────────
  contactNumber: string = this.data.contactNumber ?? '';
  alternateContactNumber: string = this.data.alternateContactNumber ?? '';
  email: string = this.data.email ?? '';
  address: string = this.data.address ?? '';
  isActive: boolean = this.data.isActive ?? true;

  isSaving = false;

  save(): void {
    this.isSaving = true;

    const payload = {
      id: this.data.id,
      contactNumber: this.contactNumber.trim() || null,
      alternateContactNumber: this.alternateContactNumber.trim() || null,
      email: this.email.trim() || null,
      address: this.address.trim() || null,
      isActive: this.isActive,
    };

    this.phoneBookSvc.updateOffice(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close(true); // true = refresh list
        this.notificationService.showSuccess('Office updated successfully.');
      },
      error: () => {
        this.isSaving = false;
        
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}