import { LanguageService } from './language.service';
import { TranslocoService } from '@jsverse/transloco';

describe('LanguageService', () => {
  let service: LanguageService;
  let mockTranslocoService: jasmine.SpyObj<TranslocoService>;
  let mockSessionStorage: { [key: string]: string };

  beforeEach(() => {
    mockTranslocoService = jasmine.createSpyObj('TranslocoService', [
      'setActiveLang',
      'getActiveLang'
    ]);
    
    mockSessionStorage = {};
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => 
      mockSessionStorage[key] || null
    );
    spyOn(sessionStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockSessionStorage[key] = value;
    });

    service = new LanguageService(mockTranslocoService, 'browser' as any);
  });

  describe('Инициализация', () => {
    it('должен создавать сервис', () => {
      expect(service).toBeTruthy();
    });

    it('должен инициализироваться с русским языком', () => {
      expect(service.currentLang()).toBe('ru');
    });
  });

  describe('Смена языка', () => {
    it('должен переключать на английский язык', () => {
      service.setLanguage('en');

      expect(service.currentLang()).toBe('en');
      expect(mockTranslocoService.setActiveLang).toHaveBeenCalledWith('en');
    });

    it('должен переключать на русский язык', () => {
      service.setLanguage('ru');

      expect(service.currentLang()).toBe('ru');
      expect(mockTranslocoService.setActiveLang).toHaveBeenCalledWith('ru');
    });

    it('должен сохранять язык в sessionStorage', () => {
      service.setLanguage('en');

      expect(sessionStorage.setItem).toHaveBeenCalledWith('user-language', 'en');
    });
  });

  describe('Локализация', () => {
    it('должен возвращать английское значение', () => {
      service.setLanguage('en');
      const value = { en: 'Hello', ru: 'Привет' };

      const result = service.getLocalizedValue(value);

      expect(result).toBe('Hello');
    });

    it('должен возвращать русское значение', () => {
      service.setLanguage('ru');
      const value = { en: 'Hello', ru: 'Привет' };

      const result = service.getLocalizedValue(value);

      expect(result).toBe('Привет');
    });

    it('должен локализовать массив значений', () => {
      service.setLanguage('en');
      const items = [
        { en: 'Hello', ru: 'Привет' },
        { en: 'World', ru: 'Мир' }
      ];

      const result = service.getLocalizedArray(items);

      expect(result).toEqual(['Hello', 'World']);
    });
  });

  describe('Session Storage', () => {
    it('должен восстанавливать язык из sessionStorage', () => {
      mockSessionStorage['user-language'] = 'en';

      service.initializeLanguage();

      expect(service.currentLang()).toBe('en');
    });
  });
});