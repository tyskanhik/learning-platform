import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
    TranslocoDirective,
    TranslocoPipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private userService = inject(UserService);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  currentUser = this.userService.currentUser;
  isEditing = signal(false);

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmPassword: new FormControl('')
  }, { validators: this.passwordMatchValidator });

  ngOnInit() {
    const user = this.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }

  private passwordMatchValidator(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
    
    if (!this.isEditing()) {
      // Сброс формы при отмене редактирования
      const user = this.currentUser();
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        this.profileForm.markAsPristine();
      }
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      
      // Проверка пароля, если пользователь пытается его сменить
      if (formValue.newPassword) {
        if (!formValue.currentPassword) {
          this.profileForm.get('currentPassword')?.setErrors({ required: true });
          return;
        }
        
        // Здесь должна быть проверка текущего пароля с сервером
        // Для демо просто показываем успех
      }
      
      this.snackBar.open(
        'Profile updated successfully',
        'Close', 
        { duration: 3000 }
      );
      this.isEditing.set(false);
    } else {
      // Пометить все поля как touched для показа ошибок
      this.markFormGroupTouched();
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  getRoleTranslation(): string {
    const user = this.currentUser();
    if (!user) return '';
    
    return user.role === 'teacher' ? 
      'Teacher' : 'Student';
  }

  getPasswordMismatchError(): boolean {
    return this.profileForm.hasError('passwordMismatch') && 
           this.profileForm.get('confirmPassword')!.touched;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }
}