import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment.prod';
import { Pagination } from '../../interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  // Injection de dependencias
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() { }

  inedex(paginateParameters: any) {
    const params = new HttpParams()
      .set('order', paginateParameters.order)
      .set('pageNumber', paginateParameters.page)
      .set('pagesSize', paginateParameters.page_size)
      .set('term', paginateParameters.params?.term);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      return this.http.get<any>(`${environment.apiUrl}/brands`, { headers, params });

  }
  
  get(paginateParameters: any) {
    const params = new HttpParams()
      .set('pageNumber', paginateParameters.page)
      .set('pagesSize', paginateParameters.page_size);
      
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');

    return this.http.get<Pagination>(`${environment.apiUrl}/brands`, { headers, params });

  }
}
