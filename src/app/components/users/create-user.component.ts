import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent {
  private fb = inject(FormBuilder);
  private data = inject(DataService);
  private router = inject(Router);

  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    gender: ['', Validators.required],
    age: [null, [Validators.required, Validators.min(0)]],
    dob: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required], // default user
    password: ['', Validators.required]
  });

  msg = '';

  submit() {
    if (!this.userForm.valid) {
      this.msg = 'Please fill all required fields correctly.';
      return;
    }

    const formValue = this.userForm.value;

    // Ensure all properties exist and cast properly
    const newUser: Omit<User, 'id'> = {
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      gender: formValue.gender!,
      age: formValue.age!,
      dob: formValue.dob!,
      phone: formValue.phone!,
      email: formValue.email!,
      role: formValue.role! as 'admin' | 'user',
      password: formValue.password!
    };

    const result = this.data.addUser(newUser);

    if (result.success) {
      this.msg = 'User added successfully!';
      this.userForm.reset({ role: 'user' });
      this.router.navigate(['/users']);
    } else {
      // Display error message such as "Email already exists"
      this.msg = result.msg || 'Failed to add user.';
    }
  }
}
