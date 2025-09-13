import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DemandeService, User } from '../../../services/demande.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private demandeService: DemandeService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const user = this.demandeService.validateUser(email, password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authService.authenticate(true);
        if (user.isAdmin) {
          this.router.navigateByUrl('/admin-dashboard');
        } else {
          this.router.navigateByUrl('/employee-dashboard');
        }
      } else {
        alert('Échec de la connexion. Vérifiez vos identifiants.');
      }
    }
  }
}