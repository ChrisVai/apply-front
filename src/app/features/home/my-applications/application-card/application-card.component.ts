import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  InputSignal,
  Signal,
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
import { AlertService } from '../../../../shared/services/alert/alert.service';

@Component({
  selector: 'app-application-card',
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
  /**
   * Input
   */
  application: InputSignal<ApplicationModel> =
    input.required<ApplicationModel>();
  /**
   * Dependencies
   * @private
   */
  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _alertService: AlertService = inject(AlertService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  /**
   * Status Class for Tailwind: matching Status with chip's color
   */
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
  /**
   * Booleans for display
   */
  showComments: boolean = false;
  showEditor: boolean = false;
  /**
   * Functions
   */
  closeEditor() {
    this.showEditor = false;
  }

  deleteApplication(id: number) {
    this._applicationService
      .deleteApplicationById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        error: () => {
          this._alertService.TriggerErrorAlert('Erreur lors de la suppression');
        },
        complete: () => {
          this._applicationService.refreshApplications();
          this.closeEditor();
          this._alertService.TriggerSuccessAlert('Candidature supprimée');
        },
      });
  }
}
