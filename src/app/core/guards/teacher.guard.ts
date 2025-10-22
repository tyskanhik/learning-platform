import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import * as UserSelectors from '../store/user/user.selectors';

export const teacherGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(UserSelectors.selectCurrentUser).pipe(
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