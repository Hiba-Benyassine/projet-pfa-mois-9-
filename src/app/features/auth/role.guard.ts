import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: any): boolean | UrlTree {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const expectedRole = route.data && route.data['role'];
    if (!user) {
      return this.router.parseUrl('/auth/login');
    }
    if (expectedRole === 'admin' && user.isAdmin) {
      return true;
    }
    if (expectedRole === 'employee' && !user.isAdmin) {
      return true;
    }
    // Not authorized
    return this.router.parseUrl('/auth/login');
  }
}
