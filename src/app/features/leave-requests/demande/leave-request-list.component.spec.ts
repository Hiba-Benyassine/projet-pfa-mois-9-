import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveDemandeListComponent } from './leave-request-list.component';

describe('LeaveDemandeListComponent', () => {
  let component: LeaveDemandeListComponent;
  let fixture: ComponentFixture<LeaveDemandeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveDemandeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveDemandeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
