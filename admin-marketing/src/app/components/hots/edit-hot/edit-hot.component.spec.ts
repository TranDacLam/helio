import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHotComponent } from './edit-hot.component';

describe('EditHotComponent', () => {
  let component: EditHotComponent;
  let fixture: ComponentFixture<EditHotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
