// login.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  currentYear = new Date().getFullYear();

  // UI state
  showPassword = false;
  isLoading = false;
  loginError = '';
  usernameFocused = false;
  passwordFocused = false;

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    // Mark all fields touched to trigger validation display
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading = true;
    this.loginError = '';

    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.snackBar.open('Logged in successfully.', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['cls-snackbar-success'],
        });
        this.router.navigate(['/call-logs']);
     },
      error: (err) => {
        this.isLoading = false;
        this.loginError = typeof err.error === 'string'
          ? err.error
          : (err.error?.message ?? 'Invalid email or password.');
      },
    });
  }
}
