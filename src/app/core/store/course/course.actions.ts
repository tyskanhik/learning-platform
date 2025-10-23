import { createAction, props } from '@ngrx/store';
import { Course, CourseModel } from '../../models/course.model';


export const loadCourses = createAction('[Course] Load Courses');
export const loadCoursesSuccess = createAction(
  '[Course] Load Courses Success',
  props<{ courses: CourseModel[] }>()
);

export const addCourse = createAction(
  '[Course] Add Course',
  props<{ course: Omit<Course, 'id'> }>()
);

export const updateCourseRating = createAction(
  '[Course] Update Course Rating',
  props<{ courseId: number; newRating: number }>()
);