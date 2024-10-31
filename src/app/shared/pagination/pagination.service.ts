import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { PaginateParameters, Pagination } from '../../interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private authService = inject(AuthService);
  private _http = inject(HttpClient);
  public pagination$: Subject<Pagination> = new Subject<Pagination>();


  constructor() { }

  getData(paginateParameters: any) {
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');

    let params = new HttpParams()
      .set('order', paginateParameters.order)
      .set('pageNumber', paginateParameters.page)
      .set('pageSize', paginateParameters.page_size);      
    // Agregar parámetros adicionales
    Object.keys(paginateParameters.params).forEach(key => {
      params = params.set(key, paginateParameters.params[key]);
    });
    console.log(params);

    this._http.get<Pagination>(`${environment.apiUrl}/${paginateParameters.urlPrefix}`, { headers, params })
      .pipe(tap(resp => {        
        this.pagination$.next(resp);
      })).subscribe();
  }


}

