import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeliumComponent } from './helium.component';

describe('HeliumComponent', () => {
  let component: HeliumComponent;
  let fixture: ComponentFixture<HeliumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeliumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeliumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
