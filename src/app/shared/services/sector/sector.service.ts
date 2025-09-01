import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { SectorModel } from '../../models/sectorModel';

@Injectable({
  providedIn: 'root',
})
export class SectorService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _apiUrlSectors: string = environment.apiUrl + '/sectors';

  getAllSectors() {
    return this._http.get<SectorModel[]>(this._apiUrlSectors, {
      withCredentials: true,
    });
  }

  addSector(sectorName: string) {
    return this._http.post<SectorModel>(
      this._apiUrlSectors,
      { name: sectorName },
      { withCredentials: true }
    );
  }
}
