import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePayloadsComponent } from './device-payloads.component';

describe('DevicePayloadsComponent', () => {
  let component: DevicePayloadsComponent;
  let fixture: ComponentFixture<DevicePayloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicePayloadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePayloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
