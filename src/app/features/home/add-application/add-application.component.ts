import {
  Component,
  DestroyRef,
  inject,
  Input,
  input,
  InputSignal,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SectorModel } from '../../../shared/models/sectorModel';
import { SectorService } from '../../../shared/services/sector/sector.service';

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss',
})
export class AddApplicationComponent {
  allCompanies: InputSignal<CompanyModel[]> = input.required<CompanyModel[]>();
  allSectors: InputSignal<SectorModel[]> = input.required<SectorModel[]>();
  showAddCompanyFormOutput: OutputEmitterRef<boolean> = output<boolean>();
  applicationAddedOutput: OutputEmitterRef<void> = output<void>();
  sectorAddedOutput: OutputEmitterRef<void> = output<void>();

  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _sectorService: SectorService = inject(SectorService);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _fb: FormBuilder = inject(FormBuilder);

  addApplicationForm = this._fb.nonNullable.group({
    title: [''],
    sector: [],
    company: [1, [Validators.required]],
    offerUrl: [
      null,
      Validators.pattern(
        '/^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/'
      ),
    ],
    applied: [false, [Validators.required]],
    appliedOn: [new Date(Date.now()).toISOString()],
    comments: [''],
    status: [Status.toApply, [Validators.required]],
  });

  isAddCompanyFormVisible: boolean = false;
  isAddSectorFieldVisible: boolean = false;

  currentUser: Signal<UserModel | null> = this._authService.currentUser;
  applicationAddedSignal: WritableSignal<boolean> = signal<boolean>(false);

  /*
    Functions
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
            this.applicationAddedSignal.set(true);
            this.isAddSectorFieldVisible = false;
            this.addApplicationForm.reset();
            this.applicationAddedOutput.emit();
          },
          error: err =>
            //todo gèrer les messages d'erreur
            console.error('erreur dans la création de la candidature', err),
        });
    } else {
      //todo gèrer les messages d'erreur
      console.log('impossible, pas de currentUser');
    }
  }

  addSector() {
    this._sectorService
      .addSector(this.addApplicationForm.controls.sector.value)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.isAddSectorFieldVisible = false;
          this.sectorAddedOutput.emit();
        },
        //todo gèrer les messages d'erreur
        error: err =>
          console.error(
            'erreur lors de la création du secteur',
            'value du form:',
            this.addApplicationForm.controls.sector.value,
            err
          ),
      });
  }
}
