import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusChipsBtnComponent } from './status-chips-btn.component';

describe('StatusChipsComponent', () => {
  let component: StatusChipsBtnComponent;
  let fixture: ComponentFixture<StatusChipsBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusChipsBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusChipsBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
