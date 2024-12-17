import { Component, inject, Input, Signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { AuthService } from '../../../features/auth/service/authService/auth.service';
import { btnColorPalette } from '../../enum/btnColorPalette';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly _authService: AuthService = inject(AuthService);
  protected readonly btnColorPalette = btnColorPalette;
  isConnected: Signal<boolean> = this._authService.isConnected;

  logout() {
    this._authService.logout();
  }
}
