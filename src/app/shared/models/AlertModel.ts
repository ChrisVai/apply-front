export enum AlertType {
  success = 'succès',
  error = 'erreur',
}
export interface AlertModel {
  title: string;
  content?: string;
  type: AlertType;
}
