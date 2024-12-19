import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationModel } from '../../models/applicationModel';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _ApiUrlApplications: string =
    environment.apiUrl + '/applications';

  getApplicationById(id: Number): Signal<ApplicationModel | undefined> {
    return toSignal(
      this._http.get<ApplicationModel>(`${this._ApiUrlApplications}${id}`, {
        withCredentials: true,
      })
    );
  }

  getCurrentUserApplications(userId: number): Signal<ApplicationModel[]> {
    return toSignal(
      this._http.get<ApplicationModel[]>(
        `${this._ApiUrlApplications}/me/${userId}`,
        { withCredentials: true }
      ),
      { initialValue: [] }
    );
  }

  addApplication(application: ApplicationModel) {
    return this._http.post<ApplicationModel>(
      `${this._ApiUrlApplications}`,
      {
        user: application.userId,
        company: application.companyId,
        offerUrl: application.offerUrl,
        applied: application.applied,
        appliedOn: application.appliedOn,
        status: application.status,
      },
      { withCredentials: true }
    );
  }
}
