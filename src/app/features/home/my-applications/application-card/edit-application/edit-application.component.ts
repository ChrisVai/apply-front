import {
  Component,
  DestroyRef,
  inject,
  Input,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import {
  ApplicationModel,
  Status,
} from '../../../../../shared/models/applicationModel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../../../../shared/services/application/application.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-edit-application',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-application.component.html',
  styleUrl: './edit-application.component.scss',
})
export class EditApplicationComponent {
  @Input({ required: true }) application!: ApplicationModel;
  applicationModifiedOutput: OutputEmitterRef<void> = output<void>();
  closeEditorOutput: OutputEmitterRef<void> = output<void>();

  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  protected readonly Status = Status;

  urlErrorMessage: string = 'Veuillez saisir une url valide au format https://';

  editApplicationForm = this._fb.nonNullable.group({
    title: [''],
    offerUrl: [
      '',
      Validators.pattern(
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/
      ),
    ],
    applied: [false],
    appliedOn: [''],
    comments: [''],
    status: [this.Status.toApply],
  });

  isInvalidUrl: Signal<Boolean | undefined> = toSignal(
    this.editApplicationForm.controls.offerUrl.statusChanges.pipe(
      map(() => this.editApplicationForm.controls.offerUrl.invalid)
    )
  );

  updateApplication(id: number) {
    const val = this.editApplicationForm.getRawValue();

    val.status === Status.applied || val.status === Status.relaunched
      ? (val.applied = true)
      : false;

    if (val.appliedOn === '') {
      if (this.application.appliedOn != null) {
        val.appliedOn = this.application.appliedOn;
      }
    }
    if (val.title === '') {
      val.title = this.application.title;
    }
    if (val.offerUrl === '' && this.application.offerUrl) {
      val.offerUrl = this.application.offerUrl;
    }
    if (val.comments === '' && this.application.comments) {
      val.comments = this.application.comments;
    }

    const modifiedApplication: Partial<ApplicationModel> = {
      title: val.title,
      offerUrl: val.offerUrl,
      applied: val.applied,
      appliedOn: val.appliedOn,
      comments: val.comments,
      status: val.status,
    };
    console.log('passage dans updateApplication', modifiedApplication);
    this._applicationService
      .updateApplicationById(id, modifiedApplication)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.applicationModifiedOutput.emit();
        },
        //todo gérer les erreurs
        error: err =>
          console.error("l'application n'a pas pu se mettre à jour", err),
        complete: () => this.closeEditor(),
      });
  }

  closeEditor() {
    this.closeEditorOutput.emit();
  }
}
