// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toast: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get usernameControl() {
    return this.form.get('username');
  }
  get passwordControl() {
    return this.form.get('password');
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.form.disable();

    const { username, password } = this.form.value;

    this.userService.login(username!, password!).subscribe({
      next: (user) => {
        this.loading = false;
        this.toast.open(`Welcome ${user.name}!`, 'Close', { duration: 1800 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.form.enable();
        this.toast.open('Login failed: Invalid credentials', 'Close', { duration: 2200 });
      },
    });
  }
}
