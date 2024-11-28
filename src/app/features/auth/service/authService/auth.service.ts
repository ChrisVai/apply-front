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
  private _currentUser: WritableSignal<UserModel | null> =
    signal<UserModel | null>(null);
  private readonly _apiUrl = environment.apiUrl;
  private _access_token: WritableSignal<string | null> = signal<string | null>(
    null
  );
  currentUser: Signal<UserModel | null> = this._currentUser.asReadonly();
  access_token: Signal<string | null> = this._access_token.asReadonly();
  isConnected: Signal<Boolean> = computed(() => this.currentUser !== null);

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
          this._currentUser.set(response.currentUser);
          this._access_token.set(response.access_token);
        })
      );
  }

  revokeToken(): Observable<LoginResponseModel> {
    return this._http
      .post<LoginResponseModel>(
        this._apiUrl + 'auth/refresh-tokens',
        { user: this.currentUser() },
        { withCredentials: true }
      )
      .pipe(
        tap(response => {
          console.log(
            'authService/revokeToken: les tokens ont été rafraichis',
            response.access_token
          );
          console.log(
            'authService/revokeToken: le user a été rafraichi',
            response.currentUser
          );
        })
      );
  }

  logout() {
    return this._http
      .post<any>(
        this._apiUrl + '/auth/clear-auth-cookie',
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this._currentUser.set(null);
          this._access_token.set(null);
        })
      );
  }
}
