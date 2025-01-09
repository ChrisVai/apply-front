import { CompanyModel } from './companyModel';
import { SectorModel } from './sectorModel';

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
  title: string;
  sectorId?: number;
  sector?: SectorModel;
  companyId: number;
  company?: CompanyModel;
  offerUrl?: string;
  applied: boolean;
  appliedOn?: Date;
  recruiterResponse?: RecruiterResponse;
  comments: string;
  status: Status;
  userId: number;
}
