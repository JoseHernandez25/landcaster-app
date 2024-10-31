import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { SubTypeMaterial } from '../../interfaces/models/subTypeMaterial.interface';

@Injectable({
  providedIn: 'root',
})
export class SubtypematerialsService {
  private readonly baseUrl: string = environment.apiUrl;

  // Injection de dependencias
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {}

  get(paginateParameters: any) {
    const params = new HttpParams()
      .set('order', paginateParameters.order)
      .set('pageNumber', paginateParameters.page)
      .set('pageSize', paginateParameters.page_size)
      .set('term', paginateParameters.params?.term);

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.token()} ` || ''
    );

    return this.http.get<Pagination>(`${environment.apiUrl}/subtypematerials`, {
      headers,
      params,
    });
  }

  store(subtypematerial: any) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.token()} ` || ''
    );
    return this.http.post<any>(
      `${environment.apiUrl}/subtypematerials`,
      subtypematerial,
      { headers }
    );
  }

  update(id: number, subtypematerial: SubTypeMaterial) {
    console.log(id, subtypematerial);

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.token()} ` || ''
    );
    return this.http.put<any>(
      `${environment.apiUrl}/subtypematerials/${id}`,
      subtypematerial,
      { headers }
    );
  }

  delete(id: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.token()} ` || ''
    );
    return this.http.delete<any>(
      `${environment.apiUrl}/subtypematerials/${id}`,
      { headers }
    );
  }
}
