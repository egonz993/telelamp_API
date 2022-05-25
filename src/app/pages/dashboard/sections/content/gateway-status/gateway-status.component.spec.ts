import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayStatusComponent } from './gateway-status.component';

describe('GatewayStatusComponent', () => {
  let component: GatewayStatusComponent;
  let fixture: ComponentFixture<GatewayStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatewayStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
