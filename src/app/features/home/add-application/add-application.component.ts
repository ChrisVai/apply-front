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

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss',
})
export class AddApplicationComponent {
  allCompanies: InputSignal<CompanyModel[]> = input.required<CompanyModel[]>();
  allCategories: InputSignal<string[]> = input.required<string[]>();
  showAddCompanyFormOutput: OutputEmitterRef<boolean> = output<boolean>();
  applicationAddedOutput: OutputEmitterRef<void> = output<void>();

  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _fb: FormBuilder = inject(FormBuilder);

  addApplicationForm = this._fb.nonNullable.group({
    title: [''],
    category: [''],
    company: [1, [Validators.required]],
    offerUrl: [
      null,
      Validators.pattern(
        '/^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/'
      ),
    ],
    applied: [false, [Validators.required]],
    appliedOn: [''],
    comments: [''],
    status: [Status.toApply, [Validators.required]],
  });

  isAddCompanyFormVisible: boolean = false;
  isAddCategoryFieldVisible: boolean = false;

  currentUser: Signal<UserModel | null> = this._authService.currentUser;
  applicationAddedSignal: WritableSignal<boolean> = signal<boolean>(false);

  //Functions
  showAddCompanyForm() {
    this.isAddCompanyFormVisible = !this.isAddCompanyFormVisible;
    this.showAddCompanyFormOutput.emit(this.isAddCompanyFormVisible);
  }

  addApplication() {
    const val = this.addApplicationForm.getRawValue();
    val.applied ? (val.status = Status.applied) : Status.toApply;
    const application: ApplicationModel = {
      title: val.title,
      category: val.category,
      applied: val.applied,
      appliedOn: undefined,
      companyId: val.company,
      offerUrl: val.offerUrl!,
      recruiterResponse: undefined,
      comments: val.comments,
      status: val.status,
      userId: this.currentUser()?.id!,
    };
    if (this.currentUser()) {
      console.log('passage dans addApplication', application);
      this._applicationService
        .addApplication(application)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this.applicationAddedSignal.set(true);
            this.isAddCategoryFieldVisible = false;
            this.applicationAddedOutput.emit();
          },
          error: err =>
            console.error('erreur dans la création de la candidature', err),
        });
    } else {
      console.log('impossible, pas de currentUser');
    }
  }
}
