import { ApplicationModel } from './applicationModel';

export interface SectorModel {
  id: number;
  name: string;
  applications?: ApplicationModel[];
}
