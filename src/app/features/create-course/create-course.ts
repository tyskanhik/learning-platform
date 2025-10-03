import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { LanguageService } from '../../core/services/language.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Header,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    TranslocoDirective,
    TranslocoPipe,
    MatProgressSpinnerModule
],
  templateUrl: './create-course.html',
  styleUrl: './create-course.scss'
})
export class CreateCourse{
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = signal(false);
  
  // Простая форма для демонстрации (нефункционирующая)
  courseForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    difficulty: new FormControl('beginner', [Validators.required]),
    language: new FormControl('ru', [Validators.required])
  });

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.isLoading.set(true);
      setTimeout(() => {
        this.snackBar.open(
          'Course creation functionality is not implemented in this demo',
          'Close',
          { duration: 4000 }
        );
        this.isLoading.set(false);
        this.router.navigate(['/']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.courseForm.controls).forEach(key => {
      const control = this.courseForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}