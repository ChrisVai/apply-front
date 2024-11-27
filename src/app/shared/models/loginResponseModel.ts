import { UserModel } from './userModel';

export interface LoginResponseModel {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  currentUser: UserModel;
}
