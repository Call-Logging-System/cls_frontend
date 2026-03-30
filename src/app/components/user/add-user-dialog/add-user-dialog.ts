import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SaveUserModel } from '../../../models/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-add-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatIconButton,
  ],
  templateUrl: './add-user-dialog.html',
  styleUrl: './add-user-dialog.css',
})
export class AddUserDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddUserDialog>);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  showPassword = false;
  loading = false;

  roles = [
    { value: 1,   label: 'Admin',   icon: 'admin_panel_settings' },
    { value: 2,   label: 'Support', icon: 'support_agent' },
  ];

  form = this.fb.group({
    fullName: ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role:     [null as number | null, Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload : SaveUserModel = {
      userName : this.form.value.fullName!,
      email : this.form.value.email!,
      password : this.form.value.password!,
      role : this.form.value.role!,
    }

    this.userService.saveUser(payload).subscribe({
      next:()=>{
        this.showSnackbar('User saved successfully.', 'success');
        this.router.navigate(['/user-management']);
      },
      error:(err) =>{
        console.error('Error saving user', err);
        this.showSnackbar('Failed to save user. Please try again.', 'error');
      }
    })

    this.dialogRef.close(payload);
  }

  private showSnackbar(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`cls-snackbar-${type}`],
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
