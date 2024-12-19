import { Component } from '@angular/core';
import { AddApplicationComponent } from './add-application/add-application.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AddApplicationComponent,
    AddCompanyComponent,
    MyApplicationsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  showAddCompanyForm: boolean = false;

  showAddCompanyFormEvent($event: boolean) {
    this.showAddCompanyForm = $event;
  }
}
