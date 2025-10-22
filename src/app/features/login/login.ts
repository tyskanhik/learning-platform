import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../core/services/user.service';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ErrorMessagePipe } from "../../core/pipe/error-massege.pipe";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslocoDirective,
    TranslocoPipe,
    ErrorMessagePipe
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private userService = inject(UserService);
  private router = inject(Router);

  hidePassword = signal(true);
  isLoading = signal(false);
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      
      try {
        const { email, password } = this.loginForm.value;
        if (email && password && this.userService.login(email, password)) {
          await this.router.navigate(['/']);
        } else {
          this.loginForm.setErrors({ invalidCredentials: true });
        }
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}