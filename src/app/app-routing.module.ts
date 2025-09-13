import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './features/auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { 
    path: 'leave-requests', 
    loadChildren: () => import('./features/leave-requests/leave-requests.module').then(m => m.LeaveRequestsModule)
  },
  { 
    path: 'users', 
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule)
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./features/leave-requests/demande.module').then(m => m.LeaveDRequestsModule),
    canActivate: [RoleGuard],
    data: { role: 'admin' }
  },
  {
    path: 'employee-dashboard',
    loadChildren: () => import('./features/leave-requests/leave-requests.module').then(m => m.LeaveRequestsModule),
    canActivate: [RoleGuard],
    data: { role: 'employee' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
