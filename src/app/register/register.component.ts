// src/app/register/register.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// Validators as before
export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const conf = group.get('confirmPassword')?.value;
  return pass && conf && pass !== conf ? { passwordMismatch: true } : null;
}

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (!val) return null;
  const strong =
    val.length >= 10 &&
    /[A-Za-z]/.test(val) &&
    /\d/.test(val);
  return !strong ? { weakPassword: true } : null;
}

export function usernameAsyncValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    return userService.checkUsernameTaken(control.value).pipe(
      map(taken => (taken ? { usernameTaken: true } : null))
    );
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toast: MatSnackBar
  ) {
    this.form = this.fb.group(
      {
        username: [
          '',
          [Validators.required],
          [usernameAsyncValidator(this.userService)],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, passwordStrengthValidator]],
        confirmPassword: ['', Validators.required],
        role: ['patient', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  get usernameControl() {
    return this.form.get('username');
  }
  get emailControl() {
    return this.form.get('email');
  }
  get passwordControl() {
    return this.form.get('password');
  }
  get confirmPasswordControl() {
    return this.form.get('confirmPassword');
  }
  get roleControl() {
    return this.form.get('role');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.form.disable();

    const val = this.form.value;

    // Fetch users, determine max numeric ID for new user
    this.userService.getUsers().subscribe({
      next: (users) => {
        const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0);
        const newUserId = maxId + 1;

        const user: User = {
          id: newUserId,
          name: val.username,
          email: val.email,
          password: val.password,
          role: val.role
        };

        this.userService.register(user).subscribe({
          next: () => {
            this.loading = false;
            this.toast.open('Registration successful! Please log in.', 'Close', { duration: 2100 });
            this.router.navigate(['/login']);
          },
          error: () => {
            this.loading = false;
            this.form.enable();
            this.toast.open('Registration failed!', 'Close', { duration: 2200 });
          },
        });
      },
      error: () => {
        this.loading = false;
        this.form.enable();
        this.toast.open('Failed to fetch user list. Try again later.', 'Close', { duration: 2200 });
      }
    });
  }
}
