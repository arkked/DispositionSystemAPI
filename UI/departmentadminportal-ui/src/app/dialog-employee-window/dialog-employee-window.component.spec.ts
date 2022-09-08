import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmployeeWindowComponent } from './dialog-employee-window.component';

describe('DialogEmployeeWindowComponent', () => {
  let component: DialogEmployeeWindowComponent;
  let fixture: ComponentFixture<DialogEmployeeWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEmployeeWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEmployeeWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
