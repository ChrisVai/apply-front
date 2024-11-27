import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth-component/auth.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
];
