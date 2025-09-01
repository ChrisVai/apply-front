import {
  Component,
  DestroyRef,
  inject,
  input,
  Input,
  InputSignal,
  OnChanges,
  OnInit,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  SimpleChanges,
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
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
export class ApplicationCardComponent implements OnInit {
  @Input({ required: true }) application!: ApplicationModel;
  refreshApplicationsOutput: OutputEmitterRef<void> = output<void>();

  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  applicationDeleted: WritableSignal<boolean> = signal<boolean>(false);

  showComments: boolean = false;
  showEditor: boolean = false;
  statusClass: string = '';

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

  ngOnInit(): void {
    switch (this.application.status) {
      case Status.applied:
        this.statusClass = 'text-app-green-400';
        break;
      case Status.toApply:
        this.statusClass = 'text-app-yellow-400';
        break;
      case Status.toRelaunch:
        this.statusClass = 'text-app-yellow-400';
        break;
      case Status.relaunched:
        this.statusClass = 'text-app-green-400';
        break;
      case Status.closed:
        this.statusClass = 'text-app-red-400';
        break;
      default:
        this.statusClass = 'text-app-blue-400';
    }
  }
}
