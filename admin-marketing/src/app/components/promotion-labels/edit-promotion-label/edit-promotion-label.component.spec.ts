import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPromotionLabelComponent } from './edit-promotion-label.component';

describe('EditPromotionLabelComponent', () => {
  let component: EditPromotionLabelComponent;
  let fixture: ComponentFixture<EditPromotionLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPromotionLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPromotionLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
