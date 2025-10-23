import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as CourseActions from './course.actions';
import { MOCK_COURSES } from '../../../../assets/data/mock-data';


@Injectable()
export class CourseEffects {
  private actions$ = inject(Actions);

  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourses),
      mergeMap(() => 
        of(MOCK_COURSES).pipe(
          map(courses => CourseActions.loadCoursesSuccess({ courses })),
          catchError(error => of(CourseActions.loadCoursesSuccess({ courses: [] })))
        )
      )
    )
  );
}
