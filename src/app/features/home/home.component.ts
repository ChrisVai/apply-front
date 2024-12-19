import { Component, inject, Signal } from '@angular/core';
import { AddApplicationComponent } from './add-application/add-application.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { ApplicationService } from '../../shared/services/application/application.service';
import { CompanyService } from '../../shared/services/company/company.service';
import { CompanyModel } from '../../shared/models/companyModel';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _companyService: CompanyService = inject(CompanyService);
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  allCompanies$: Observable<CompanyModel[]> = this.refreshTrigger$.pipe(
    switchMap(() => this._companyService.getAllCompanies())
  );
  allCompaniesSignal: Signal<CompanyModel[]> = toSignal(this.allCompanies$, {
    initialValue: [],
  });

  showAddCompanyForm: boolean = false;

  showAddCompanyFormEvent($event: boolean) {
    this.showAddCompanyForm = $event;
  }

  //used to trigger the refresh of allCompanies$
  refresh() {
    this.refreshTrigger$.next();
  }
}
