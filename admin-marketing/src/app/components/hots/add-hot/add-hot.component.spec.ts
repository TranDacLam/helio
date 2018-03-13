import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHotComponent } from './add-hot.component';

describe('AddHotComponent', () => {
  let component: AddHotComponent;
  let fixture: ComponentFixture<AddHotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
