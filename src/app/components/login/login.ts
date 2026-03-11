// login.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly fb       = inject(FormBuilder);
  private readonly router   = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  currentYear = new Date().getFullYear();

  // UI state
  showPassword  = false;
  isLoading     = false;
  loginError    = '';
  usernameFocused = false;
  passwordFocused = false;

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
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

    this.isLoading  = true;
    this.loginError = '';

    const { username, password } = this.form.value;

    // ── Replace this block with your real AuthService call ──
    // Example:
    // this.authService.login(username, password).subscribe({
    //   next: () => {
    //     this.snackBar.open('Logged in successfully.', 'Dismiss', {
    //       duration: 3000,
    //       horizontalPosition: 'right',
    //       verticalPosition: 'top',
    //       panelClass: ['cls-snackbar-success'],
    //     });
    //     this.router.navigate(['/call-logs']);
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.loginError = err?.error?.message ?? 'Invalid username or password.';
    //   },
    // });

    // ── Placeholder simulation (remove once AuthService is wired) ──
    setTimeout(() => {
      this.isLoading = false;
      if (username === 'admin' && password === 'admin') {
        this.snackBar.open('Logged in successfully.', 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['cls-snackbar-success'],
        });
        this.router.navigate(['/call-logs']);
      } else {
        this.loginError = 'Invalid username or password.';
      }
    }, 1200);
  }
}