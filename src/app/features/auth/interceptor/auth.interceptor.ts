import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { inject, Signal } from '@angular/core';
import { AuthService } from '../service/authService/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService: AuthService = inject(AuthService);
  const access_token: Signal<string | null> = authService.access_token;
  const authHeaders = new HttpHeaders({
    Authorization: `Bearer ${access_token()}`,
  });
  const newReq = req.clone({
    headers: authHeaders,
  });
  if (!access_token() || access_token() === null) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return authService.reNewTokens().pipe(
            switchMap(() => {
              const reqWithToken = req.clone({
                headers: new HttpHeaders({
                  Authorization: `Bearer ${access_token()}`,
                }),
              });
              return next(reqWithToken);
            }),
            catchError(refreshError => {
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
  return next(newReq);
}
