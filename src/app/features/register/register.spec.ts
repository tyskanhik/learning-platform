import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { UserModel } from '../../core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

describe('RegisterComponent', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['register'], {
      currentUser: signal<UserModel | null>(null).asReadonly()
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['setActiveLang', 'getActiveLang', 'translate']);

    TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  it('должен инициализировать форму с валидаторами', () => {
    expect(component.registerForm.contains('firstName')).toBeTrue();
    expect(component.registerForm.contains('lastName')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
    expect(component.registerForm.contains('confirmPassword')).toBeTrue();
    expect(component.registerForm.contains('role')).toBeTrue();
    
    const firstNameControl = component.registerForm.get('firstName');
    const emailControl = component.registerForm.get('email');
    const passwordControl = component.registerForm.get('password');
    const roleControl = component.registerForm.get('role');
    
    expect(firstNameControl?.errors?.['required']).toBeTruthy();
    expect(emailControl?.errors?.['required']).toBeTruthy();
    expect(passwordControl?.errors?.['required']).toBeTruthy();
    expect(roleControl?.value).toBe('student');
  });

  describe('onSubmit', () => {
    it('должен зарегистрировать пользователя и перенаправить при валидной форме', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'student'
      });

      component.onSubmit();

      expect(userService.register).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      expect(component.isLoading()).toBeFalse();
    });

    it('должен отметить поля touched при невалидной форме', () => {
      component.registerForm.setValue({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
      });

      component.onSubmit();

      expect(userService.register).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      
      const firstNameControl = component.registerForm.get('firstName');
      const emailControl = component.registerForm.get('email');
      const passwordControl = component.registerForm.get('password');
      expect(firstNameControl?.touched).toBeTrue();
      expect(emailControl?.touched).toBeTrue();
      expect(passwordControl?.touched).toBeTrue();
    });

    it('не должен регистрировать при несовпадающих паролях', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
        role: 'student'
      });

      component.onSubmit();

      expect(userService.register).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.registerForm.errors).toEqual({ passwordMismatch: true });
    });
  });

  describe('getPasswordMismatchError', () => {
    it('должен возвращать true при несовпадающих паролях и touched confirmPassword', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'different',
        role: 'student'
      });
      component.registerForm.get('confirmPassword')?.markAsTouched();

      const hasError = component.getPasswordMismatchError();

      expect(hasError).toBeTrue();
    });

    it('должен возвращать false когда пароли совпадают', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'student'
      });
      component.registerForm.get('confirmPassword')?.markAsTouched();

      const hasError = component.getPasswordMismatchError();

      expect(hasError).toBeFalse();
    });

    it('должен возвращать false когда confirmPassword не touched', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'different',
        role: 'student'
      });

      const hasError = component.getPasswordMismatchError();

      expect(hasError).toBeFalse();
    });
  });

  describe('getControlState', () => {
    it('должен возвращать состояние контрола', () => {
      const control = component.registerForm.get('email');
      control?.markAsTouched();
      control?.setErrors({ required: true });

      const state = component.getControlState(control!);

      expect(state.touched).toBeTrue();
      expect(state.valid).toBeFalse();
      expect(state.errorsCount).toBe(1);
    });

    it('должен возвращать 0 ошибок для валидного контрола', () => {
      const control = component.registerForm.get('email');
      control?.setValue('valid@email.com');
      control?.markAsTouched();

      const state = component.getControlState(control!);

      expect(state.valid).toBeTrue();
      expect(state.errorsCount).toBe(0);
    });
  });

  it('должен переключать видимость паролей', () => {
    expect(component.hidePassword()).toBeTrue();
    expect(component.hideConfirmPassword()).toBeTrue();
    
    component.hidePassword.set(false);
    component.hideConfirmPassword.set(false);
    
    expect(component.hidePassword()).toBeFalse();
    expect(component.hideConfirmPassword()).toBeFalse();
  });

  it('должен обрабатывать регистрацию teacher', () => {
    component.registerForm.setValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'teacher'
    });

    component.onSubmit();

    expect(userService.register).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'teacher'
    });
  });
});