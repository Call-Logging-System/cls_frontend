import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCallLogForm } from './edit-call-log-form';

describe('EditCallLogForm', () => {
  let component: EditCallLogForm;
  let fixture: ComponentFixture<EditCallLogForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCallLogForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCallLogForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
