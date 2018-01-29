import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionUsersComponent } from './promotion-users.component';

describe('PromotionUsersComponent', () => {
  let component: PromotionUsersComponent;
  let fixture: ComponentFixture<PromotionUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
