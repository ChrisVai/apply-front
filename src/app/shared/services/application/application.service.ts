import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { ApplicationModel } from '../../models/applicationModel';
import { Observable } from 'rxjs';
import { AuthService } from '../../../features/auth/service/authService/auth.service';
import { UserModel } from '../../models/userModel';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _ApiUrlApplications: string =
    environment.apiUrl + '/applications';
  private readonly _currentUser: Signal<UserModel | null> =
    this._authService.currentUser;
  private readonly _storageService: StorageService = inject(StorageService);

  getCurrentUserApplications(): Observable<ApplicationModel[]> {
    return this._http.get<ApplicationModel[]>(
      `${this._ApiUrlApplications}/me/${this._storageService.getUserId()}`,
      { withCredentials: true }
    );
  }

  addApplication(application: ApplicationModel): Observable<ApplicationModel> {
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
