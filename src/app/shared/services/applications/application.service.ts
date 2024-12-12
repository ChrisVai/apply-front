import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _ApiUrl: string = environment.apiUrl;

  getApplicationsById(id: Number) {
    return toSignal(
      this._http.get(`${this._ApiUrl}/applications/${id}`, {
        withCredentials: true,
      })
    );
  }
}
