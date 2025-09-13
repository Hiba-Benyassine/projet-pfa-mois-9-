import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveRequestListComponent } from './leave-request-list/leave-request-list.component';
import { LeaveRequestFormComponent } from './leave-request-form/leave-request-form.component';

const routes: Routes = [
  { path: '', component: LeaveRequestListComponent },
  { path: 'new', component: LeaveRequestFormComponent },
  { path: 'edit/:id', component: LeaveRequestFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRequestsRoutingModule { }
