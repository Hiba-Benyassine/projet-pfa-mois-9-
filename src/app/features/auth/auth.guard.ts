import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    // 🔒 Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('currentUser');
    
    if (user) {
      return true;
    }
    
    // 🚫 Rediriger vers la connexion si pas authentifié
    this.router.navigate(['/auth/login']);
    return false;
  }
}
