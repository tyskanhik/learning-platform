import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { loadUserFromStorage } from './user.utils';


// Демо-пользователи
const DEMO_USERS = [
  { id: 1, firstName: 'James', lastName: 'Hetfield', email: 'a@a', password: '123', role: 'teacher' as const },
  { id: 2, firstName: 'Elvis', lastName: '', email: 'elvis@example.com', password: '123', role: 'teacher' as const },
  { id: 3, firstName: 'Steve', lastName: 'Vai', email: 'steve@example.com', password: '123', role: 'student' as const },
];

// Actions
export class InitializeUser {
  static readonly type = '[User] Initialize User';
}

export class LoginUser {
  static readonly type = '[User] Login User';
  constructor(public email: string, public password: string) {}
}

export class LogoutUser {
  static readonly type = '[User] Logout User';
}

export class UpdateUserProfile {
  static readonly type = '[User] Update User Profile';
  constructor(public userData: Partial<UserModel>) {}
}

// State interface
export interface UserStateModel {
  currentUser: UserModel | null;
  initialized: boolean;
}

// State
@State<UserStateModel>({
  name: 'user',
  defaults: {
    currentUser: null,
    initialized: false
  }
})
@Injectable()
export class UserState {
  // Selectors
  @Selector()
  static currentUser(state: UserStateModel): UserModel | null {
    return state.currentUser;
  }

  @Selector()
  static isLoggedIn(state: UserStateModel): boolean {
    return state.currentUser !== null;
  }

  @Selector()
  static initialized(state: UserStateModel): boolean {
    return state.initialized;
  }

  // Actions handlers
  @Action(InitializeUser)
  initializeUser(ctx: StateContext<UserStateModel>) {
    const user = loadUserFromStorage();
    ctx.patchState({
      currentUser: user,
      initialized: true
    });
  }

  @Action(LoginUser)
  loginUser(ctx: StateContext<UserStateModel>, action: LoginUser) {
    let user = DEMO_USERS.find(u => 
      u.email.toLowerCase() === action.email.toLowerCase() && 
      u.password === action.password
    );

    if (!user) {
      const userFromStorage = loadUserFromStorage();
      if (userFromStorage && 
          userFromStorage.email.toLowerCase() === action.email.toLowerCase() && 
          userFromStorage.password === action.password) {
        user = {
          id: userFromStorage.id,
          firstName: userFromStorage.firstName,
          lastName: userFromStorage.lastName,
          email: userFromStorage.email,
          password: userFromStorage.password,
          role: userFromStorage.role
        };
      }
    }

    if (user) {
      const userModel = new UserModel(
        user.id, 
        user.firstName, 
        user.lastName, 
        user.email, 
        user.password, 
        user.role
      );
      
      this.saveToStorage(userModel);

      ctx.patchState({
        currentUser: userModel
      });
    } else {
      ctx.patchState({
        currentUser: null
      });
    }
  }

  @Action(LogoutUser)
  logoutUser(ctx: StateContext<UserStateModel>) {
    this.removeFromStorage();
    ctx.patchState({
      currentUser: null
    });
  }

  @Action(UpdateUserProfile)
  updateUserProfile(ctx: StateContext<UserStateModel>, action: UpdateUserProfile) {
    const state = ctx.getState();
    if (!state.currentUser) return;

    const updatedUser = new UserModel(
      state.currentUser.id,
      action.userData.firstName || state.currentUser.firstName,
      action.userData.lastName || state.currentUser.lastName,
      action.userData.email || state.currentUser.email,
      action.userData.password || state.currentUser.password,
      state.currentUser.role
    );

    this.saveToStorage(updatedUser);

    ctx.patchState({
      currentUser: updatedUser
    });
  }

  private saveToStorage(user: UserModel): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  private removeFromStorage(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('currentUser');
    }
  }
}