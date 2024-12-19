import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../../shared/services/applications/application.service';

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-application.component.html',
  styleUrl: './add-application.component.scss',
})
export class AddApplicationComponent {
  showAddCompanyFormOutput: OutputEmitterRef<boolean> = output<boolean>();

  private readonly applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _fb: FormBuilder = inject(FormBuilder);

  addApplicationForm = this._fb.nonNullable.group({
    company: [Validators.required],
    offerUrl: [''],
    applied: [Validators.required],
    appliedOn: [],
    status: [Validators.required],
  });

  isAddCompanyFormVisible: boolean = false;

  showAddCompanyForm() {
    this.isAddCompanyFormVisible = !this.isAddCompanyFormVisible;
    this.showAddCompanyFormOutput.emit(this.isAddCompanyFormVisible);
  }
}
