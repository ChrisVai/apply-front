import { Component, inject, input, InputSignal, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StatusChipsBtnComponent } from './status-chips-btn/status-chips-btn.component';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Status } from '../../../shared/models/applicationModel';

@Component({
  selector: 'app-tool-bar',
  standalone: true,
  imports: [ReactiveFormsModule, StatusChipsBtnComponent],
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.scss',
})
export class ToolBarComponent {
  countApplicationsToApply: InputSignal<number> = input.required<number>();
  countApplicationsClosed: InputSignal<number> = input.required<number>();
  countApplicationsApplied: InputSignal<number> = input.required<number>();
  countApplicationsToRelaunch: InputSignal<number> = input.required<number>();
  countApplicationsRelaunched: InputSignal<number> = input.required<number>();

  private readonly _fb: FormBuilder = inject(FormBuilder);
  status = Status;

  searchForm = this._fb.nonNullable.group({
    searchInput: [''],
  });
  searchOutput = outputFromObservable(
    this.searchForm.controls.searchInput.statusChanges.pipe(
      map(() => this.searchForm.controls.searchInput.value)
    )
  );
  btnValueOutput = output<string>();

  btnValue(event: string) {
    this.btnValueOutput.emit(event);
  }
}
