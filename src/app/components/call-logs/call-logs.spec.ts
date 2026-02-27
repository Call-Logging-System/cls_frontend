import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogs } from './call-logs';

describe('CallLogs', () => {
  let component: CallLogs;
  let fixture: ComponentFixture<CallLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
