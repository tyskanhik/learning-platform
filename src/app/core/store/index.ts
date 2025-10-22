import { ActionReducerMap } from '@ngrx/store';
import { UserState } from './user/user.state';
import { userReducer } from './user/user.reducer';



export interface AppState {
  user: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
};