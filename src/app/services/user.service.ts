// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';

export interface User {
  id: number;               // id as number
  name: string;
  role: string;
  password: string;
  email: string;
}

export interface Appointment {
  id: number;
  patientid: number;
  doctorid: number;
  description: string;
  date: string;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private userUrl = 'http://localhost:3000/users';
  private appointmentUrl = 'http://localhost:3000/appointment';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.appointmentUrl);
  }

  checkUsernameTaken(username: string): Observable<boolean> {
    return this.getUsers().pipe(
      delay(500),
      map(users =>
        users.some(u => u.name.toLowerCase() === username.toLowerCase())
      )
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(this.userUrl, user);
  }

  login(username: string, password: string): Observable<User> {
    return this.getUsers().pipe(
      map(users => {
        const found = users.find(u =>
          (u.name === username || u.email === username) && u.password === password
        );
        if (found) return found;
        throw new Error('Invalid credentials');
      }),
      catchError(err => throwError(() => err))
    );
  }
}
