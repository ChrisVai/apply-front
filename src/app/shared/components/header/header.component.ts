import { Component, inject, Signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../../features/auth/service/authService/auth.service';
import { RouterLink } from '@angular/router';
import { UserModel } from '../../models/userModel';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, ButtonComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly _authService: AuthService = inject(AuthService);
  isConnected: Signal<boolean> = this._authService.isConnected;
  currentUser: Signal<UserModel | null> = this._authService.currentUser;

  logout() {
    this._authService.logout();
  }
}
