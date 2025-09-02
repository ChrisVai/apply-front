import {
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  HttpClient,
  httpResource,
  HttpResourceRef,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { ApplicationModel, Status } from '../../models/applicationModel';
import { BehaviorSubject, Observable, switchMap, tap, map } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  /**
   * Dependencies
   * @private
   */
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _storageService: StorageService = inject(StorageService);
  /**
   * Env
   * @private
   */
  private readonly _apiUrlApplications: string =
    environment.apiUrl + '/applications';
  /**
  /**
   * Public properties
   */
  currentUserApplicationResource: HttpResourceRef<ApplicationModel[]> =
    this.getCurrentUserApplicationsResource();
  applicationsTotalCount: WritableSignal<number> = signal<number>(0);
  countApplicationsToApply: WritableSignal<number> = signal<number>(0);
  countApplicationsClosed: WritableSignal<number> = signal<number>(0);
  countApplicationsApplied: WritableSignal<number> = signal<number>(0);
  countApplicationsToRelaunch: WritableSignal<number> = signal<number>(0);
  countApplicationsRelaunched: WritableSignal<number> = signal<number>(0);
  /**
   * Functions
   */
  refreshApplications(): void {
    // Reset application's count
    this.applicationsTotalCount.set(0);
    this.countApplicationsToApply.set(0);
    this.countApplicationsClosed.set(0);
    this.countApplicationsApplied.set(0);
    this.countApplicationsToRelaunch.set(0);
    this.countApplicationsRelaunched.set(0);
    // Trig the refresh
    this.currentUserApplicationResource.reload();
  }

  countApplicationsByStatus(applications: ApplicationModel[]) {
    for (let application of applications) {
      this.applicationsTotalCount.set(applications.length);
      switch (application.status) {
        case Status.closed:
          this.countApplicationsClosed.update(value => value + 1);
          break;
        case Status.applied:
          this.countApplicationsApplied.update(value => value + 1);
          break;
        case Status.toApply:
          this.countApplicationsToApply.update(value => value + 1);
          break;
        case Status.relaunched:
          this.countApplicationsRelaunched.update(value => value + 1);
          break;
        case Status.toRelaunch:
          this.countApplicationsToRelaunch.update(value => value + 1);
      }
    }
  }
  getCurrentUserApplicationsResource() {
    const currentUserApplicationsRef =
      this.fetchCurrentUserApplicationsResource();
    this.countApplicationsByStatus(currentUserApplicationsRef.value());
    return currentUserApplicationsRef;
  }

  fetchCurrentUserApplicationsResource() {
    return httpResource<ApplicationModel[]>(
      () =>
        `${this._apiUrlApplications}/me/${this._storageService.getUserId()}`,
      {
        defaultValue: [],
      }
    );
  }

  addApplication(application: ApplicationModel): Observable<ApplicationModel> {
    return this._http.post<ApplicationModel>(
      `${this._apiUrlApplications}`,
      {
        user: application.userId,
        title: application.title,
        sector: application.sectorId,
        company: application.companyId,
        offerUrl: application.offerUrl,
        applied: application.applied,
        appliedOn: application.appliedOn,
        comments: application.comments,
        status: application.status,
      },
      { withCredentials: true }
    );
  }

  updateApplicationById(id: number, application: Partial<ApplicationModel>) {
    return this._http.patch<Partial<ApplicationModel>>(
      `${this._apiUrlApplications}/${id}`,
      {
        title: application.title,
        offerUrl: application.offerUrl,
        applied: application.applied,
        appliedOn: application.appliedOn,
        comments: application.comments,
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
