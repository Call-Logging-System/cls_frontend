import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhoneBookDialog } from './edit-phone-book-dialog';

describe('EditPhoneBookDialog', () => {
  let component: EditPhoneBookDialog;
  let fixture: ComponentFixture<EditPhoneBookDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPhoneBookDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPhoneBookDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
