import { Component, Input, input, InputSignal, output } from '@angular/core';

@Component({
  selector: 'app-status-chips-btn',
  standalone: true,
  imports: [],
  templateUrl: './status-chips-btn.component.html',
  styleUrl: './status-chips-btn.component.scss',
})
export class StatusChipsBtnComponent {
  @Input({ required: true }) data!: string;
  count: InputSignal<number> = input.required<number>();
  btnValueOutput = output<string>();

  returnBtnFilterValue(value: string) {
    this.btnValueOutput.emit(value);
  }
}
