import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthStatus, CheckTokenResponse, LoginResponse } from '../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { User } from '../../interfaces/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl: string = environment.apiUrl;
  private _user = signal<User | null>(null);
  public user = computed(() => this._user());
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  public authStatus = computed(() => this._authStatus());
  private _token = signal<string | null>(null);
  public token = computed(() => this._token());

  //injection dependices
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() { this.checkAuthStatus().subscribe(); }

  private setAuthentication(user: User, token?: string): boolean {    
    console.log(user);
    
    this._user.set(user);
    if (token) {
      this._token.set(token);
      localStorage.setItem('token', token);
    } else {
      const token = localStorage.getItem('token');
      this._token.set(token);
    }
    this._authStatus.set(AuthStatus.authenticated);
    return true; 
   }

   login(email: string | null, password: string | null): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }


  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/user`;
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user }) => this.setAuthentication(user)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }
  
  logout() {
    localStorage.removeItem('token');
    this._user.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
    this.router.navigate(['/auth/login']);
  }
}
