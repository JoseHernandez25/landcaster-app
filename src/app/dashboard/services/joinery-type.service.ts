import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment.prod';
import { Pagination } from '../../interfaces/pagination.interface';
import { JoinerieType } from '../../interfaces/models/joinery.interface';


@Injectable({
  providedIn: 'root'
})
export class JoineryTypeService {

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

    return this.http.get<Pagination>(`${environment.apiUrl}/joinerytypes`, { headers, params });
  }

  store(joinerytype: any) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/joinerytypes`, joinerytype, { headers });

  }

  update(id: number, joinerytype: JoinerieType) {
    console.log(id,joinerytype);
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/joinerytypes/${id}`, joinerytype, { headers });
  }

  delete(id: number) {    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/joinerytypes/${id}`, { headers });
  }
}
