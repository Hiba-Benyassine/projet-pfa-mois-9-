import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './features/dashboard/employee-dashboard.component';

@NgModule({
  declarations: [
    // Add other components here
    AdminDashboardComponent,
    EmployeeDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    // Add other modules here
  ],
  providers: [],
  // Remove bootstrap array for standalone component
})
export class AppModule { }
