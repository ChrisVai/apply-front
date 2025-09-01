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
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationService } from '../../shared/services/application/application.service';
import { ApplicationModel } from '../../shared/models/applicationModel';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { FormsModule } from '@angular/forms';
import { SectorModel } from '../../shared/models/sectorModel';
import { SectorService } from '../../shared/services/sector/sector.service';

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
  /**
   * Dependencies
   * @private
   */
  private readonly _companyService: CompanyService = inject(CompanyService);
  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _sectorService: SectorService = inject(SectorService);
  /**
   * Triggers for refreshing data
   * @private
   */
  private _refreshCompaniesTrigger$: BehaviorSubject<void> =
    new BehaviorSubject<void>(undefined);
  private _refreshSectorsTrigger$: BehaviorSubject<void> =
    new BehaviorSubject<void>(undefined);
  /**
   * Data as Observables
   */
  allCompanies$: Observable<CompanyModel[]> =
    this._refreshCompaniesTrigger$.pipe(
      switchMap(() => this._companyService.getAllCompanies())
    );
  allSectors$: Observable<SectorModel[]> = this._refreshSectorsTrigger$.pipe(
    switchMap(() => this._sectorService.getAllSectors())
  );
  /**
   * Data as Signals
   */
  allCompaniesSignal: Signal<CompanyModel[]> = toSignal(this.allCompanies$, {
    initialValue: [],
  });
  allSectorsSignal: Signal<SectorModel[]> = toSignal(this.allSectors$, {
    initialValue: [],
  });
  myApplicationsSignal: Signal<ApplicationModel[]> =
    this._applicationService.currentUserApplicationsSignal;
  /**
   * Filtered Applications signals
   * @private
   */
  private statusFilteredApplicationSignal: Signal<ApplicationModel[]> =
    computed(() =>
      this.myApplicationsSignal().filter(application =>
        application.status
          .toLowerCase()
          .includes(this.filterValue().toLowerCase())
      )
    );
  private categoryAndStatusFilteredApplicationSignal: Signal<
    ApplicationModel[]
  > = computed(() =>
    this.statusFilteredApplicationSignal().filter(application => {
      if (
        !this.categoryFilterValue().includes('none') &&
        !this.categoryFilterValue().includes('all')
      )
        if (application.sector) {
          return application.sector.name
            ?.toLowerCase()
            .includes(this.categoryFilterValue().toLowerCase());
        }
      if (this.categoryFilterValue().includes('none')) {
        return !application.sector;
      }
      if (this.categoryFilterValue().includes('all')) {
        return application;
      }
      return null;
    })
  );
  filteredApplicationsSignal: Signal<ApplicationModel[]> = computed(() =>
    this.categoryAndStatusFilteredApplicationSignal().filter(application => {
      if (application.title) {
        return (
          application.title
            .toLowerCase()
            .includes(this.searchInputValue().toLowerCase()) ||
          application.company?.name
            .toLowerCase()
            .includes(this.searchInputValue().toLowerCase())
        );
      }
      return application;
    })
  );
  /**
   * ToolBar's Filters values
   */
  searchInputValue: WritableSignal<string> = signal('');
  filterValue: WritableSignal<string> = signal('');
  categoryFilterValue: WritableSignal<string> = signal('');
  /**
   * Boolean for display purpose
   */
  showAddCompanyForm: boolean = false;
  /**
   * Functions
   * @param $event
   */
  showAddCompanyFormEvent($event: boolean) {
    this.showAddCompanyForm = $event;
  }

  refreshCompanies() {
    this._refreshCompaniesTrigger$.next();
  }

  refreshSectors() {
    this._refreshSectorsTrigger$.next();
  }

  updateResearchValue(event: string) {
    this.searchInputValue.set(event);
  }

  updateFilterBtnValue(event: string) {
    this.filterValue.set(event);
  }

  updateCategoryFilterValue(event: string) {
    this.categoryFilterValue.set(event);
  }
}
