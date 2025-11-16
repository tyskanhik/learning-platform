import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile';
import { UserService } from '../../core/services/user.service';
import { LanguageService } from '../../core/services/language.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signal } from '@angular/core';
import { UserModel } from '../../core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

describe('ProfileComponent', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let userService: jasmine.SpyObj<UserService>;
  let languageService: jasmine.SpyObj<LanguageService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  let currentUserSignal: ReturnType<typeof signal<UserModel | null>>;

  beforeEach(() => {
    currentUserSignal = signal<UserModel | null>(
      new UserModel(1, 'John', 'Doe', 'john@example.com', 'password123', 'teacher')
    );

    const userServiceSpy = jasmine.createSpyObj('UserService', ['logout'], {
      currentUser: currentUserSignal.asReadonly()
    });

    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['getCurrentLanguage', 'setLanguage']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['setActiveLang', 'getActiveLang', 'translate']);

    TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    languageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  it('должен инициализировать форму данными пользователя', () => {
    component.ngOnInit();

    expect(component.profileForm.value).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  });

  describe('toggleEdit', () => {
    it('должен включать режим редактирования', () => {
      component.toggleEdit();

      expect(component.isEditing()).toBeTrue();
    });

    it('должен выключать режим редактирования и сбрасывать форму', () => {
      component.toggleEdit();
      component.profileForm.patchValue({
        firstName: 'Changed',
        newPassword: 'newpass'
      });

      component.toggleEdit();

      expect(component.isEditing()).toBeFalse();
      expect(component.profileForm.value.firstName).toBe('John');
      expect(component.profileForm.value.newPassword).toBe('');
      expect(component.profileForm.pristine).toBeTrue();
    });
  });

  describe('saveProfile', () => {
    beforeEach(() => {
      component.isEditing.set(true);
    });

    it('должен отмечать поля как touched при невалидной форме', () => {
      component.profileForm.patchValue({
        firstName: '',
        email: 'invalid-email'
      });

      component.saveProfile();

      expect(snackBar.open).not.toHaveBeenCalled();
      
      const firstNameControl = component.profileForm.get('firstName');
      const emailControl = component.profileForm.get('email');
      expect(firstNameControl?.touched).toBeTrue();
      expect(emailControl?.touched).toBeTrue();
    });
  });

  describe('logout', () => {
    it('должен разлогинить и перенаправить на главную', () => {
      component.logout();

      expect(userService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('getRoleTranslation', () => {
    it('должен возвращать "Teacher" для преподавателя', () => {
      currentUserSignal.set(new UserModel(1, 'John', 'Doe', 'john@example.com', 'pass', 'teacher'));
      fixture = TestBed.createComponent(Profile);
      component = fixture.componentInstance;

      const role = component.getRoleTranslation();

      expect(role).toBe('Teacher');
    });

    it('должен возвращать "Student" для студента', () => {
      currentUserSignal.set(new UserModel(2, 'Jane', 'Doe', 'jane@example.com', 'pass', 'student'));
      fixture = TestBed.createComponent(Profile);
      component = fixture.componentInstance;

      const role = component.getRoleTranslation();

      expect(role).toBe('Student');
    });
  });

  describe('getPasswordMismatchError', () => {
    it('должен возвращать true при несовпадающих паролях', () => {
      component.profileForm.patchValue({
        newPassword: 'password123',
        confirmPassword: 'different'
      });
      component.profileForm.get('confirmPassword')?.markAsTouched();

      const hasError = component.getPasswordMismatchError();

      expect(hasError).toBeTrue();
    });

    it('должен возвращать false когда пароли совпадают', () => {
      component.profileForm.patchValue({
        newPassword: 'password123',
        confirmPassword: 'password123'
      });
      component.profileForm.get('confirmPassword')?.markAsTouched();

      const hasError = component.getPasswordMismatchError();

      expect(hasError).toBeFalse();
    });
  });

  it('должен работать с пользователем без фамилии', () => {
    currentUserSignal.set(new UserModel(3, 'Elvis', '', 'elvis@example.com', 'pass', 'student'));
    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;

    component.ngOnInit();

    expect(component.profileForm.value.lastName).toBe('');
  });
});