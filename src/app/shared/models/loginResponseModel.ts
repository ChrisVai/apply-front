import { UserModel } from './userModel';

export interface LoginResponseModel {
  access_token: string;
  currentUser: UserModel;
}
