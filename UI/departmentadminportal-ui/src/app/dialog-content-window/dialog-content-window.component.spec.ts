import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentWindowComponent } from './dialog-content-window.component';

describe('DialogContentWindowComponent', () => {
  let component: DialogContentWindowComponent;
  let fixture: ComponentFixture<DialogContentWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogContentWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
