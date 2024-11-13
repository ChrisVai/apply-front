import {ApplicationModel} from "./applicationModel";
import {RecruiterModel} from "./recruiterModel";

export interface CompanyModel {
  id: number;
  name: string;
  websiteUrl?: string;
  postalAddress?: string;
  emailContactAddress?: string;
  applications: ApplicationModel[];
  recruiters: RecruiterModel[];
}
