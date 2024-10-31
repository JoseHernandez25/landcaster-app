import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment.prod';
import { Pagination } from '../../interfaces/pagination.interface';
import { ExternalAccesories } from '../../interfaces/models/externalAccesory.interface';

@Injectable({
  providedIn: 'root'
})
export class externalAccesoryService {
  private readonly baseUrl: string = environment.apiUrl;

  // Injection de dependencias
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() { }

  get(paginateParameters: any) {
    const params = new HttpParams()
      .set('order', paginateParameters.order)
      .set('pageNumber', paginateParameters.page)
      .set('pageSize', paginateParameters.page_size)
      .set('term', paginateParameters.params?.term);
      
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  
    return this.http.get<Pagination>(`${environment.apiUrl}/external-accesory`, { headers, params });

  }
  store(ExternalAccesories: ExternalAccesories) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/external-accesory`, ExternalAccesories, { headers });

  }

  update(id: number, externalAccesory: ExternalAccesories) {
    console.log(id, externalAccesory);
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/external-accesory/${id}`, externalAccesory, { headers });
  }

  delete(id: number) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/external-accesory/${id}`, { headers });
  }

  getBrands() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/external-accesory/get-brands-external-accesory`, { headers });

  }
}
