import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './user.state';
import * as UserActions from './user.actions';
import { loadUserFromStorage } from './user.utils';
import { UserModel } from '../../models/user.model';

// Демо-пользователи
const DEMO_USERS = [
  { id: 1, firstName: 'James', lastName: 'Hetfield', email: 'a@a', password: '123', role: 'teacher' as const },
  { id: 2, firstName: 'Elvis', lastName: '', email: 'elvis@example.com', password: '123', role: 'teacher' as const },
  { id: 3, firstName: 'Steve', lastName: 'Vai', email: 'steve@example.com', password: '123', role: 'student' as const },
];

function saveToStorage(user: UserModel): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }
}

function removeFromStorage(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('currentUser');
  }
}

export const userReducer = createReducer(
  initialUserState,

  // Инициализация
  on(UserActions.initializeUser, (state): UserState => ({
    ...state,
    currentUser: loadUserFromStorage(),
    initialized: true
  })),

  // Логин - ищем в демо-пользователях ИЛИ в sessionStorage
  on(UserActions.loginUser, (state, { email, password }): UserState => {
    let user = DEMO_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      const userFromStorage = loadUserFromStorage();
      if (userFromStorage && 
          userFromStorage.email.toLowerCase() === email.toLowerCase() && 
          userFromStorage.password === password) {
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
      
      saveToStorage(userModel);

      return {
        ...state,
        currentUser: userModel
      };
    }

    return {
      ...state,
      currentUser: null
    };
  }),

  // Логаут
  on(UserActions.logoutUser, (state): UserState => {
    removeFromStorage();
    return {
      ...state,
      currentUser: null
    };
  }),

  // Обновление профиля
  on(UserActions.updateUserProfile, (state, { userData }): UserState => {
    if (!state.currentUser) return state;

    const updatedUser = new UserModel(
      state.currentUser.id,
      userData.firstName || state.currentUser.firstName,
      userData.lastName || state.currentUser.lastName,
      userData.email || state.currentUser.email,
      userData.password || state.currentUser.password,
      state.currentUser.role
    );

    saveToStorage(updatedUser);

    return {
      ...state,
      currentUser: updatedUser
    };
  })
);