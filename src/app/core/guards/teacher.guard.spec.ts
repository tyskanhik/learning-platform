import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { teacherGuard } from './teacher.guard';
import { UserService } from '../services/user.service';

describe('teacherGuard', () => {
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [], {
      currentUser: () => null
    });
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    userService = TestBed.inject(UserService) as any;
    router = TestBed.inject(Router) as any;
  });

  it('разрешает доступ когда пользователь teacher', () => {
    Object.defineProperty(userService, 'currentUser', {
      get: () => () => ({ id: 1, role: 'teacher' })
    });

    const result = TestBed.runInInjectionContext(() => teacherGuard({} as any, {} as any));
    
    expect(result).toBe(true);
  });

  it('перенаправляет на главную когда пользователь student', () => {
    Object.defineProperty(userService, 'currentUser', {
      get: () => () => ({ id: 2, role: 'student' })
    });

    TestBed.runInInjectionContext(() => teacherGuard({} as any, {} as any));
    
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('перенаправляет на главную когда пользователя нет', () => {
    Object.defineProperty(userService, 'currentUser', {
      get: () => () => null
    });

    TestBed.runInInjectionContext(() => teacherGuard({} as any, {} as any));
    
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });
});