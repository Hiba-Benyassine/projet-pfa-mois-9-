import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gestion-conge';
  currentUser: any = null;

  constructor() {
    this.loadUser();
    window.addEventListener('storage', () => this.loadUser());
  }

  loadUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    window.location.href = '/auth/login';
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.isAdmin;
  }

  get isEmployee() {
    return this.currentUser && !this.currentUser.isAdmin;
  }

  get isLoggedIn() {
    return !!this.currentUser;
  }
}
