export enum RecruiterResponse {
  no = 'Négative',
  yes = 'Positive',
  none = 'Aucune',
}

export enum Status {
  toApply = 'A postuler',
  applied = 'Postulé',
  toRelaunch = 'A relancer',
  relaunched = 'Relancé',
  closed = 'Close',
}

export interface ApplicationModel {
  id?: number;
  companyId: number;
  offerUrl?: string;
  applied: boolean;
  appliedOn?: Date;
  recruiterResponse?: RecruiterResponse;
  status: Status;
  userId: number;
}
