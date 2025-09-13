import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DemandeService, User } from '../../../services/demande.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private demandeService: DemandeService) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      birthDate: ['', Validators.required],
      role: ['employee', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    console.log('Form submit', this.registerForm.value);
    if (this.registerForm.invalid) {
      alert('Veuillez remplir tous les champs obligatoires et vérifier les mots de passe.');
      return;
    }
  const { fullName, email, password, role } = this.registerForm.value;
  const newUser: User = { fullName, email, password, isAdmin: role === 'admin' };
    const added = this.demandeService.addUser(newUser);
    console.log('addUser result:', added);
    if (!added) {
      alert('Cet email est déjà utilisé.');
      return;
    }
  // Auto-login after registration
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  this.authService.authenticate(true);
  this.router.navigate([role === 'admin' ? '/admin-dashboard' : '/employee-dashboard']);
  }
}
