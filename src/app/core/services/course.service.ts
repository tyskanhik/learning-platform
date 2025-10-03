import { Injectable, signal } from '@angular/core';
import { Course, CourseModel, Lesson } from '../models/course.model';
import { MOCK_COURSES } from '../../../assets/data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesSignal = signal<CourseModel[]>(MOCK_COURSES);
  courses = this.coursesSignal.asReadonly();

  getCourseById(id: number): CourseModel | undefined {
    return this.coursesSignal().find(course => course.id === id);
  }

  getLessonById(courseId: number, lessonId: number): { course: CourseModel, lesson: Lesson, lessonIndex: number } | null {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) return null;

    return {
      course,
      lesson: course.lessons[lessonIndex],
      lessonIndex
    };
  }

  addCourse(course: Omit<Course, 'id'>): void {
    const courses = this.coursesSignal();
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    
    const newCourse = new CourseModel(
      newId,
      course.title,
      course.category,
      course.rating,
      course.author,
      course.description,
      course.objectives,
      course.program,
      course.difficulty,
      course.lessons
    );
    
    this.coursesSignal.update(courses => [...courses, newCourse]);
  }

  getLocalizedCourse(courseId: number, lang: 'en' | 'ru'): any {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    return {
      ...course,
      title: course.getTitle(lang),
      description: course.getDescription(lang),
      category: course.getCategory(lang),
      objectives: course.getObjectives(lang),
      program: course.getProgram(lang),
      lessons: course.lessons.map(lesson => ({
        ...lesson,
        title: lesson.title[lang],
        description: lesson.description[lang]
      }))
    };
  }

  getNextLesson(courseId: number, currentLessonId: number): Lesson | null {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    const currentIndex = course.lessons.findIndex(lesson => lesson.id === currentLessonId);
    if (currentIndex === -1 || currentIndex >= course.lessons.length - 1) return null;

    return course.lessons[currentIndex + 1];
  }

  getPreviousLesson(courseId: number, currentLessonId: number): Lesson | null {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    const currentIndex = course.lessons.findIndex(lesson => lesson.id === currentLessonId);
    if (currentIndex <= 0) return null;

    return course.lessons[currentIndex - 1];
  }

  searchCourses(query: string): CourseModel[] {
    const searchTerm = query.toLowerCase();
    return this.coursesSignal().filter(course =>
      course.title.en.toLowerCase().includes(searchTerm) ||
      course.title.ru.toLowerCase().includes(searchTerm) ||
      course.description.en.toLowerCase().includes(searchTerm) ||
      course.description.ru.toLowerCase().includes(searchTerm) ||
      course.author.toLowerCase().includes(searchTerm) ||
      course.category.en.toLowerCase().includes(searchTerm) ||
      course.category.ru.toLowerCase().includes(searchTerm)
    );
  }

  getCoursesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): CourseModel[] {
    return this.coursesSignal().filter(course => course.difficulty === difficulty);
  }

  getCoursesByAuthor(author: string): CourseModel[] {
    return this.coursesSignal().filter(course => 
      course.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  getCategories(lang: 'en' | 'ru'): string[] {
    const categories = this.coursesSignal().map(course => course.getCategory(lang));
    return [...new Set(categories)].sort();
  }

  updateCourseRating(courseId: number, newRating: number): boolean {
    const course = this.getCourseById(courseId);
    if (!course) return false;
    console.log(`Updating rating for course ${courseId} to ${newRating}`);
    return true;
  }

  getCourseProgress(courseId: number): number {
    // Заглушка для прогресса - в реальном приложении бралось бы из API
    const course = this.getCourseById(courseId);
    if (!course) return 0;
    
    // Генерируем случайный прогресс для демонстрации
    return Math.floor(Math.random() * 100);
  }

  isValidCourse(course: Omit<Course, 'id'>): boolean {
    return !!(course.title?.en && course.title?.ru && 
              course.description?.en && course.description?.ru && 
              course.author && course.lessons?.length > 0);
  }

  getTotalLessonsCount(): number {
    return this.coursesSignal().reduce((total, course) => total + course.lessons.length, 0);
  }

  getCoursesCount(): number {
    return this.coursesSignal().length;
  }

  getFeaturedCourses(limit: number = 3): CourseModel[] {
    return this.coursesSignal()
      .filter(course => course.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getNewestCourses(limit: number = 3): CourseModel[] {
    return this.coursesSignal()
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  }
}