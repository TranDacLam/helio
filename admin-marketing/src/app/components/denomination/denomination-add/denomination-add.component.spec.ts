import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DenominationAddComponent } from './denomination-add.component';

describe('DenominationAddComponent', () => {
  let component: DenominationAddComponent;
  let fixture: ComponentFixture<DenominationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenominationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DenominationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
