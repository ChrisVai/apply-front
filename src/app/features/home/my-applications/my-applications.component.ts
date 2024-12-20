import { Component, inject, OnInit, Signal } from '@angular/core';
import { ApplicationService } from '../../../shared/services/application/application.service';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { ApplicationModel } from '../../../shared/models/applicationModel';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationCardComponent } from './application-card/application-card.component';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [ApplicationCardComponent],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.scss',
})
export class MyApplicationsComponent implements OnInit {
  private readonly _applicationService: ApplicationService =
    inject(ApplicationService);
  private _refreshApplicationsTrigger$: BehaviorSubject<void> =
    new BehaviorSubject<void>(undefined);
  myApplications$: Observable<ApplicationModel[]> =
    this._refreshApplicationsTrigger$.pipe(
      switchMap(() => this._applicationService.getCurrentUserApplications())
    );
  myApplicationsSignal: Signal<ApplicationModel[]> = toSignal(
    this.myApplications$.pipe(tap(data => console.log(data))),
    { initialValue: [] }
  );

  refreshApplications() {
    this._refreshApplicationsTrigger$.next();
  }

  ngOnInit(): void {
    console.log('applications', this.myApplicationsSignal());
  }
}
