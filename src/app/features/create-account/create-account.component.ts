import {
  Component,
  computed,
  DestroyRef,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { UserService } from '../../shared/services/user/user.service';
import { UserModel } from '../../shared/models/userModel';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { btnColorPalette } from '../../shared/enum/btnColorPalette';
import { map } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    RouterLink,
    NgClass,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _userService: UserService = inject(UserService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  protected readonly btnColorPalette = btnColorPalette;
  createForm = this._fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    repeatPassword: ['', [Validators.required]],
  });
  isNotSamePassword: boolean = false;
  isCreated: WritableSignal<boolean> = signal<boolean>(false);
  isInvalidMail: Signal<boolean | undefined> = toSignal(
    this.createForm.controls.email.statusChanges.pipe(
      map(
        () =>
          this.createForm.controls.email.invalid &&
          (this.createForm.controls.email.dirty ||
            this.createForm.controls.email.touched)
      )
    )
  );
  isInvalidPassword: Signal<boolean | undefined> = toSignal(
    this.createForm.controls.password.statusChanges.pipe(
      map(
        () =>
          this.createForm.controls.password.invalid &&
          (this.createForm.controls.password.dirty ||
            this.createForm.controls.password.touched)
      )
    )
  );
  isInvalidRepeatPassword: Signal<boolean | undefined> = toSignal(
    this.createForm.controls.repeatPassword.statusChanges.pipe(
      map(
        () =>
          this.createForm.controls.repeatPassword.invalid &&
          (this.createForm.controls.repeatPassword.dirty ||
            this.createForm.controls.repeatPassword.touched)
      )
    )
  );
  isInvalidForm: Signal<boolean> = computed(
    () =>
      this.isInvalidPassword() ||
      this.isInvalidPassword() === undefined ||
      this.isInvalidMail() ||
      this.isInvalidMail() === undefined ||
      this.isInvalidRepeatPassword() ||
      this.isInvalidRepeatPassword() === undefined
  );

  send() {
    const val = this.createForm.value;
    const user: UserModel = {
      firstName: val.firstName,
      lastName: val.lastName,
      email: val.email!,
      password: val.password,
    };
    if (val.password === val.repeatPassword) {
      this._userService
        .createUser(user)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => this.isCreated.set(true),
          error: err => console.log('Il y a eu un problème', err),
        });
    } else {
      this.isNotSamePassword = true;
    }
  }
}
