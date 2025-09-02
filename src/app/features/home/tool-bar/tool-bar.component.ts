import {
  Component,
  inject,
  output,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StatusChipsBtnComponent } from './status-chips-btn/status-chips-btn.component';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { Status } from '../../../shared/models/applicationModel';
import { SectorModel } from '../../../shared/models/sectorModel';
import { ApplicationService } from '../../../shared/services/application/application.service';
import { SectorService } from '../../../shared/services/sector/sector.service';

@Component({
    selector: 'app-tool-bar',
    imports: [ReactiveFormsModule, StatusChipsBtnComponent],
    templateUrl: './tool-bar.component.html',
    styleUrl: './tool-bar.component.scss'
})
export class ToolBarComponent {
  /**
   * Output
   */
  btnValueOutput = output<string>();
  /**
   * Dependencies
   * @private
   */
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _applicationService = inject(ApplicationService);
  private readonly _sectorService = inject(SectorService);
  /**
   * Public properties
   */
  allSectors: Signal<SectorModel[]> = this._sectorService.allSectorsSignal;
  /**
   * Applications count by Status
   */
  applicationsTotalCount: WritableSignal<number> =
    this._applicationService.applicationsTotalCount;
  countApplicationsToApply: WritableSignal<number> =
    this._applicationService.countApplicationsToApply;
  countApplicationsClosed: WritableSignal<number> =
    this._applicationService.countApplicationsClosed;
  countApplicationsApplied: WritableSignal<number> =
    this._applicationService.countApplicationsApplied;
  countApplicationsToRelaunch: WritableSignal<number> =
    this._applicationService.countApplicationsToRelaunch;
  countApplicationsRelaunched: WritableSignal<number> =
    this._applicationService.countApplicationsRelaunched;
  status = Status;
  /**
   * Form Init
   */
  searchForm = this._fb.nonNullable.group({
    searchInput: [''],
    category: ['all'],
  });
  /**
   * Form Output from Observable
   */
  searchOutput = outputFromObservable(
    this.searchForm.controls.searchInput.statusChanges.pipe(
      map(() => this.searchForm.controls.searchInput.value)
    )
  );
  categoryFilterOutput = outputFromObservable(
    this.searchForm.controls.category.statusChanges.pipe(
      startWith(this.searchForm.controls.category.value),
      map(() => this.searchForm.controls.category.value)
    )
  );

  btnValue(event: string) {
    this.btnValueOutput.emit(event);
  }
}
