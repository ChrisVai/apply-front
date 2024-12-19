import { Component, inject, output, OutputEmitterRef } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss',
})
export class AddCompanyComponent {
  closeAddCompanyFormOutput: OutputEmitterRef<boolean> = output<boolean>();
  private readonly _fb: FormBuilder = inject(FormBuilder);

  addCompanyForm = this._fb.nonNullable.group({
    name: ['', [Validators.required]],
    websiteUrl: [''],
    postalAddress: [''],
    emailContactAddress: [''],
  });

  closeAddCompanyForm() {
    this.closeAddCompanyFormOutput.emit(false);
  }
}
