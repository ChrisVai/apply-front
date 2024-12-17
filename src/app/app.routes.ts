import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth-component/auth.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './guards/auth.guard';
import { CreateAccountComponent } from './features/create-account/create-account.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthComponent,
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
    pathMatch: 'full',
  },
];
