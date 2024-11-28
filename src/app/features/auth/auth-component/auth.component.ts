import { Component, DestroyRef, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/authService/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _router: Router = inject(Router);
  errorMessage: string | undefined;

  authForm = this._fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  login() {
    const val = this.authForm.value;
    if (val.email && val.password) {
      this._authService
        .login(val.email, val.password)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => this._router.navigateByUrl('/home'),
          error: () =>
            (this.errorMessage = 'Identifiants invalides, veuillez réessayer'),
        });
    }
  }
}
