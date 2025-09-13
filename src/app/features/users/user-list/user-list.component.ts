import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemandeService, User } from '../../../services/demande.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isAdmin = false;

  constructor(private router: Router, private demandeService: DemandeService) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isAdmin = !!user.isAdmin;
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Since there's no getAllUsers method, we need to get from localStorage directly
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    this.users = users;
  }

  editUser(email: string) {
    this.router.navigate(['/users/edit', email]);
  }

  deleteUser(email: string) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur avec l'email ${email} ?`)) {
      // Remove from localStorage
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter(u => u.email !== email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      this.loadUsers(); // Refresh the list
    }
  }
}
