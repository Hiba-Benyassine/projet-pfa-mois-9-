import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LeaveDemandeListComponent } from './demande/leave-request-list.component';
import { LeaveRequestsRoutingModule } from './leave-requests1-routing.module';


import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LeaveDemandeListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,  // 👈 Add this so routerLink works
    LeaveRequestsRoutingModule
  ],
  exports: [
    LeaveDemandeListComponent
  ]
})
export class LeaveDRequestsModule { }
