import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotAdvsAddComponent } from './hot-advs-add.component';

describe('HotAdvsAddComponent', () => {
  let component: HotAdvsAddComponent;
  let fixture: ComponentFixture<HotAdvsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotAdvsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotAdvsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
