import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Hinge } from '../../interfaces/models/hinge.interface';
import { Pagination } from '../../interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class HingesService {
  private readonly baseUrl: string = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() { }
  get(paginateParameters: any) {
    const params = new HttpParams()
      .set('order', paginateParameters.order)
      .set('pageNumber', paginateParameters.page)
      .set('pageSize', paginateParameters.page_size)
      .set('term', paginateParameters.params?.term)
      .set('brand_id', paginateParameters.params?.brand_id)
      .set('hingeTypeId', paginateParameters.params?.hingeTypeId);
      
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  
    return this.http.get<Pagination>(`${environment.apiUrl}/hinges`, { headers, params });
  }
  
  store(hinge: any) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/hinges`, hinge, { headers });
  
  }

  
  update(id: number, hinge: any) {
    console.log(id, hinge);
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/hinges/${id}`, hinge, { headers });
  }
  
  delete(id: number) {    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/hinges/${id}`, { headers });
  }
  
  getBrands() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/hinges/get-brands-hinge`, { headers });

  }

  deleteComponent(hingeId: number, componentId: number) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${this.baseUrl}/hinges/${hingeId}/components/${componentId}`, { headers });
  }

}
