import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { UserModel } from '../../core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

describe('LoginComponent', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['login'], {
      currentUser: signal<UserModel | null>(null).asReadonly()
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['setActiveLang', 'getActiveLang', 'translate']);

    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });
  
  it('должен инициализировать форму с валидаторами', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
    
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    
    expect(emailControl?.errors?.['required']).toBeTruthy();
    expect(passwordControl?.errors?.['required']).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('должен войти и перенаправить при валидной форме', async () => {
      userService.login.and.returnValue(true);
      
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123'
      });

      await component.onSubmit();

      expect(userService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(component.isLoading()).toBeFalse();
    });

    it('должен установить ошибку при невалидных credentials', async () => {
      userService.login.and.returnValue(false);
      
      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      await component.onSubmit();

      expect(userService.login).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.loginForm.errors).toEqual({ invalidCredentials: true });
      expect(component.isLoading()).toBeFalse();
    });

    it('должен отметить поля touched при невалидной форме', async () => {
      component.loginForm.setValue({
        email: '',
        password: ''
      });

      await component.onSubmit();

      expect(userService.login).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      
      const emailControl = component.loginForm.get('email');
      const passwordControl = component.loginForm.get('password');
      expect(emailControl?.touched).toBeTrue();
      expect(passwordControl?.touched).toBeTrue();
    });
  });

  describe('getControlState', () => {
    it('должен возвращать состояние контрола', () => {
      const control = component.loginForm.get('email');
      control?.markAsTouched();
      control?.setErrors({ required: true });

      const state = component.getControlState(control!);

      expect(state.touched).toBeTrue();
      expect(state.valid).toBeFalse();
      expect(state.errorsCount).toBe(1);
    });

    it('должен возвращать 0 ошибок для валидного контрола', () => {
      const control = component.loginForm.get('email');
      control?.setValue('valid@email.com');
      control?.markAsTouched();

      const state = component.getControlState(control!);

      expect(state.valid).toBeTrue();
      expect(state.errorsCount).toBe(0);
    });
  });

  it('должен переключать видимость пароля', () => {
    expect(component.hidePassword()).toBeTrue();
    
    component.hidePassword.set(false);
    expect(component.hidePassword()).toBeFalse();
  });
});