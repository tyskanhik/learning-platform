import { ActionReducerMap } from '@ngrx/store';
import { UserState } from './user/user.state';
import { userReducer } from './user/user.reducer';
import { CourseState } from './course/course.state';
import { courseReducer } from './course/course.reducer';



export interface AppState {
  user: UserState;
  courses: CourseState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  courses: courseReducer,
};