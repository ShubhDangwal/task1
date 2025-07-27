import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(form: NgForm) {
    this.errorMsg = '';
    const { email, password } = form.value;
    if (!email || !password) {
      this.errorMsg = 'Both fields are required!';
      return;
    }
    const res = this.auth.login(email, password);
    if (!res.success) {
      this.errorMsg = res.msg;
    } else {
      const role = this.auth.currentUser?.role;
      if (role === 'admin') {
        this.router.navigate(['/users']);
      } else if (role === 'user') {
        this.router.navigate(['/posts']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }
}
