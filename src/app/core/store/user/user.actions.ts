import { createAction, props } from '@ngrx/store';
import { UserModel } from '../../models/user.model';

// Инициализация пользователя
export const initializeUser = createAction('[User] Initialize User');

// Логин
export const loginUser = createAction(
  '[User] Login User',
  props<{ email: string; password: string }>()
);

// Логаут
export const logoutUser = createAction('[User] Logout User');

// Обновление профиля
export const updateUserProfile = createAction(
  '[User] Update User Profile',
  props<{ userData: Partial<UserModel> }>()
);