import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./user-list/user-list.component').then(m => m.UserListComponent) },
  { path: 'new', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) },
  { path: 'edit/:id', loadComponent: () => import('./user-form/user-form.component').then(m => m.UserFormComponent) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
