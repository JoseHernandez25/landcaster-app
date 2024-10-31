import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { DrawerSlideComponent } from '../../interfaces/models/drawerSlideComponents.interface';
import DrawerSlidesComponent from '../pages/drawer-slides/drawer-slides.component';

@Injectable({
  providedIn: 'root'
})
export class DrawerSlideComponentsService {
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
      .set('term', paginateParameters.params?.term);
      
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  
    return this.http.get<Pagination>(`${environment.apiUrl}/drawer-slide-components`, { headers, params });
  }
  
  store(drawerSlideComponents: DrawerSlidesComponent) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/drawer-slide-components`, drawerSlideComponents, { headers });
  
  }
  
  update(id: number, drawerSlideComponents: DrawerSlidesComponent) {
    console.log(id, drawerSlideComponents);
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/drawer-slide-components/${id}`, drawerSlideComponents, { headers });
  }
  
  delete(id: number) {    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/drawer-slide-components/${id}`, { headers });
  }
  
  getBrands() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/drawer-slide-components/get-brands-drawer-slide-components`, { headers });

  }
  getDrawerSlideComponents() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/drawer-slide-components/get-draweslide-components`, { headers });

  }
}
