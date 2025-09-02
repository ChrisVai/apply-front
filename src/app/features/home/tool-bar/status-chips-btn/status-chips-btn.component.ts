import { Component, Input, input, InputSignal, output } from '@angular/core';
import { Status } from '../../../../shared/models/applicationModel';

@Component({
    selector: 'app-status-chips-btn',
    imports: [],
    templateUrl: './status-chips-btn.component.html',
    styleUrl: './status-chips-btn.component.scss'
})
export class StatusChipsBtnComponent {
  @Input({ required: true }) status!: string;
  count: InputSignal<number | undefined> = input<number>();
  btnValueOutput = output<string>();
  protected readonly Status = Status;
  isBtnSelected: boolean = false;

  returnBtnFilterValue(value: string) {
    this.btnValueOutput.emit(value);
  }
}
