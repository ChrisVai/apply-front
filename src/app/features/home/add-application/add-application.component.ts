import {
  Component,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
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

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss',
})
export class AddApplicationComponent {
  allCompanies: InputSignal<CompanyModel[]> = input.required<CompanyModel[]>();
  showAddCompanyFormOutput: OutputEmitterRef<boolean> = output<boolean>();

  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _fb: FormBuilder = inject(FormBuilder);

  addApplicationForm = this._fb.nonNullable.group({
    company: [1, [Validators.required]],
    offerUrl: [''],
    applied: [false, [Validators.required]],
    appliedOn: [''],
    status: [Status.toApply, [Validators.required]],
  });
  isAddCompanyFormVisible: boolean = false;

  currentUser: Signal<UserModel | null> = this._authService.currentUser;

  //Functions
  showAddCompanyForm() {
    this.isAddCompanyFormVisible = !this.isAddCompanyFormVisible;
    this.showAddCompanyFormOutput.emit(this.isAddCompanyFormVisible);
  }

  addApplication() {
    const val = this.addApplicationForm.getRawValue();
    val.applied ? (val.status = Status.applied) : Status.toApply;
    const application: ApplicationModel = {
      applied: val.applied,
      appliedOn: undefined,
      companyId: val.company,
      offerUrl: val.offerUrl,
      recruiterResponse: undefined,
      status: Status.toApply,
      userId: this.currentUser()?.id!,
    };
    if (this.currentUser()) {
      console.log('passage dans addApplication', application);
      this._applicationService.addApplication(application).subscribe();
    } else {
      console.log('impossible, pas de currentUser');
    }
  }
}
