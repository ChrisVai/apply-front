import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { UserModel } from '../../../shared/models/userModel';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http: HttpClient = inject(HttpClient);
  private _currentUser: WritableSignal<UserModel | null> =
    signal<UserModel | null>(null);
  private readonly _apiUrl = environment.apiUrl;
  currentUser: Signal<UserModel | null> = this._currentUser.asReadonly();
  isConnected: Signal<Boolean> = computed(() => this.currentUser !== null);

  login(email: string, pass: string): Observable<UserModel> {
    return this._http
      .post<UserModel>(
        this._apiUrl + '/auth/login',
        { email, pass },
        { withCredentials: true }
      )
      .pipe(
        tap(response => {
          this._currentUser.set(response);
        })
      );
  }
}
