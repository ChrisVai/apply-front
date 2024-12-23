import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { ApplicationModel } from '../../models/applicationModel';
import { Observable } from 'rxjs';
import { AuthService } from '../../../features/auth/service/authService/auth.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _apiUrlApplications: string =
    environment.apiUrl + '/applications';
  private readonly _storageService: StorageService = inject(StorageService);

  getCurrentUserApplications(): Observable<ApplicationModel[]> {
    return this._http.get<ApplicationModel[]>(
      `${this._apiUrlApplications}/me/${this._storageService.getUserId()}`,
      { withCredentials: true }
    );
  }

  addApplication(application: ApplicationModel): Observable<ApplicationModel> {
    return this._http.post<ApplicationModel>(
      `${this._apiUrlApplications}`,
      {
        user: application.userId,
        title: application.title,
        company: application.companyId,
        offerUrl: application.offerUrl,
        applied: application.applied,
        appliedOn: application.appliedOn,
        status: application.status,
      },
      { withCredentials: true }
    );
  }

  deleteApplicationById(id: number) {
    return this._http.delete(`${this._apiUrlApplications}/${id}`, {
      withCredentials: true,
    });
  }
}
