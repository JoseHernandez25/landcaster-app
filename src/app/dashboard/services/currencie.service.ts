import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment.prod';
import { Pagination } from '../../interfaces/pagination.interface';
import { CurrencyValue } from '../../interfaces/currencyValue.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrencieService {
  private readonly baseUrl: string = environment.apiUrl;

  // Injection de dependencias
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private exchangerateApiUrl = "https://v6.exchangerate-api.com/v6/376094e17aabf5f110106115/latest/";
  private headerCurrency = 'MXN';
  constructor() { }

  get() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');

    return this.http.get<any>(`${environment.apiUrl}/currencies`, { headers });
  }

  getValueCurriency(currency: string) {
    return this.http.get<CurrencyValue>(`${environment.apiUrl}/pair/${currency}/${this.headerCurrency}`);
  }

}
