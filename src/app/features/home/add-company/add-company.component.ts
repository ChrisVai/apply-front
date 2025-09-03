import {
  Component,
  DestroyRef,
  inject,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyModel } from '../../../shared/models/companyModel';
import { CompanyService } from '../../../shared/services/company/company.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '../../../shared/services/alert/alert.service';

@Component({
  selector: 'app-add-company',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss',
})
export class AddCompanyComponent {
  /**
   * Output
   */
  closeAddCompanyFormOutput: OutputEmitterRef<boolean> = output<boolean>();
  /**
   * Dependencies
   * @private
   */
  private readonly _companyService: CompanyService = inject(CompanyService);
  private readonly _alertService: AlertService = inject(AlertService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  /**
   * Signal property
   */
  isCompanyAdded: WritableSignal<boolean> = signal<boolean>(false);
  /**
   * Form init
   */
  addCompanyForm = this._fb.nonNullable.group({
    name: ['', [Validators.required]],
    websiteUrl: [''],
    postalAddress: [''],
    emailContactAddress: [''],
  });

  /**
   * Functions
   */
  closeAddCompanyForm() {
    this.closeAddCompanyFormOutput.emit(false);
  }

  addCompany() {
    const val = this.addCompanyForm.value;
    const company: CompanyModel = {
      name: val.name!,
      websiteUrl: val.websiteUrl,
      postalAddress: val.postalAddress,
      emailContactAddress: val.emailContactAddress,
    };
    this._companyService
      .addCompany(company)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        //todo: gerer les erreurs
        error: () => {
          this._alertService.TriggerErrorAlert(
            "L'entreprise n'a pas pu être ajoutée"
          );
        },
        complete: () => {
          this.isCompanyAdded.set(true);
          this._companyService.refreshCompanies();
          this.closeAddCompanyForm();
          this._alertService.TriggerSuccessAlert('Entreprise ajoutée');
        },
      });
  }
}
