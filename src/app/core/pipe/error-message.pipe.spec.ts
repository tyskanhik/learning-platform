import { TestBed } from '@angular/core/testing';
import { ErrorMessagePipe } from './error-massege.pipe';
import { TranslocoService } from '@jsverse/transloco';
import { FormControl, Validators } from '@angular/forms';

describe('ErrorMessagePipe', () => {
  let pipe: ErrorMessagePipe;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(() => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    translocoServiceSpy.translate.and.callFake((key: string, params?: any) => {
      const translations: { [key: string]: string } = {
        'validation.required': 'This field is required',
        'validation.email': 'Please enter a valid email',
        'validation.minlength': `Minimum ${params?.chars} characters required`,
        'validation.pattern': 'Invalid format',
        'validation.email_exists': 'Email already exists',
        'validation.password_mismatch': 'Passwords do not match'
      };
      return translations[key] || key;
    });

    TestBed.configureTestingModule({
      providers: [
        ErrorMessagePipe,
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    });

    pipe = TestBed.inject(ErrorMessagePipe);
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  describe('transform', () => {
    it('должен возвращать null если control не существует', () => {
      const result = pipe.transform(null, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBeNull();
    });

    it('должен возвращать null если control не touched', () => {
      const control = new FormControl('', Validators.required);
      control.markAsUntouched();
      
      const result = pipe.transform(control, { touched: false, valid: false, errorsCount: 1 });
      
      expect(result).toBeNull();
    });

    it('должен возвращать null если нет ошибок', () => {
      const control = new FormControl('valid value', Validators.required);
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: true, errorsCount: 0 });
      
      expect(result).toBeNull();
    });

    it('должен возвращать сообщение для required ошибки', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBe('This field is required');
      expect(translocoService.translate).toHaveBeenCalledWith('validation.required');
    });

    it('должен возвращать сообщение для email ошибки', () => {
      const control = new FormControl('invalid-email', Validators.email);
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBe('Please enter a valid email');
      expect(translocoService.translate).toHaveBeenCalledWith('validation.email');
    });

    it('должен возвращать сообщение для minlength ошибки с параметрами', () => {
      const control = new FormControl('ab', Validators.minLength(5));
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBe('Minimum 5 characters required');
      expect(translocoService.translate).toHaveBeenCalledWith('validation.minlength', { chars: 5 });
    });

    it('должен возвращать сообщение для pattern ошибки', () => {
      const control = new FormControl('abc', Validators.pattern(/^[0-9]+$/));
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBe('Invalid format');
      expect(translocoService.translate).toHaveBeenCalledWith('validation.pattern');
    });

    it('должен возвращать сообщение для кастомной ошибки emailExists', () => {
      const control = new FormControl('test@example.com');
      control.setErrors({ emailExists: true });
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBe('Email already exists');
      expect(translocoService.translate).toHaveBeenCalledWith('validation.email_exists');
    });

    it('должен возвращать сообщение для кастомной ошибки passwordMismatch', () => {
      const control = new FormControl('password');
      control.setErrors({ passwordMismatch: true });
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBe('Passwords do not match');
      expect(translocoService.translate).toHaveBeenCalledWith('validation.password_mismatch');
    });

    it('должен возвращать null для неизвестной ошибки', () => {
      const control = new FormControl('test');
      control.setErrors({ unknownError: true });
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBeNull();
    });

    it('должен возвращать первую ошибку при множественных ошибках', () => {
      const control = new FormControl('', [Validators.required, Validators.minLength(5)]);
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 2 });

      expect(result).toBe('This field is required');
    });

    it('должен корректно обрабатывать функцию с параметрами для minlength', () => {
      const control = new FormControl('a', Validators.minLength(10));
      control.markAsTouched();
      
      const result = pipe.transform(control, { touched: true, valid: false, errorsCount: 1 });
      
      expect(result).toBe('Minimum 10 characters required');
      expect(translocoService.translate).toHaveBeenCalledWith('validation.minlength', { chars: 10 });
    });

    it('должен работать с controlState но использовать реальный control для проверки touched', () => {
      const control = new FormControl('', Validators.required);
      control.markAsTouched();

      const result = pipe.transform(control, { touched: false, valid: false, errorsCount: 1 });

      expect(result).toBe('This field is required');
    });
  });
});