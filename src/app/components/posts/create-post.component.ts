import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
})
export class CreatePostComponent {
  private fb = inject(FormBuilder);
  private data = inject(DataService);
  private auth = inject(AuthService);
  private router = inject(Router);

  postForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    content: ['', Validators.required]
  });

  msg = '';

  submit() {
    this.msg = '';
    if (!this.auth.currentUser) {
      this.msg = 'Not authenticated';
      return;
    }
    if (!this.postForm.valid) {
      this.msg = 'Invalid form!';
      return;
    }
    const res = this.data.addPost({
      title: this.postForm.value.title!,
      content: this.postForm.value.content!,
      authorId: this.auth.currentUser.id
    });
    this.msg = res.msg;
    if (res.success) {
      this.postForm.reset();
      // Optionally navigate back to posts
      this.router.navigate(['/posts']);
    }
  }
}
