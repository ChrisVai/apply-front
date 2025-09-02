import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CompanyModel } from '../../models/companyModel';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  /**
   * Dependencies
   * @private
   */
  private readonly _http: HttpClient = inject(HttpClient);
  /**
   * Env
   * @private
   */
  private readonly _apiUrlCompanies: string = environment.apiUrl + '/companies';
  /**
   * Triggers
   */
  private _refreshCompaniesTrigger$: BehaviorSubject<void> =
    new BehaviorSubject<void>(undefined);
  /**
   * Public Properties
   */
  allCompanies$: Observable<CompanyModel[]> =
    this._refreshCompaniesTrigger$.pipe(
      switchMap(() => this.getAllCompanies())
    );
  allCompaniesSignal: Signal<CompanyModel[]> = toSignal(this.allCompanies$, {
    initialValue: [],
  });
  /**
   * Functions
   */
  refreshCompanies() {
    this._refreshCompaniesTrigger$.next();
  }

  getAllCompanies(): Observable<CompanyModel[]> {
    return this._http.get<CompanyModel[]>(`${this._apiUrlCompanies}`, {
      withCredentials: true,
    });
  }

  addCompany(company: CompanyModel): Observable<CompanyModel> {
    return this._http.post<CompanyModel>(
      `${this._apiUrlCompanies}`,
      {
        name: company.name,
        websiteUrl: company.websiteUrl,
        postalAddress: company.postalAddress,
        emailContactAddress: company.emailContactAddress,
      },
      { withCredentials: true }
    );
  }
}
