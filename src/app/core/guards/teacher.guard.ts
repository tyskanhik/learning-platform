import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { map } from 'rxjs';
import { UserState } from '../store/user.state';

export const teacherGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(UserState.currentUser).pipe(
    map(currentUser => {
      // Проверяем что пользователь авторизован и его роль - teacher
      if (currentUser && currentUser.role === 'teacher') {
        return true;
      }
      
      // Перенаправляем на главную если не преподаватель
      return router.createUrlTree(['/']);
    })
  );
};