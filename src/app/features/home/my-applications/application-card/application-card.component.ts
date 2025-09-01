import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ApplicationModel,
  Status,
} from '../../../../shared/models/applicationModel';
import { ApplicationService } from '../../../../shared/services/application/application.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [
    DatePipe,
    EditApplicationComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.scss',
})
export class ApplicationCardComponent {
  application: InputSignal<ApplicationModel> =
    input.required<ApplicationModel>();
  refreshApplicationsOutput: OutputEmitterRef<void> = output<void>();

  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  applicationDeleted: WritableSignal<boolean> = signal<boolean>(false);
  statusClass: Signal<string> = computed(() => {
    switch (this.application().status) {
      case Status.applied:
        return 'text-app-green-400';
      case Status.toApply:
      case Status.toRelaunch:
        return 'text-app-yellow-400';
      case Status.relaunched:
        return 'text-app-green-400';
      case Status.closed:
        return 'text-app-red-400';
      default:
        return 'text-app-blue-400';
    }
  });

  showComments: boolean = false;
  showEditor: boolean = false;

  spreadApplicationModifiedEvent() {
    this.refreshApplicationsOutput.emit();
    this.closeEditor();
  }

  closeEditor() {
    this.showEditor = false;
  }

  deleteApplication(id: number) {
    this._applicationService
      .deleteApplicationById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.applicationDeleted.set(true);
          this.refreshApplicationsOutput.emit();
        },
        error: () => console.error('application non supprimée'),
        complete: () => console.log('application supprimée'),
      });
  }
}
