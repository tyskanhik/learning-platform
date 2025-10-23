import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoDirective } from '@jsverse/transloco';
import { LanguageService } from '../../core/services/language.service';
import { CourseModel } from '../../core/models/course.model';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';

// NGXS импорты вместо NgRx
import { UserState } from '../../core/store/user.state';
import { CourseState } from '../../core/store/course.state';


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
  lessons: LocalizedLesson[];
}

interface LocalizedLesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
}

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    Header,
    TranslocoDirective
  ],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  languageService = inject(LanguageService);

  course = signal<CourseModel | null>(null);
  currentUser = toSignal(this.store.select(UserState.currentUser), { initialValue: null });

  private progressCache = new Map<number, number>();
  progress = signal<number>(0);
  isLoading = signal(true);

  localizedCourse = computed(() => {
    const course = this.course();
    if (!course) return null;

    const currentLang = this.languageService.currentLang();
    return {
      id: course.id,
      title: course.getTitle(currentLang),
      description: course.getDescription(currentLang),
      category: course.getCategory(currentLang),
      author: course.author,
      rating: course.rating,
      difficulty: course.difficulty,
      objectives: course.getObjectives(currentLang),
      program: course.getProgram(currentLang),
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: this.languageService.getLocalizedValue(lesson.title),
        description: this.languageService.getLocalizedValue(lesson.description),
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        order: lesson.order
      }))
    } as LocalizedCourse;
  });

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.select(CourseState.courseById(courseId)).subscribe(course => {
      if (course) {
        this.course.set(course);

        if (this.currentUser()) {
          if (!this.progressCache.has(courseId)) {
            this.progressCache.set(courseId, Math.floor(Math.random() * 100));
          }
          this.progress.set(this.progressCache.get(courseId)!);
        }
      }
      this.isLoading.set(false);
    });
  }

  navigateToLesson(courseId: number, lessonId: number) {
    if (this.currentUser()) {
      this.router.navigate(['/lesson', courseId, lessonId]);
    }
  }

  getDifficultyText(difficulty: string): string {
    const translations = {
      beginner: { en: 'Beginner', ru: 'Начинающий' },
      intermediate: { en: 'Intermediate', ru: 'Средний' },
      advanced: { en: 'Advanced', ru: 'Продвинутый' }
    };
    
    return this.languageService.getLocalizedValue(
      translations[difficulty as keyof typeof translations] || translations.beginner
    );
  }
}