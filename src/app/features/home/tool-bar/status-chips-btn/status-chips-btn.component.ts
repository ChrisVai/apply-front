import { Component, Input, input, InputSignal, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-chips-btn',
  standalone: true,
  imports: [],
  templateUrl: './status-chips-btn.component.html',
  styleUrl: './status-chips-btn.component.scss',
})
export class StatusChipsBtnComponent implements OnInit {
  @Input() color: string = '';
  @Input({ required: true }) name!: string;
  count: InputSignal<number> = input.required<number>();
  outlineColorClass: string = '';

  ngOnInit(): void {
    this.outlineColorClass = `outline-app-${this.color}`;
  }
}
