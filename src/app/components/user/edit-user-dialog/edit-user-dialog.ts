import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserModel } from '../../../models/user/user.model';
import { NotificationService } from '../../../services/common/notification.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-edit-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatIconButton,
  ],
  templateUrl: './edit-user-dialog.html',
  styleUrl: '../add-user-dialog/add-user-dialog.css',
})
export class EditUserDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditUserDialog>);
  readonly data = inject<{ user: UserModel }>(MAT_DIALOG_DATA);
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  loading = false;

  roles = [
    { value: 1, label: 'Admin', icon: 'admin_panel_settings' },
    { value: 2, label: 'Support', icon: 'support_agent' },
  ];

  form = this.fb.group({
    fullName: [this.data.user.userName, Validators.required],
    email: [this.data.user.email, Validators.required],
    role: [Number(this.data.user.role), Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      userId: this.data.user.userId,
      userName: this.form.value.fullName!,
      email: this.form.value.email!,
      role: this.form.value.role!,
    };

    this.userService.updateUser(payload).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess('User updated successfully.');
        this.dialogRef.close(payload);
      },
      error: () => {
        // Keep dialog open so user doesn't lose their edits
        this.loading = false;
        this.notificationService.showError(
          'Failed to update user. Please try again.'
        );
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}