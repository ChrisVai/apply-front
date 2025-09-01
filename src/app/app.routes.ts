import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth-component/auth.component').then(
        c => c.AuthComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then(c => c.HomeComponent),
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'create-account',
    loadComponent: () =>
      import('./features/create-account/create-account.component').then(
        c => c.CreateAccountComponent
      ),
    pathMatch: 'full',
  },
];
