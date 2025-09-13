import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  authenticate(isAuth: boolean) {
    this.isAuthenticatedSubject.next(isAuth);
  }

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    // Replace with real authentication logic
    if (email === 'test@example.com' && password === 'password') {
      this.isAuthenticatedSubject.next(true);
      this.router.navigate(['/leave-requests']);
      return true;
    }
    return false;
  }

  register(fullName: string, email: string, password: string): void {
    // Replace with real registration logic
    console.log('User registered:', { fullName, email, password });
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
}
