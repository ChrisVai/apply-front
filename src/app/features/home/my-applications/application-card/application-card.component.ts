import { Component, Input } from '@angular/core';
import { ApplicationModel } from '../../../../shared/models/applicationModel';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.scss',
})
export class ApplicationCardComponent {
  @Input({ required: true }) application!: ApplicationModel;
}
