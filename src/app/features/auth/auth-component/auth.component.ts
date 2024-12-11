import { Component, computed, DestroyRef, inject, Signal } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/authService/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule, NgClass],
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

  isInvalidMail: Signal<boolean | undefined> = toSignal(
    this.authForm.controls.email.statusChanges.pipe(
      map(
        () =>
          this.authForm.controls.email.invalid &&
          (this.authForm.controls.email.dirty ||
            this.authForm.controls.email.touched)
      )
    )
  );
  isInvalidPassword: Signal<boolean | undefined> = toSignal(
    this.authForm.controls.password.statusChanges.pipe(
      map(
        () =>
          this.authForm.controls.password.invalid &&
          (this.authForm.controls.password.dirty ||
            this.authForm.controls.password.touched)
      )
    )
  );
  isInvalidForm: Signal<boolean> = computed(
    () =>
      this.isInvalidPassword() ||
      this.isInvalidPassword() === undefined ||
      this.isInvalidMail() ||
      this.isInvalidMail() === undefined
  );

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
