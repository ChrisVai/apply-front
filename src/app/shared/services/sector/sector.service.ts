import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { SectorModel } from '../../models/sectorModel';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SectorService {
  /**
   * Dependencies
   * @private
   */
  private readonly _http: HttpClient = inject(HttpClient);
  /**
   * Env
   * @private
   */
  private readonly _apiUrlSectors: string = environment.apiUrl + '/sectors';
  /**
   * Triggers
   */
  private _refreshSectorsTrigger$: BehaviorSubject<void> =
    new BehaviorSubject<void>(undefined);

  /**
   * Public properties
   */
  allSectors$: Observable<SectorModel[]> = this._refreshSectorsTrigger$.pipe(
    switchMap(() => this.getAllSectors())
  );
  allSectorsSignal: Signal<SectorModel[]> = toSignal(this.allSectors$, {
    initialValue: [],
  });
  /**
   * Functions
   */
  refreshSectors() {
    this._refreshSectorsTrigger$.next();
  }

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
