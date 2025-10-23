import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Transloco
import { TranslocoPipe } from '@jsverse/transloco';

// Components and Services
import { Header } from '../header/header';
import { LanguageService } from '../../core/services/language.service';

// NgRx
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserModel } from '../../core/models/user.model';
import * as UserSelectors from '../../core/store/user/user.selectors';
import * as CourseActions from '../../core/store/course/course.actions';
import * as CourseSelectors from '../../core/store/course/course.selectors';

// Types
interface LocalizedCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  rating: number;
  difficulty: string;
  objectives: string[];
  program: string[];
  lessons: any[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    TranslocoPipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit {
  // Services
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private store = inject(Store);

  // NgRx Signals
  courses = toSignal(this.store.select(CourseSelectors.selectAllCourses), { initialValue: [] });
  currentUser = toSignal(this.store.select(UserSelectors.selectCurrentUser), { initialValue: null });
  
  // Filter signals
  searchTerm = signal('');
  selectedCategory = signal('');
  selectedDifficulty = signal('');
  
  // Progress tracking
  private progressCache = new Map<number, number>();
  isLoading = signal(false);

  // Computed properties
  localizedCourses = computed(() => {
    const currentLang = this.languageService.currentLang();
    return this.courses().map(course => ({
      id: course.id,
      title: course.getTitle(currentLang),
      description: course.getDescription(currentLang),
      category: course.getCategory(currentLang),
      author: course.author,
      rating: course.rating,
      difficulty: course.difficulty,
      objectives: course.getObjectives(currentLang),
      program: course.getProgram(currentLang),
      lessons: course.lessons.map(lesson => ({
        ...lesson,
        title: this.languageService.getLocalizedValue(lesson.title),
        description: this.languageService.getLocalizedValue(lesson.description)
      }))
    }));
  });

  categories = computed(() => {
    const categories = this.localizedCourses().map(course => course.category);
    return [...new Set(categories)].sort();
  });

  difficulties = computed(() => {
    const difficulties = this.courses().map(course => course.difficulty);
    return [...new Set(difficulties)];
  });

  filteredCourses = computed(() => {
    const searchTerm = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const difficulty = this.selectedDifficulty();

    return this.localizedCourses().filter(course => {
      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.author.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !category || course.category === category;
      const matchesDifficulty = !difficulty || course.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  });

  // Methods
  ngOnInit(): void {
    this.store.dispatch(CourseActions.loadCourses());
    this.initializeProgress();
  }

  private initializeProgress(): void {
    this.courses().forEach(course => {
      if (!this.progressCache.has(course.id)) {
        this.progressCache.set(course.id, Math.floor(Math.random() * 100));
      }
    });
  }

  getCourseProgress(courseId: number): number {
    // Всегда возвращаем одно и то же значение для конкретного courseId
    return this.progressCache.get(courseId) || 0;
  }

  getDifficultyText(difficulty: string): string {
    const translations = {
      beginner: { en: 'Beginner', ru: 'Начинающий' },
      intermediate: { en: 'Intermediate', ru: 'Средний' },
      advanced: { en: 'Advanced', ru: 'Продвинутый' }
    };
    
    const translation = translations[difficulty as keyof typeof translations];
    return translation ? this.languageService.getLocalizedValue(translation) : difficulty;
  }

  startLearning(course: LocalizedCourse): void {
    if (course.lessons.length > 0) {
      this.router.navigate(['/lesson', course.id, course.lessons[0].id]);
    }
  }

  viewCourseDetails(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedDifficulty.set('');
  }

  trackByCourseId(index: number, course: LocalizedCourse): number {
    return course.id;
  }

  trackByCategory(index: number, category: string): string {
    return category;
  }

  trackByDifficulty(index: number, difficulty: string): string {
    return difficulty;
  }
}