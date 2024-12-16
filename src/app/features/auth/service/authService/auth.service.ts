import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { UserModel } from '../../../../shared/models/userModel';
import { LoginResponseModel } from '../../../../shared/models/loginResponseModel';
import { StorageService } from '../../../../shared/services/storage/storage.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _handler: HttpBackend = inject(HttpBackend);
  //Use _httpWithHandler to bypass Interceptor when we don't want to add access_token to the request
  private readonly _httpWithHandler: HttpClient = new HttpClient(this._handler);
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _storageService: StorageService = inject(StorageService);
  private readonly _router: Router = inject(Router);
  private _currentUser: WritableSignal<UserModel | null> =
    signal<UserModel | null>(null);
  private readonly _apiUrl = environment.apiUrl;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private _access_token: WritableSignal<string | null> = signal<string | null>(
    null
  );
  currentUser: Signal<UserModel | null> = this._currentUser.asReadonly();
  access_token: Signal<string | null> = this._access_token.asReadonly();
  isConnected: Signal<boolean> = computed(
    () =>
      this.currentUser() !== null && this._storageService.getUserId() !== null
  );

  login(email: string, pass: string): Observable<LoginResponseModel> {
    return this._httpWithHandler
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
          this._storageService.saveUserId(response.currentUser.id!);
        })
      );
  }

  reNewTokens(): Observable<LoginResponseModel> {
    return this._http
      .post<LoginResponseModel>(
        this._apiUrl + '/auth/refresh-tokens',
        { id: this._storageService.getUserId() },
        { withCredentials: true }
      )
      .pipe(
        tap(response => {
          this._access_token.set(response.access_token);
          this._currentUser.set(response.currentUser);
        })
      );
  }

  logout() {
    this._currentUser.set(null);
    this._access_token.set(null);
    this._storageService.deleteUserId();
    return this._httpWithHandler
      .post(
        this._apiUrl + '/auth/clear-auth-cookie',
        {},
        { withCredentials: true }
      )
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError(() => {
          return throwError(
            () => new Error('sorry an error occured when logout')
          );
        })
      )
      .subscribe(() => this._router.navigateByUrl('/auth'));
  }
}
