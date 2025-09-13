import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  fullName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface Demande {
  id: number;
  userId: string; // user email or unique id
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class DemandeService {

  validateDemande(demande: Demande, currentUserEmail: string, isAdmin: boolean) {
    demande.status = 'approved';
    this.updateDemande(demande, currentUserEmail, isAdmin);
  }

  private readonly STORAGE_KEY = 'demandes';
  private readonly USER_KEY = 'users';
  private demandes: Demande[] = [];
  private demandes$ = new BehaviorSubject<Demande[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add a new user to localStorage
   */
  addUser(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY) || '[]');
    if (users.find(u => u.email === user.email)) {
      return false; // Email already exists
    }
    users.push(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(users));
    return true;
  }

  /**
   * Update an existing user in localStorage
   */
  updateUser(oldEmail: string, updatedUser: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY) || '[]');
    const index = users.findIndex(u => u.email === oldEmail);
    if (index === -1) {
      return false; // User not found
    }
    // Check if new email is already taken by another user
    if (updatedUser.email !== oldEmail && users.find(u => u.email === updatedUser.email)) {
      return false; // New email already exists
    }
    users[index] = updatedUser;
    localStorage.setItem(this.USER_KEY, JSON.stringify(users));
    return true;
  }

  /**
   * Get a user by email
   */
  getUserByEmail(email: string): User | undefined {
    const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY) || '[]');
    return users.find(u => u.email === email);
  }

  /**
   * Validate user credentials
   */
  validateUser(email: string, password: string): User | undefined {
    const users: User[] = JSON.parse(localStorage.getItem(this.USER_KEY) || '[]');
    return users.find(u => u.email === email && u.password === password);
  }

  /**
   * Loads demandes from localStorage and updates the BehaviorSubject
   */
  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.demandes = data ? JSON.parse(data) : [];
    this.demandes$.next([...this.demandes]);
  }

  /**
   * Persists demandes to localStorage
   */
  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.demandes));
    this.demandes$.next([...this.demandes]);
  }

  /**
   * Returns an observable of demandes for the current user or all (admin)
   * @param userId string (user email or id)
   * @param isAdmin boolean
   */
  getDemandes(userId: string, isAdmin: boolean): Observable<Demande[]> {
    return new Observable<Demande[]>(observer => {
      const sub = this.demandes$.subscribe(list => {
        if (isAdmin) {
          observer.next([...list]);
        } else {
          observer.next(list.filter(d => d.userId === userId));
        }
      });
      return () => sub.unsubscribe();
    });
  }

  /**
   * Create a new demande (user or admin)
   * @param demande Partial<Demande> (no id, createdAt)
   * @param userId string (user email or id)
   * @param isAdmin boolean
   */
  createDemande(demande: Omit<Demande, 'id' | 'createdAt'>, userId: string, isAdmin: boolean): Demande[] {
    const newDemande: Demande = {
      ...demande,
      id: this.generateId(),
      userId: isAdmin ? (demande.userId || userId) : userId,
      createdAt: new Date().toISOString(),
    };
    this.demandes.push(newDemande);
    this.saveToStorage();
    return this.getListForUser(userId, isAdmin);
  }

  /**
   * Update a demande (user can only update their own, admin can update any)
   */
  updateDemande(updated: Demande, userId: string, isAdmin: boolean): Demande[] {
    const idx = this.demandes.findIndex(d => d.id === updated.id);
    if (idx === -1) return this.getListForUser(userId, isAdmin);
    if (!isAdmin && this.demandes[idx].userId !== userId) return this.getListForUser(userId, isAdmin);
    this.demandes[idx] = { ...this.demandes[idx], ...updated };
    this.saveToStorage();
    return this.getListForUser(userId, isAdmin);
  }

  /**
   * Delete a demande (user can only delete their own, admin can delete any)
   */
  deleteDemande(id: number, userId: string, isAdmin: boolean): Demande[] {
    const idx = this.demandes.findIndex(d => d.id === id);
    if (idx === -1) return this.getListForUser(userId, isAdmin);
    if (!isAdmin && this.demandes[idx].userId !== userId) return this.getListForUser(userId, isAdmin);
    this.demandes.splice(idx, 1);
    this.saveToStorage();
    return this.getListForUser(userId, isAdmin);
  }

  /**
   * Helper to get the list for the current user or admin
   */
  private getListForUser(userId: string, isAdmin: boolean): Demande[] {
    if (isAdmin) return [...this.demandes];
    return this.demandes.filter(d => d.userId === userId);
  }

  /**
   * Generates a unique id for demandes
   */
  private generateId(): number {
    return this.demandes.length ? Math.max(...this.demandes.map(d => d.id)) + 1 : 1;
  }
}
