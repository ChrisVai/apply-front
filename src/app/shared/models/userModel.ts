import {ApplicationModel} from "./applicationModel";

export interface UserModel {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  applications?: ApplicationModel[];
}
