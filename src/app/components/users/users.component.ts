import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfRoleDirective } from '../../directives/if-role.directive';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, IfRoleDirective],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  msg = '';

  constructor(private data: DataService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.users = this.data.getUsers();
  }

  deleteUser(id: number) {
    this.msg = '';
    if (!this.data.deleteUser(id)) {
      this.msg = 'User not found!';
    } else {
      this.msg = 'User deleted successfully.';
      this.load();
    }
  }

  openAddUser() {
    this.router.navigate(['/users/create']);
  }
}
