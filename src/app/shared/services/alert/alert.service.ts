import { Injectable, signal, WritableSignal } from '@angular/core';
import { AlertModel, AlertType } from '../../models/AlertModel';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  /**
   * Properties
   */
  alert: WritableSignal<AlertModel> = signal<AlertModel>({} as AlertModel);
  showAlert: WritableSignal<boolean> = signal<boolean>(false);

  /**
   * Functions
   * @private
   */
  private showAlertPopUp() {
    this.showAlert.set(true);
    setTimeout(() => this.showAlert.set(false), 1500);
  }

  TriggerErrorAlert(title: string, content?: string) {
    this.alert.set({
      title: title,
      content: content,
      type: AlertType.error,
    });
    this.showAlertPopUp();
  }

  TriggerSuccessAlert(title: string, content?: string) {
    this.alert.set({
      title: title,
      content: content,
      type: AlertType.success,
    });
    this.showAlertPopUp();
  }
}
