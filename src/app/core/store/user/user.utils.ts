import { UserModel } from '../../models/user.model';

// SSR-совместимая функция для загрузки пользователя из storage
export function loadUserFromStorage(): UserModel | null {
  if (typeof window !== 'undefined') {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        return new UserModel(
          userData.id,
          userData.firstName,
          userData.lastName,
          userData.email,
          userData.password,
          userData.role
        );
      } catch (e) {
        console.warn('Failed to parse saved user data');
        sessionStorage.removeItem('currentUser');
      }
    }
  }
  return null;
}