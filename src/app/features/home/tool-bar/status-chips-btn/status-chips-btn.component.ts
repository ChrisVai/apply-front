import { Component, Input, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-status-chips-btn',
  standalone: true,
  imports: [],
  templateUrl: './status-chips-btn.component.html',
  styleUrl: './status-chips-btn.component.scss',
})
export class StatusChipsBtnComponent {
  @Input({ required: true }) name!: string;
  count: InputSignal<number> = input.required<number>();
}
