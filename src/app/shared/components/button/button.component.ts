import { Component, Input } from '@angular/core';
import { btnColorPalette } from '../../enum/btnColorPalette';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input({ required: true }) btnLabel: string = '';
  @Input({ required: true }) ariaLabel: string = '';
  @Input() outlined: boolean = false;
  @Input() color: btnColorPalette = btnColorPalette.darkGrey;
}
