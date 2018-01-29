import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionLabelAddComponent } from './promotion-label-add.component';

describe('PromotionLabelAddComponent', () => {
  let component: PromotionLabelAddComponent;
  let fixture: ComponentFixture<PromotionLabelAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionLabelAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionLabelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
