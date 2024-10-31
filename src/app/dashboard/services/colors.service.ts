import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { Color } from '../../interfaces/models/color.interface';


@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  private readonly baseUrl: string = environment.apiUrl;

  // Injection de dependencias
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() { }

  get(paginateParameters: any) {
    const params = new HttpParams()
      .set('order', paginateParameters.order)
      .set('pageNumber', paginateParameters.page)
      .set('pageSize', paginateParameters.page_size)
      .set('term', paginateParameters.params?.term)
      .set('brandId', paginateParameters.params?.brandId)
      .set('materialTypeId', paginateParameters.params?.materialTypeId)
      .set('orderByAsc', paginateParameters.params?.orderByAsc)
      .set('orderBy', paginateParameters.params?.orderBy)
      .set('withTrashed', paginateParameters.params?.withTrashed);

    console.log(params);

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.authService.token()} ` || '');

  return this.http.get<Pagination>(`${environment.apiUrl}/colors`, { headers, params });
}

store(color: Color) {
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  return this.http.post<any>(`${environment.apiUrl}/colors`, color, { headers });

}

  update(id: number, color: Color) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/colors/${id}`, color, { headers });
  }


delete(id: number) {
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  return this.http.delete<any>(`${environment.apiUrl}/colors/${id}`, { headers });
}

getBrands() {
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  return this.http.get<any>(`${environment.apiUrl}/colors/get-brands`, { headers });

}
}