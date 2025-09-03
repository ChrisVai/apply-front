import { Component, inject, WritableSignal } from '@angular/core';
import { AlertModel, AlertType } from '../../models/AlertModel';
import { NgClass } from '@angular/common';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-alert-pop-up',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert-pop-up.component.html',
  styleUrl: './alert-pop-up.component.scss',
})
export class AlertPopUpComponent {
  /**
   * Dependencies
   * @private
   */
  private readonly _alertService: AlertService = inject(AlertService);
  /**
   * Properties
   */
  alert: WritableSignal<AlertModel> = this._alertService.alert;
  protected readonly AlertType = AlertType;
}
