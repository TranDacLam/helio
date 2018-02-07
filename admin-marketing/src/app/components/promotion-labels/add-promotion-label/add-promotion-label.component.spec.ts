import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPromotionLabelComponent } from './add-promotion-label.component';

describe('AddPromotionLabelComponent', () => {
  let component: AddPromotionLabelComponent;
  let fixture: ComponentFixture<AddPromotionLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPromotionLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPromotionLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
