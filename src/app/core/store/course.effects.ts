import { Injectable } from '@angular/core';
import { StateContext } from '@ngxs/store';
import { LoadCoursesSuccess } from './course.state';
import { MOCK_COURSES } from '../../../assets/data/mock-data';

@Injectable()
export class CourseHandlers {
  async loadCourses(ctx: StateContext<any>) {
    setTimeout(() => {
      ctx.dispatch(new LoadCoursesSuccess(MOCK_COURSES));
    }, 100);
  }
}