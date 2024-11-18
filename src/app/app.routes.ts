import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth-component/auth.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
  },
];
