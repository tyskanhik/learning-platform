import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseState } from './course.state';

export const selectCourseState = createFeatureSelector<CourseState>('courses');

export const selectAllCourses = createSelector(
  selectCourseState,
  (state: CourseState) => state.courses
);

export const selectCourseById = (courseId: number) => 
  createSelector(selectAllCourses, courses => 
    courses.find(course => course.id === courseId)
  );

export const selectLessonById = (courseId: number, lessonId: number) => 
  createSelector(selectCourseById(courseId), course => {
    if (!course) return null;
    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) return null;
    return {
      course,
      lesson: course.lessons[lessonIndex],
      lessonIndex
    };
  });

export const selectSearchResults = (query: string) => 
  createSelector(selectAllCourses, courses => {
    const searchTerm = query.toLowerCase();
    return courses.filter(course =>
      course.title.en.toLowerCase().includes(searchTerm) ||
      course.title.ru.toLowerCase().includes(searchTerm) ||
      course.description.en.toLowerCase().includes(searchTerm) ||
      course.description.ru.toLowerCase().includes(searchTerm) ||
      course.author.toLowerCase().includes(searchTerm) ||
      course.category.en.toLowerCase().includes(searchTerm) ||
      course.category.ru.toLowerCase().includes(searchTerm)
    );
  });

export const selectCoursesByDifficulty = (difficulty: string) => 
  createSelector(selectAllCourses, courses => 
    courses.filter(course => course.difficulty === difficulty)
  );

export const selectCoursesByAuthor = (author: string) => 
  createSelector(selectAllCourses, courses => 
    courses.filter(course => 
      course.author.toLowerCase().includes(author.toLowerCase())
    )
  );

export const selectCategories = (lang: 'en' | 'ru') => 
  createSelector(selectAllCourses, courses => {
    const categories = courses.map(course => course.getCategory(lang));
    return [...new Set(categories)].sort();
  });

export const selectFeaturedCourses = (limit: number = 3) => 
  createSelector(selectAllCourses, courses => 
    courses
      .filter(course => course.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  );

export const selectNewestCourses = (limit: number = 3) => 
  createSelector(selectAllCourses, courses => 
    courses
      .sort((a, b) => b.id - a.id)
      .slice(0, limit)
  );

export const selectTotalLessonsCount = createSelector(
  selectAllCourses,
  courses => courses.reduce((total, course) => total + course.lessons.length, 0)
);

export const selectCoursesCount = createSelector(
  selectAllCourses,
  courses => courses.length
);