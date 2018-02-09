import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPromotionComponent } from './users-promotion.component';

describe('UsersPromotionComponent', () => {
  let component: UsersPromotionComponent;
  let fixture: ComponentFixture<UsersPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
