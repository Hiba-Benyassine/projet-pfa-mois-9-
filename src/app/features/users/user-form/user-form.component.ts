import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemandeService, User } from '../../../services/demande.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isAdmin = false;
  editingUserEmail: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private demandeService: DemandeService) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['employee', Validators.required]
    });
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isAdmin = !!user.isAdmin;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Load user data by email or index (assuming id is email here)
        const user = this.demandeService.getUserByEmail(id);
        if (user) {
          this.editingUserEmail = user.email;
          this.userForm.patchValue({
            fullName: user.fullName,
            email: user.email,
            password: '', // Leave password empty for editing
            role: user.isAdmin ? 'admin' : 'employee'
          });
          // Make password optional for editing
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
        } else {
          alert('Utilisateur non trouvé.');
          this.router.navigate(['/users']);
        }
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    const { fullName, email, password, role } = this.userForm.value;
    let user: User = { fullName, email, password, isAdmin: role === 'admin' };
    if (this.editingUserEmail) {
      // For editing, if password is empty, keep the old password
      if (!password) {
        const oldUser = this.demandeService.getUserByEmail(this.editingUserEmail);
        if (oldUser) {
          user.password = oldUser.password;
        }
      }
      // Update existing user
      const updated = this.demandeService.updateUser(this.editingUserEmail, user);
      if (!updated) {
        alert('Erreur lors de la mise à jour de l\'utilisateur.');
        return;
      }
      alert('Utilisateur modifié avec succès.');
    } else {
      // Add new user
      const added = this.demandeService.addUser(user);
      if (!added) {
        alert('Cet email est déjà utilisé.');
        return;
      }
      alert('Utilisateur ajouté avec succès.');
    }
    this.router.navigate(['/users']);
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}
