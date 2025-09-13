import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Adjust this URL based on your backend API

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // You can add other user-related methods here
  // getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.apiUrl);
  // }
  
  // getUserById(id: number): Observable<User> {
  //   return this.http.get<User>(`${this.apiUrl}/${id}`);
  // }
  
  // updateUser(id: number, user: User): Observable<User> {
  //   return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  // }
  
  // deleteUser(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}
