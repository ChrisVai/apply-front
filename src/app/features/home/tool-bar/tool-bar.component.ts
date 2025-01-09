import { Component, inject, input, InputSignal, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { StatusChipsBtnComponent } from './status-chips-btn/status-chips-btn.component';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { Status } from '../../../shared/models/applicationModel';

@Component({
  selector: 'app-tool-bar',
  standalone: true,
  imports: [ReactiveFormsModule, StatusChipsBtnComponent],
  templateUrl: './tool-bar.component.html',
  styleUrl: './tool-bar.component.scss',
})
export class ToolBarComponent {
  applicationsTotalCount: InputSignal<number> = input.required<number>();
  countApplicationsToApply: InputSignal<number> = input.required<number>();
  countApplicationsClosed: InputSignal<number> = input.required<number>();
  countApplicationsApplied: InputSignal<number> = input.required<number>();
  countApplicationsToRelaunch: InputSignal<number> = input.required<number>();
  countApplicationsRelaunched: InputSignal<number> = input.required<number>();
  allCategories: InputSignal<string[]> = input.required<string[]>();

  private readonly _fb: FormBuilder = inject(FormBuilder);
  status = Status;

  searchForm = this._fb.nonNullable.group({
    searchInput: [''],
    category: ['all'],
  });
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
  btnValueOutput = output<string>();

  btnValue(event: string) {
    this.btnValueOutput.emit(event);
  }
}
