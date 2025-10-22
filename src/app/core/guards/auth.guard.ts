import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import * as UserSelectors from '../store/user/user.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(UserSelectors.selectIsLoggedIn).pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }
      
      return router.createUrlTree(['/login']);
    })
  );
};