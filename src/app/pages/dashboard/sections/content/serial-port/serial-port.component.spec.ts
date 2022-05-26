import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialPortComponent } from './serial-port.component';

describe('SerialPortComponent', () => {
  let component: SerialPortComponent;
  let fixture: ComponentFixture<SerialPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialPortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
