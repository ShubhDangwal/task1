import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedInUser?: User;

  constructor(private data: DataService) {}

  login(email: string, password: string): { success: boolean; msg: string } {
    const user = this.data.getUsers().find(u => u.email === email && u.password === password);
    if (!user) return { success: false, msg: 'Invalid credentials' };
    this.loggedInUser = user;
    return { success: true, msg: 'Logged in' };
  }
  logout() { this.loggedInUser = undefined; }
  get currentUser() { return this.loggedInUser; }
  isLoggedIn() { return !!this.loggedInUser; }
  hasRole(role: 'admin' | 'user'): boolean {
    return this.loggedInUser?.role === role;
  }
}
