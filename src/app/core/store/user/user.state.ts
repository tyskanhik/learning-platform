import { UserModel } from '../../models/user.model';

export interface UserState {
  currentUser: UserModel | null;
  initialized: boolean;
}

export const initialUserState: UserState = {
  currentUser: null,
  initialized: false
};