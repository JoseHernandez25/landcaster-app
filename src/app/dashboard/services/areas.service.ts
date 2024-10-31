import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

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
     .set('orderByAsc', paginateParameters.params?.orderByAsc)
     .set('orderBy', paginateParameters.params?.orderBy);

   const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${this.authService.token()} ` || '');

   return this.http.get<Pagination>(`${environment.apiUrl}/areas`, { headers, params });
 }

 store(area: any) {
   const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${this.authService.token()} ` || '');
   return this.http.post<any>(`${environment.apiUrl}/areas`, area, { headers });
 }


 update(id: number, area: any) {
   const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${this.authService.token()} ` || '');
   return this.http.put<any>(`${environment.apiUrl}/areas/${id}`, area, { headers });
 }


 delete(id: number) {
   const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${this.authService.token()} ` || '');
   return this.http.delete<any>(`${environment.apiUrl}/areas/${id}`, { headers });
 }

}
