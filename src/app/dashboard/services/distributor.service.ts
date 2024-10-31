import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { Distributor } from '../../interfaces/models/user.interface';


@Injectable({
  providedIn: 'root'
})
export class DistributorService {
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
      .set('orderByAsc', paginateParameters.params?.orderByAsc)
      .set('orderBy', paginateParameters.params?.orderBy)
      .set('withTrashed', paginateParameters.params?.withTrashed);

    console.log(params);

    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.authService.token()} ` || '');

  return this.http.get<Pagination>(`${environment.apiUrl}/distributors`, { headers, params });
}

store(distributor: Distributor) {
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  return this.http.post<any>(`${environment.apiUrl}/distributors`, distributor, { headers });

}

  update(id: number, distributor: Distributor) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/distributors/${id}`, distributor, { headers });
  }


delete(id: number) {
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.authService.token()} ` || '');
  return this.http.delete<any>(`${environment.apiUrl}/distributors/${id}`, { headers });
}
}