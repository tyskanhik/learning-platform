import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { User, UserModel } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSignal = signal<UserModel[]>([
    new UserModel(1, 'James', 'Hetfield', 'james@example.com', 'password123', 'teacher'),
    new UserModel(2, 'Elvis', '', 'elvis@example.com', 'password123', 'student'),
    new UserModel(3, 'Steve', 'Vai', 'steve@example.com', 'password123', 'student'),
  ]);

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.initializeFromStorage();
  }

  private currentUserSignal = signal<UserModel | null>(null);
  users = this.usersSignal.asReadonly();
  currentUser = this.currentUserSignal.asReadonly();

  private initializeFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = sessionStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          this.currentUserSignal.set(userData);
        } catch (e) {
          console.warn('Failed to parse saved user data');
          sessionStorage.removeItem('currentUser');
        }
      }
    }
  }

  register(userData: Omit<User, 'id'>): void {
    const users = this.usersSignal();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const newUser = new UserModel(
      newId,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.role
    );

    this.usersSignal.update(users => [...users, newUser]);
    this.setCurrentUser(newUser);
  }

  login(email: string, password: string): boolean {
    if (!email || !password) return false;

    const user = this.usersSignal().find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );

    if (user) {
      this.setCurrentUser(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('currentUser');
    }
  }

  private setCurrentUser(user: UserModel): void {
    this.currentUserSignal.set(user);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }
}