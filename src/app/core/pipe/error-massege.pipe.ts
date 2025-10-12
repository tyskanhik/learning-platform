import { Pipe, PipeTransform, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';

interface ErrorMessages {
  [key: string]: string | ((error: any) => string);
}

@Pipe({
  name: 'errorMessage',
  standalone: true
})
export class ErrorMessagePipe implements PipeTransform {
  
  private translocoService = inject(TranslocoService);

  private defaultErrorMessages: ErrorMessages = {
    required: () => this.translocoService.translate('validation.required'),
    email: () => this.translocoService.translate('validation.email'),
    minlength: (error) => 
      this.translocoService.translate('validation.minlength', { chars: error.requiredLength }),
    pattern: () => this.translocoService.translate('validation.pattern'),
    emailExists: () => this.translocoService.translate('validation.email_exists'),
    passwordMismatch: () => this.translocoService.translate('validation.password_mismatch')
  };

  transform(control: AbstractControl | null, customMessages?: ErrorMessages): string | null {
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    const errorKey = Object.keys(control.errors)[0];
    const errorValue = control.errors[errorKey];
    
    const messages = { ...this.defaultErrorMessages, ...customMessages };
    const message = messages[errorKey];

    if (!message) {
      console.warn(`No error message found for key: ${errorKey}`);
      return null;
    }

    return typeof message === 'function' ? message(errorValue) : message;
  }
}