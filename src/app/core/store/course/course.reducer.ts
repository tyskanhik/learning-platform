import { createReducer, on } from '@ngrx/store';
import { CourseState, initialCourseState } from './course.state';
import * as CourseActions from './course.actions';
import { CourseModel } from '../../models/course.model';


export const courseReducer = createReducer(
  initialCourseState,

  on(CourseActions.loadCoursesSuccess, (state, { courses }): CourseState => ({
    ...state,
    courses
  })),

  on(CourseActions.addCourse, (state, { course }): CourseState => {
    const newId = state.courses.length > 0 ? Math.max(...state.courses.map(c => c.id)) + 1 : 1;
    
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

    return {
      ...state,
      courses: [...state.courses, newCourse]
    };
  }),

  on(CourseActions.updateCourseRating, (state, { courseId, newRating }): CourseState => ({
    ...state,
    courses: state.courses.map(course =>
      course.id === courseId
        ? new CourseModel(
            course.id,
            course.title,
            course.category,
            newRating,
            course.author,
            course.description,
            course.objectives,
            course.program,
            course.difficulty,
            course.lessons
          )
        : course
    )
  }))
);