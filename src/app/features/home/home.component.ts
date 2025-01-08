import {
  Component,
  computed,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AddApplicationComponent } from './add-application/add-application.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { CompanyService } from '../../shared/services/company/company.service';
import { CompanyModel } from '../../shared/models/companyModel';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationService } from '../../shared/services/application/application.service';
import { ApplicationModel, Status } from '../../shared/models/applicationModel';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AddApplicationComponent,
    AddCompanyComponent,
    MyApplicationsComponent,
    ToolBarComponent,
    FormsModule,
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
    this.myApplications$.pipe(
      tap(applications => {
        this.applicationsTotalCount.set(applications.length);
        for (let application of applications) {
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
      }),
      map(data => data.reverse())
    ),
    { initialValue: [] }
  );
  /*
    Filtered Applications
  */
  statusFilteredApplicationSignal: Signal<ApplicationModel[]> = computed(() =>
    this.myApplicationsSignal().filter(application =>
      application.status
        .toLowerCase()
        .includes(this.filterValue().toLowerCase())
    )
  );
  filteredApplicationsSignal: Signal<ApplicationModel[]> = computed(() =>
    this.statusFilteredApplicationSignal().filter(application => {
      if (application.title) {
        return (
          application.title
            .toLowerCase()
            .includes(this.searchInput().toLowerCase()) ||
          application.company?.name
            .toLowerCase()
            .includes(this.searchInput().toLowerCase())
        );
      }
      return application;
    })
  );
  /*
    Applications counts by Status
  */
  applicationsTotalCount: WritableSignal<number> = signal<number>(0);
  countApplicationsToApply: WritableSignal<number> = signal<number>(0);
  countApplicationsClosed: WritableSignal<number> = signal<number>(0);
  countApplicationsApplied: WritableSignal<number> = signal<number>(0);
  countApplicationsToRelaunch: WritableSignal<number> = signal<number>(0);
  countApplicationsRelaunched: WritableSignal<number> = signal<number>(0);
  /*
    Toolbar's filters values
   */
  searchInput: WritableSignal<string> = signal('');
  filterValue: WritableSignal<string> = signal('');
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
    this.countApplicationsToApply.set(0);
    this.countApplicationsClosed.set(0);
    this.countApplicationsApplied.set(0);
    this.countApplicationsToRelaunch.set(0);
    this.countApplicationsRelaunched.set(0);
    this._refreshApplicationsTrigger$.next();
  }

  updateResearch($event: string) {
    this.searchInput.set($event);
  }

  filterBtnValue($event: string) {
    this.filterValue.set($event);
  }
}
