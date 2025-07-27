import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { IfRoleDirective } from '../../directives/if-role.directive';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DateFormatPipe, IfRoleDirective],
  templateUrl: './posts.component.html',
})
export class PostsComponent {
  showMine = false;
  msg = '';

  constructor(
    public data: DataService,
    public auth: AuthService,
    private router: Router
  ) {}

  postsToShow() {
    this.msg = '';
    const all = this.data.getPosts();
    if (!this.showMine || !this.auth.currentUser) return all;
    const mine = all.filter(p => p.authorId === this.auth.currentUser?.id);
    if (mine.length === 0) this.msg = 'You have no posts.';
    return mine;
  }

  view(id: number) {
    this.router.navigate(['/posts', id]);
  }

  openCreatePost() {
    this.router.navigate(['/posts/create']);
  }
}
