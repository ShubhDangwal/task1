import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { CreateUserComponent } from './components/users/create-user.component'; // New
import { PostsComponent } from './components/posts/posts.component';
import { CreatePostComponent } from './components/posts/create-post.component'; // From previous
import { PostDetailComponent } from './components/posts/post-detail.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
  { path: 'users/create', component: CreateUserComponent, canActivate: [AdminGuard] }, // New
  { path: 'posts', component: PostsComponent, canActivate: [UserGuard] },
  { path: 'posts/create', component: CreatePostComponent, canActivate: [UserGuard] },
  { path: 'posts/:id', component: PostDetailComponent, canActivate: [UserGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [UserGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
