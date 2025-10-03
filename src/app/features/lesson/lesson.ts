import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseService } from '../../core/services/course.service';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { LanguageService } from '../../core/services/language.service';
import { CourseModel, Lesson as CourseLesson } from '../../core/models/course.model';

interface LocalizedCourse {
  id: number;
  title: string;
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
  selector: 'app-lesson',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Header,
    TranslocoDirective,
  ],
  templateUrl: './lesson.html',
  styleUrl: './lesson.scss'
})
export class Lesson implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  languageService = inject(LanguageService);

  course = signal<CourseModel | null>(null);
  lesson = signal<CourseLesson | null>(null);
  currentLessonIndex = signal<number>(0);
  totalLessons = signal<number>(0);
  isLoading = signal(true);
  error = signal<string | null>(null);

  localizedCourse = computed(() => {
    const course = this.course();
    if (!course) return null;

    const currentLang = this.languageService.currentLang();
    return {
      id: course.id,
      title: course.getTitle(currentLang),
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

  localizedLesson = computed(() => {
    const lesson = this.lesson();
    if (!lesson) return null;

    return {
      id: lesson.id,
      title: this.languageService.getLocalizedValue(lesson.title),
      description: this.languageService.getLocalizedValue(lesson.description),
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      order: lesson.order
    } as LocalizedLesson;
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = Number(params['courseId']);
      const lessonId = Number(params['lessonId']);
      this.loadLesson(courseId, lessonId);
    });
  }

  private loadLesson(courseId: number, lessonId: number) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      const result = this.courseService.getLessonById(courseId, lessonId);
      
      if (result) {
        this.course.set(result.course);
        this.lesson.set(result.lesson);
        this.currentLessonIndex.set(result.lessonIndex);
        this.totalLessons.set(result.course.lessons.length);
      } else {
        this.error.set('Lesson not found');
      }
    } catch (err) {
      this.error.set('Failed to load lesson');
    } finally {
      this.isLoading.set(false);
    }
  }

  navigateToLesson(lessonId: number) {
    if (this.course()) {
      this.router.navigate(['/lesson', this.course()!.id, lessonId]);
    }
  }

  nextLesson() {
    const nextIndex = this.currentLessonIndex() + 1;
    const lessons = this.course()?.lessons;
    
    if (lessons && nextIndex < lessons.length) {
      const nextLesson = lessons[nextIndex];
      this.navigateToLesson(nextLesson.id);
    }
  }

  previousLesson() {
    const prevIndex = this.currentLessonIndex() - 1;
    const lessons = this.course()?.lessons;
    
    if (lessons && prevIndex >= 0) {
      const prevLesson = lessons[prevIndex];
      this.navigateToLesson(prevLesson.id);
    }
  }

  backToCourse() {
    if (this.course()) {
      this.router.navigate(['/course', this.course()!.id]);
    } else {
      this.router.navigate(['/courses']);
    }
  }

  hasNextLesson(): boolean {
    return this.currentLessonIndex() < this.totalLessons() - 1;
  }

  hasPreviousLesson(): boolean {
    return this.currentLessonIndex() > 0;
  }
}