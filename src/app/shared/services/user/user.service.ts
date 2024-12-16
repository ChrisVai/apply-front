import { inject, Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { UserModel } from '../../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _handler: HttpBackend = inject(HttpBackend);
  //Use _httpWithHandler to bypass Interceptor when we don't want to add access_token to the request
  private readonly _httpWithHandler: HttpClient = new HttpClient(this._handler);
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _userApiUrl: string = environment.apiUrl + '/users';

  createUser(user: UserModel) {
    return this._httpWithHandler.post(this._userApiUrl, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    });
  }
}
