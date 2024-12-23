import { Component, input, Input, InputSignal } from '@angular/core';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { CompanyModel } from '../../../shared/models/companyModel';
import { ApplicationModel } from '../../../shared/models/applicationModel';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [ApplicationCardComponent],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.scss',
})
export class MyApplicationsComponent {
  myApplications: InputSignal<ApplicationModel[]> =
    input.required<ApplicationModel[]>();
}
