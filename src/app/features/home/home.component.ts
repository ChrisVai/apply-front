import { Component, inject, Signal } from '@angular/core';
import { AddApplicationComponent } from './add-application/add-application.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { CompanyService } from '../../shared/services/company/company.service';
import { CompanyModel } from '../../shared/models/companyModel';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationService } from '../../shared/services/application/application.service';
import { ApplicationModel } from '../../shared/models/applicationModel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AddApplicationComponent,
    AddCompanyComponent,
    MyApplicationsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  /*
   Dependencies
  */
  private readonly _companyService: CompanyService = inject(CompanyService);
  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  /*
    Triggers for refreshing data
  */
  private _refreshApplicationsTrigger$: BehaviorSubject<void> =
    new BehaviorSubject<void>(undefined);
  private _refreshCompaniesTrigger$: BehaviorSubject<void> =
    new BehaviorSubject<void>(undefined);
  /*
     Data as Observables
   */
  allCompanies$: Observable<CompanyModel[]> =
    this._refreshCompaniesTrigger$.pipe(
      switchMap(() => this._companyService.getAllCompanies())
    );
  myApplications$: Observable<ApplicationModel[]> =
    this._refreshApplicationsTrigger$.pipe(
      switchMap(() => this._applicationService.getCurrentUserApplications())
    );
  /*
    Data as Signals
   */
  allCompaniesSignal: Signal<CompanyModel[]> = toSignal(this.allCompanies$, {
    initialValue: [],
  });
  myApplicationsSignal: Signal<ApplicationModel[]> = toSignal(
    //todo consolelog à virer debug
    this.myApplications$.pipe(tap(data => console.log(data))),
    { initialValue: [] }
  );
  /*
    Public variables
   */
  showAddCompanyForm: boolean = false;

  /*
    Functions
   */
  showAddCompanyFormEvent($event: boolean) {
    this.showAddCompanyForm = $event;
  }

  refreshCompanies() {
    this._refreshCompaniesTrigger$.next();
  }

  refreshApplications() {
    this._refreshApplicationsTrigger$.next();
  }
}
