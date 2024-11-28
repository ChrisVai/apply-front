import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { UserModel } from '../../../../shared/models/userModel';
import { LoginResponseModel } from '../../../../shared/models/loginResponseModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http: HttpClient = inject(HttpClient);
  private _user: WritableSignal<UserModel | null> = signal<UserModel | null>(
    null
  );
  private readonly _apiUrl = environment.apiUrl;
  private _access_token: WritableSignal<String | null> = signal<String | null>(
    null
  );
  user: Signal<UserModel | null> = this._user.asReadonly();
  access_token: Signal<String | null> = this._access_token.asReadonly();
  isConnected: Signal<Boolean> = computed(() => this.user !== null);

  login(email: string, pass: string): Observable<LoginResponseModel> {
    return this._http
      .post<LoginResponseModel>(
        this._apiUrl + '/auth/login',
        {
          email: email,
          password: pass,
        },
        { withCredentials: true }
      )
      .pipe(
        tap(response => {
          this._user.set(response.currentUser);
          this._access_token.set(response.access_token);
        })
      );
  }
}
