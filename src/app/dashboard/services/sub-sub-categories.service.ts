import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { SubSubCategory } from '../../interfaces/models/subSubCategory.interface';

@Injectable({
  providedIn: 'root'
})
export class SubSubCategoriesService {

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

    return this.http.get<Pagination>(`${environment.apiUrl}/subsubcategories`, { headers, params });
  }

  store(subsubcategory: SubSubCategory) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/subsubcategories`, subsubcategory, { headers });

  }

  update(id: number, subsubcategory: SubSubCategory) {
    console.log(id,subsubcategory);
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/subsubcategories/${id}`, subsubcategory, { headers });
  }

  
  delete(id: number) {    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/subsubcategories/${id}`, { headers });
  }

  getSubCategories() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/subcategories/get`, { headers });

  }
}
