import { Component, inject, Input, Signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../../features/auth/service/authService/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService: AuthService = inject(AuthService);
  isConnected: Signal<boolean> = this.authService.isConnected;

  logout() {
    console.log('passage dans logout header');
    this.authService.logout();
  }
}
