import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({ required: true }) btnLabel: string = '';
  @Input({ required: true }) ariaLabel: string = '';
  @Input() disabled!: boolean;
}
