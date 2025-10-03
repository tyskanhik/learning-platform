import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const teacherGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const currentUser = userService.currentUser();
  if (currentUser && currentUser.role === 'teacher') {
    return true;
  }
  
  // Перенаправляем на главную если не преподаватель
  return router.createUrlTree(['/']);
};