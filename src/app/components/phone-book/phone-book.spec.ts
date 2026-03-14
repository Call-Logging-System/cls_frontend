import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneBook } from './phone-book';

describe('PhoneBook', () => {
  let component: PhoneBook;
  let fixture: ComponentFixture<PhoneBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
