// login.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/common/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificationService = inject(NotificationService);

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
        this.isLoading = false;
        this.cdr.markForCheck();
        this.notificationService.showSuccess('Logged in successfully.');
        this.router.navigate(['/call-logs']);
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = typeof err.error === 'string'
          ? err.error
          : (err.error?.message ?? 'Invalid email or password.');
        // No snackbar for login error, only show error below password
        this.cdr.markForCheck();
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
