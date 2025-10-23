import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ErrorMessagePipe } from "../../core/pipe/error-massege.pipe";
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import * as UserSelectors from '../../core/store/user/user.selectors';
import * as UserActions from '../../core/store/user/user.actions';
import { UserModel } from '../../core/models/user.model';

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
    TranslocoPipe,
    ErrorMessagePipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  currentUser = toSignal(this.store.select(UserSelectors.selectCurrentUser), { initialValue: null });
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
    // Обновляем форму при изменении пользователя
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
      // Сбрасываем форму к исходным значениям пользователя
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
      
      const userData: Partial<UserModel> = {
        firstName: formValue.firstName!,
        lastName: formValue.lastName || '',
        email: formValue.email!
      };

      if (formValue.newPassword) {
        userData.password = formValue.newPassword;
      }
      
      this.store.dispatch(UserActions.updateUserProfile({ userData }));
      
      this.snackBar.open(
        'Profile updated successfully',
        'Close', 
        { duration: 3000 }
      );
      this.isEditing.set(false);
    } else {
      this.markFormGroupTouched();
    }
  }

  logout() {
    this.store.dispatch(UserActions.logoutUser());
    this.router.navigate(['/']);
  }

  getRoleTranslation(user: UserModel | null): string {
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