import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementAddComponent } from './advertisement-add.component';

describe('AdvertisementAddComponent', () => {
  let component: AdvertisementAddComponent;
  let fixture: ComponentFixture<AdvertisementAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisementAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
