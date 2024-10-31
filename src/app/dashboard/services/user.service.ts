import { User } from './../../interfaces/models/user.interface';
import { Injectable, inject } from '@angular/core';
import {Pagination } from '../../interfaces/pagination.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseURL: string = environment.apiUrl

  private http = inject(HttpClient);
  private authService = inject(AuthService)

  constructor() { }
  
  get(paginateParameters: any){
    const params = new HttpParams()
     .set(`order`, paginateParameters.order)
     .set(`pageNumber`, paginateParameters.page)
     .set(`pageSize`, paginateParameters.page_size)
     .set('roleId' , paginateParameters.params?.roleId)
     .set(`term`, paginateParameters.params?.term)
     .set('orderByAsc', paginateParameters.params?.orderByAsc)
     .set('orderBy', paginateParameters.params?.orderBy)
     .set('withTrashed', paginateParameters.params?.withTrashed);

     const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${this.authService.token()}` || '');

   return this.http.get<Pagination>(`${this.baseURL}/users`, { headers, params });
 }

 store(user: User) {
   const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${this.authService.token()}` || '');
   return this.http.post<any>(`${this.baseURL}/users`, user, { headers });
 }

 update(id: string, user: User) {
   const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${this.authService.token()}` || '');
   return this.http.put<any>(`${environment.apiUrl}/users/${id}`, user, { headers });
 }

 delete(id: string) {
   const headers = new HttpHeaders()
     .set('Authorization', `Bearer ${this.authService.token()}` || '');
   return this.http.delete<any>(`${this.baseURL}/users/${id}`, { headers });
 }
}
