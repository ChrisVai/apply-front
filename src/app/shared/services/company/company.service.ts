import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { CompanyModel } from '../../models/companyModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _apiUrlCompanies: string = environment.apiUrl + '/companies';

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
