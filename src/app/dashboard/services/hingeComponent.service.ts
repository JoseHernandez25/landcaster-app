import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { HingeComponent } from '../../interfaces/models/hingeComponent.interface';

@Injectable({
  providedIn: 'root'
})
export class HingeComponentService {
  private readonly baseUrl: string = environment.apiUrl;

  //injection dependices
  private http = inject(HttpClient);
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

    return this.http.get<Pagination>(`${environment.apiUrl}/hinge-components`, { headers, params });
  }

  store(hingeComponent: any) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/hinge-components`, hingeComponent, { headers });

  }

  update(id: number, hingeComponent: HingeComponent) {
    console.log(id,hingeComponent);
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/hinge-components/${id}`, hingeComponent, { headers });
  }

  
  delete(id: number) {    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/hinge-components/${id}`, { headers });
  }

  getBrands() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/hinge-components/get-hinge-component-brands`, { headers });

  }
  
  
  getComponentsByBrand(brandId: number) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/hinge-components/get-components-by-brand/${brandId}`, { headers });
  }
  
}
