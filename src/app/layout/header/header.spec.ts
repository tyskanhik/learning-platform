import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { UserService } from '../../core/services/user.service';
import { LanguageService } from '../../core/services/language.service';
import { Router } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { UserModel } from '../../core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

describe('HeaderComponent', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let userService: jasmine.SpyObj<UserService>;
  let languageService: jasmine.SpyObj<LanguageService>;
  let router: jasmine.SpyObj<Router>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  let currentUserSignal: WritableSignal<UserModel | null>;
  let currentLangSignal: WritableSignal<'ru' | 'en'>;

  beforeEach(() => {
    currentUserSignal = signal<UserModel | null>(null);
    currentLangSignal = signal<'ru' | 'en'>('ru');

    const userServiceSpy = jasmine.createSpyObj('UserService', ['logout'], {
      currentUser: currentUserSignal.asReadonly()
    });

    const languageServiceSpy = jasmine.createSpyObj('LanguageService', 
      ['getCurrentLanguage', 'setLanguage'], 
      {
        currentLang: currentLangSignal.asReadonly()
      }
    );

    languageServiceSpy.getCurrentLanguage.and.callFake(() => currentLangSignal());
    languageServiceSpy.setLanguage.and.callFake((lang: 'ru' | 'en') => {
      currentLangSignal.set(lang);
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['setActiveLang', 'getActiveLang']);

    TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    languageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  it('должен инициализировать текущий язык из LanguageService', () => {
    currentLangSignal.set('ru');
    
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    expect(component.currentLang()).toBe('ru');
    expect(languageService.getCurrentLanguage).toHaveBeenCalled();
  });

  describe('switchLanguage', () => {
    it('должен переключать язык на русский', () => {
      component.switchLanguage('ru');

      expect(languageService.setLanguage).toHaveBeenCalledWith('ru');
      expect(component.currentLang()).toBe('ru');
    });

    it('должен переключать язык на английский', () => {
      component.switchLanguage('en');

      expect(languageService.setLanguage).toHaveBeenCalledWith('en');
      expect(component.currentLang()).toBe('en');
    });
  });

  describe('onLogout', () => {
    it('должен разлогинить пользователя и перенаправить на главную', () => {
      component.onLogout();

      expect(userService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  it('должен получать текущего пользователя из UserService', () => {
    const testUser = new UserModel(1, 'John', 'Doe', 'john@test.com', 'pass', 'teacher');
    currentUserSignal.set(testUser);
    
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    expect(component.currentUser()).toEqual(testUser);
  });

  it('должен работать когда пользователя нет', () => {
    currentUserSignal.set(null);
    
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    expect(component.currentUser()).toBeNull();
  });
});