import {
  Component,
  computed,
  DestroyRef,
  inject,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../../shared/services/application/application.service';
import {
  ApplicationModel,
  Status,
} from '../../../shared/models/applicationModel';
import { CompanyModel } from '../../../shared/models/companyModel';
import { AuthService } from '../../auth/service/authService/auth.service';
import { UserModel } from '../../../shared/models/userModel';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SectorModel } from '../../../shared/models/sectorModel';
import { SectorService } from '../../../shared/services/sector/sector.service';
import { map } from 'rxjs';
import { CompanyService } from '../../../shared/services/company/company.service';
import { AlertService } from '../../../shared/services/alert/alert.service';

@Component({
  selector: 'app-add-application',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss',
})
export class AddApplicationComponent {
  /**
   * Outputs
   */
  showAddCompanyFormOutput: OutputEmitterRef<boolean> = output<boolean>();
  sectorAddedOutput: OutputEmitterRef<void> = output<void>();
  /**
   * Dependencies
   * @private
   */
  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _sectorService: SectorService = inject(SectorService);
  private readonly _companyService: CompanyService = inject(CompanyService);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _alertService: AlertService = inject(AlertService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  /**
   * Form declaration
   */
  addApplicationForm = this._fb.nonNullable.group({
    title: ['', [Validators.required]],
    sector: [1, Validators.required],
    addSector: [''],
    company: [1, [Validators.required]],
    offerUrl: [
      null,
      Validators.pattern(
        '/^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/'
      ),
    ],
    applied: [false, [Validators.required]],
    appliedOn: [new Date(Date.now()).toISOString(), [Validators.required]],
    comments: [''],
    status: [Status.toApply, [Validators.required]],
  });
  /**
   * Booleans for display purpose
   */
  isAddCompanyFormVisible: boolean = false;
  isAddSectorFieldVisible: boolean = false;
  /**
   * Signal properties
   */
  currentUser: Signal<UserModel | null> = this._authService.currentUser;
  allCompanies: Signal<CompanyModel[]> =
    this._companyService.allCompaniesSignal;
  allSectors: Signal<SectorModel[]> = this._sectorService.allSectorsSignal;
  applicationAddedSignal: WritableSignal<boolean> = signal<boolean>(false);
  /**
   * Checking empty and untouched form fields to validate user input
   */
  isInvalidTitle: Signal<boolean | undefined> = toSignal(
    this.addApplicationForm.controls.title.statusChanges.pipe(
      map(
        () =>
          (this.addApplicationForm.controls.title.invalid ||
            this.addApplicationForm.controls.title.pristine) &&
          (this.addApplicationForm.controls.title.dirty ||
            this.addApplicationForm.controls.title.touched)
      )
    )
  );
  isInvalidCompany: Signal<boolean | undefined> = toSignal(
    this.addApplicationForm.controls.company.statusChanges.pipe(
      map(
        () =>
          (this.addApplicationForm.controls.company.invalid ||
            this.addApplicationForm.controls.company.pristine) &&
          (this.addApplicationForm.controls.company.dirty ||
            this.addApplicationForm.controls.company.touched)
      )
    )
  );
  isTitlePristine: Signal<boolean | undefined> = toSignal(
    this.addApplicationForm.controls.title.statusChanges.pipe(
      map(() => this.addApplicationForm.controls.title.pristine)
    )
  );
  isInvalidForm: Signal<boolean> = computed(
    () =>
      this.isTitlePristine() ||
      this.isTitlePristine === undefined ||
      this.isInvalidTitle() ||
      this.isInvalidTitle() === undefined ||
      this.isInvalidCompany() ||
      this.isInvalidCompany() === undefined
  );
  /**
   * Functions
   */
  showAddCompanyForm() {
    this.isAddCompanyFormVisible = !this.isAddCompanyFormVisible;
    this.showAddCompanyFormOutput.emit(this.isAddCompanyFormVisible);
  }

  showAddSectorField() {
    this.isAddSectorFieldVisible = !this.isAddSectorFieldVisible;
    this.addApplicationForm.controls.sector.reset();
  }

  addApplication() {
    const val = this.addApplicationForm.getRawValue();
    val.applied ? (val.status = Status.applied) : Status.toApply;
    const application: ApplicationModel = {
      title: val.title,
      sectorId: val.sector,
      applied: val.applied,
      appliedOn: val.appliedOn,
      companyId: val.company,
      offerUrl: val.offerUrl!,
      recruiterResponse: undefined,
      comments: val.comments,
      status: val.status,
      userId: this.currentUser()?.id!,
    };
    if (this.currentUser()) {
      this._applicationService
        .addApplication(application)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this.isAddSectorFieldVisible = false;
            this.addApplicationForm.reset();
          },
          error: err =>
            this._alertService.TriggerErrorAlert("Erreur lors de l'ajout"),
          complete: () => {
            this.applicationAddedSignal.set(true);
            //Refreshing application list once application is added
            this._applicationService.refreshApplications();
            this._alertService.TriggerSuccessAlert('Candidature ajoutée');
          },
        });
    } else {
      this._alertService.TriggerErrorAlert("Erreur lors de l'ajout");
    }
  }

  addSector() {
    this._sectorService
      .addSector(this.addApplicationForm.controls.addSector.value)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        error: () =>
          this._alertService.TriggerErrorAlert(
            "Erreur lors de l'ajout du secteur"
          ),
        complete: () => {
          this.isAddSectorFieldVisible = false;
          this._sectorService.refreshSectors();
          this._alertService.TriggerSuccessAlert('Secteur ajouté');
        },
      });
  }
}
