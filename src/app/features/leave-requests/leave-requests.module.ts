import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LeaveRequestListComponent } from './leave-request-list/leave-request-list.component';
import { LeaveRequestFormComponent } from './leave-request-form/leave-request-form.component';
import { LeaveRequestsRoutingModule } from './leave-requests-routing.module';

@NgModule({
  declarations: [
    LeaveRequestListComponent,
    LeaveRequestFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LeaveRequestsRoutingModule
  ]
})
export class LeaveRequestsModule { }
