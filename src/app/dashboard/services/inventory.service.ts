import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly baseUrl: string = environment.apiUrl;

  //injection dependices
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() { }

  get() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      
    return this.http.get<any[]>(`${environment.apiUrl}/Inventory`, { headers });
  }
}
