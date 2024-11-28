import {
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/authService/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const access_token: string | null = authService.access_token();

  if (!access_token) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return authService.revokeToken().pipe(
            switchMap(() => next(newReq)),
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

  const headers = new HttpHeaders({
    Authorization: `Bearer ${access_token}`,
  });

  const newReq = req.clone({
    headers,
  });

  return next(newReq);
};
