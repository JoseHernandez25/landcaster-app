import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Pagination } from '../../interfaces/pagination.interface';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from '../../auth/services/auth.service';
import { Line } from '../../interfaces/models/line.interface';

@Injectable({
  providedIn: 'root'
})
export class LinesService {

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

    return this.http.get<Pagination>(`${environment.apiUrl}/lines`, { headers, params });
  }

  store(line: Line) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/lines`, line, { headers });
  }


  update(id: number, line: Line) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/lines/${id}`, line, { headers });
  }


  delete(id: number) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/lines/${id}`, { headers });
  }


}
