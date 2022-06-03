import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeliumControlComponent } from './helium-control.component';

describe('HeliumControlComponent', () => {
  let component: HeliumControlComponent;
  let fixture: ComponentFixture<HeliumControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeliumControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeliumControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
