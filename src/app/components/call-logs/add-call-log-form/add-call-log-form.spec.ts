import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCallLogForm } from './add-call-log-form';

describe('AddCallLogForm', () => {
  let component: AddCallLogForm;
  let fixture: ComponentFixture<AddCallLogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCallLogForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCallLogForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
