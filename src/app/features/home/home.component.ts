import { Component, inject, Signal } from '@angular/core';
import { AuthService } from '../auth/service/authService/auth.service';
import { UserModel } from '../../shared/models/userModel';
import { ApplicationService } from '../../shared/services/applications/application.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly authService: AuthService = inject(AuthService);
  private readonly applicationService: ApplicationService =
    inject(ApplicationService);
  currentUser: Signal<UserModel | null> = this.authService.currentUser;
  application: Signal<any> | undefined =
    this.applicationService.getApplicationsById(2);
}
