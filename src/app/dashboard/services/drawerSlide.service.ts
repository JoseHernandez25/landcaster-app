import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { DrawerSlide } from '../../interfaces/models/drawerSlide.interface';

@Injectable({
  providedIn: 'root'
})
export class DrawerSlideService {
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
      .set('drawerSlideTypeId', paginateParameters.params?.drawerSlideTypeId);
      
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  
    return this.http.get<Pagination>(`${environment.apiUrl}/drawer-slide`, { headers, params });
  }
  store(drawerSlide: any) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/drawer-slide`, drawerSlide, { headers });
  
  }
  
  update(id: number, drawerSlide: DrawerSlide) {
    console.log(id, drawerSlide);
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/drawer-slide/${id}`, drawerSlide, { headers });
  }
  
  delete(id: number) {    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/drawer-slide/${id}`, { headers });
  }
  
  getBrands() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/drawer-slide/get-brands-drawer-slide`, { headers });

  }
}
