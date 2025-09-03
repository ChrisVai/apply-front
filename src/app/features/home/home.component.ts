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
import { ApplicationService } from '../../shared/services/application/application.service';
import { ApplicationModel } from '../../shared/models/applicationModel';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { FormsModule } from '@angular/forms';
import { AlertPopUpComponent } from '../../shared/components/alert-pop-up/alert-pop-up.component';
import { AlertModel } from '../../shared/models/AlertModel';
import { AlertService } from '../../shared/services/alert/alert.service';

@Component({
  selector: 'app-home',
  imports: [
    AddApplicationComponent,
    AddCompanyComponent,
    MyApplicationsComponent,
    ToolBarComponent,
    FormsModule,
    AlertPopUpComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  /**
   * Dependencies
   * @private
   */
  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _alertService: AlertService = inject(AlertService);
  /**
   * Data as Signals
   */
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
  showAlertTrigger: WritableSignal<boolean> = this._alertService.showAlert;
  /**
   * Functions
   * @param $event
   */
  showAddCompanyFormEvent($event: boolean) {
    this.showAddCompanyForm = $event;
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
