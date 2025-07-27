import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private users: User[] = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      gender: 'female',
      age: 28,
      dob: '1996-02-14',
      phone: '555-1234',
      email: 'alice.johnson@example.com',
      role: 'admin',
      password: 'admin123'
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Smith',
      gender: 'male',
      age: 32,
      dob: '1992-07-08',
      phone: '555-5678',
      email: 'bob.smith@example.com',
      role: 'user',
      password: 'user123'
    },
    {
      id: 3,
      firstName: 'Carol',
      lastName: 'Williams',
      gender: 'female',
      age: 25,
      dob: '1999-11-23',
      phone: '555-9012',
      email: 'carol.williams@example.com',
      role: 'user',
      password: 'user456'
    }
  ];

  private posts: Post[] = [
    {
      id: 1,
      title: 'Welcome to the App',
      content: 'This is the first post in our Angular application.',
      authorId: 1,
      createdAt: '2024-06-01T10:00:00Z'
    },
    {
      id: 2,
      title: 'Angular Tips',
      content: 'Use components and services wisely for scalability.',
      authorId: 2,
      createdAt: '2024-06-10T14:20:00Z'
    },
    {
      id: 3,
      title: 'Upcoming Features',
      content: 'Stay tuned for our next big update!',
      authorId: 1,
      createdAt: '2024-06-15T09:00:00Z'
    }
  ];

  // USERS
  getUsers(): User[] { return [...this.users]; }
  getUserById(id: number): User | undefined { return this.users.find(u => u.id === id); }
  addUser(user: Omit<User, 'id'>): { success: boolean; msg: string; user?: User } {
    if (this.users.some(u => u.email === user.email)) {
      return { success: false, msg: 'Email already exists' };
    }
    const id = Math.max(0, ...this.users.map(u => u.id)) + 1;
    const newUser: User = { ...user, id };
    this.users.push(newUser);
    return { success: true, msg: 'User added', user: newUser };
  }
  deleteUser(id: number): boolean {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    this.posts = this.posts.filter(p => p.authorId !== id);
    return true;
  }
  updateUser(id: number, changes: Partial<User>): boolean {
    const u = this.getUserById(id);
    if (!u) return false;
    Object.assign(u, changes);
    return true;
  }

  // POSTS
  getPosts(): Post[] { return [...this.posts]; }
  getPostById(id: number): Post | undefined { return this.posts.find(p => p.id === id); }

  addPost(post: Omit<Post, 'id' | 'createdAt'>): {success: boolean, msg: string, post?: Post} {
    if (!post.authorId || !this.users.some(u => u.id === post.authorId)) {
      return { success: false, msg: 'Invalid or missing user (author) ID.' };
    }
    if (!post.title || !post.content) {
      return { success: false, msg: 'Title and content are required.' };
    }
    const id = Math.max(0, ...this.posts.map(p => p.id)) + 1;
    const createdAt = new Date().toISOString();
    const newPost: Post = { ...post, id, createdAt };
    this.posts.push(newPost);
    return { success: true, msg: 'Post created!', post: newPost };
  }
  deletePost(id: number): boolean {
    const idx = this.posts.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.posts.splice(idx, 1);
    return true;
  }
  updatePost(id: number, changes: Partial<Post>): boolean {
    const p = this.getPostById(id);
    if (!p) return false;
    Object.assign(p, changes);
    return true;
  }
}
