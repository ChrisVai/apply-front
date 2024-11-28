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

  user: Signal<UserModel | null> = this._user.asReadonly();
  accessToken: WritableSignal<String | null> = signal<String | null>(null);
  refreshToken: WritableSignal<String | null> = signal<String | null>(null);
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
          this.accessToken.set(response.tokens.access_token);
          this.refreshToken.set(response.tokens.refresh_token);
          //todo à virer debug
          console.log('response dans authService', response);
          console.log('response User dans authService', response.currentUser);
          console.log('response tokens dans AuthService', response.tokens);
        })
      );
  }
}
