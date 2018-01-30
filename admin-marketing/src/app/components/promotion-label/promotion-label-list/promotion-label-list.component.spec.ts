import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionLabelListComponent } from './promotion-label-list.component';

describe('PromotionLabelListComponent', () => {
  let component: PromotionLabelListComponent;
  let fixture: ComponentFixture<PromotionLabelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionLabelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionLabelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
