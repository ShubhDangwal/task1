import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  editing = false;
  msg = '';

  get user() {
    return this.auth.currentUser;
  }

  constructor(private auth: AuthService, private data: DataService, private router: Router) {}

  save(form: NgForm) {
    this.msg = '';
    if (this.user) {
      const ok = this.data.updateUser(this.user.id, form.value);
      if (!ok) this.msg = 'Could not save changes.';
      else {
        this.msg = 'Profile updated!';
        this.editing = false;
      }
    } else {
      this.msg = 'User not logged in';
      this.router.navigate(['/login']);
    }
  }
}
