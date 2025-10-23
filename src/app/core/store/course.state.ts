import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Course, CourseModel } from '../models/course.model';
import { MOCK_COURSES } from '../../../assets/data/mock-data';

// Actions
export class LoadCourses {
  static readonly type = '[Course] Load Courses';
}

export class LoadCoursesSuccess {
  static readonly type = '[Course] Load Courses Success';
  constructor(public courses: CourseModel[]) {}
}

export class AddCourse {
  static readonly type = '[Course] Add Course';
  constructor(public course: Omit<Course, 'id'>) {}
}

export class UpdateCourseRating {
  static readonly type = '[Course] Update Course Rating';
  constructor(public courseId: number, public newRating: number) {}
}

// State interface
export interface CourseStateModel {
  courses: CourseModel[];
}

// State
@State<CourseStateModel>({
  name: 'courses',
  defaults: {
    courses: []
  }
})
@Injectable()
export class CourseState {
  // Selectors
  @Selector()
  static allCourses(state: CourseStateModel): CourseModel[] {
    return state.courses;
  }

  @Selector()
  static coursesCount(state: CourseStateModel): number {
    return state.courses.length;
  }

  @Selector()
  static totalLessonsCount(state: CourseStateModel): number {
    return state.courses.reduce((total, course) => total + course.lessons.length, 0);
  }

  // Динамические селекторы
  static courseById(courseId: number) {
    return (state: { courses: CourseStateModel }) => 
      state.courses.courses.find(course => course.id === courseId);
  }

  static lessonById(courseId: number, lessonId: number) {
    return (state: { courses: CourseStateModel }) => {
      const course = state.courses.courses.find(c => c.id === courseId);
      if (!course) return null;
      const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
      if (lessonIndex === -1) return null;
      return {
        course,
        lesson: course.lessons[lessonIndex],
        lessonIndex
      };
    };
  }

  static searchResults(query: string) {
    return (state: { courses: CourseStateModel }) => {
      const searchTerm = query.toLowerCase();
      return state.courses.courses.filter(course =>
        course.title.en.toLowerCase().includes(searchTerm) ||
        course.title.ru.toLowerCase().includes(searchTerm) ||
        course.description.en.toLowerCase().includes(searchTerm) ||
        course.description.ru.toLowerCase().includes(searchTerm) ||
        course.author.toLowerCase().includes(searchTerm) ||
        course.category.en.toLowerCase().includes(searchTerm) ||
        course.category.ru.toLowerCase().includes(searchTerm)
      );
    };
  }

  static coursesByDifficulty(difficulty: string) {
    return (state: { courses: CourseStateModel }) =>
      state.courses.courses.filter(course => course.difficulty === difficulty);
  }

  static featuredCourses(limit: number = 3) {
    return (state: { courses: CourseStateModel }) =>
      state.courses.courses
        .filter(course => course.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
  }

  // Actions handlers
  @Action(LoadCourses)
  loadCourses(ctx: StateContext<CourseStateModel>) {
    // Имитируем загрузку данных
    setTimeout(() => {
      ctx.dispatch(new LoadCoursesSuccess(MOCK_COURSES));
    }, 100);
  }

  @Action(LoadCoursesSuccess)
  loadCoursesSuccess(ctx: StateContext<CourseStateModel>, action: LoadCoursesSuccess) {
    ctx.patchState({
      courses: action.courses
    });
  }

  @Action(AddCourse)
  addCourse(ctx: StateContext<CourseStateModel>, action: AddCourse) {
    const state = ctx.getState();
    const newId = state.courses.length > 0 ? Math.max(...state.courses.map(c => c.id)) + 1 : 1;
    
    const newCourse = new CourseModel(
      newId,
      action.course.title,
      action.course.category,
      action.course.rating,
      action.course.author,
      action.course.description,
      action.course.objectives,
      action.course.program,
      action.course.difficulty,
      action.course.lessons
    );

    ctx.patchState({
      courses: [...state.courses, newCourse]
    });
  }

  @Action(UpdateCourseRating)
  updateCourseRating(ctx: StateContext<CourseStateModel>, action: UpdateCourseRating) {
    const state = ctx.getState();
    const updatedCourses = state.courses.map(course =>
      course.id === action.courseId
        ? new CourseModel(
            course.id,
            course.title,
            course.category,
            action.newRating,
            course.author,
            course.description,
            course.objectives,
            course.program,
            course.difficulty,
            course.lessons
          )
        : course
    );

    ctx.patchState({
      courses: updatedCourses
    });
  }
}