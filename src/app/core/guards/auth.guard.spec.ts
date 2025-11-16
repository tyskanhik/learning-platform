import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { UserService } from '../services/user.service';

class MockUserService {
  currentUser = (): any => null;
}

class MockRouter {
  createUrlTree = jasmine.createSpy('createUrlTree').and.returnValue({ 
    toString: () => '/login' 
  });
}

describe('authGuard', () => {
  let userService: MockUserService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useClass: MockRouter }
      ]
    });

    userService = TestBed.inject(UserService) as any;
    router = TestBed.inject(Router) as any;
  });

  it('разрешает доступ когда пользователь авторизован', () => {
    userService.currentUser = () => ({ id: 1, email: 'test@test.com' });

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    
    expect(result).toBe(true);
  });

  it('перенаправляет на логин когда пользователь не авторизован', () => {
    userService.currentUser = () => null;

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(jasmine.any(Object));
  });
});