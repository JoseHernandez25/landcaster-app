import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { Pagination } from '../../interfaces/pagination.interface';
import { DoorModel } from '../../interfaces/models/doorModel.interface';

@Injectable({
  providedIn: 'root'
})
export class DoorModelsService {
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
      .set('modelId', paginateParameters.params?.modelId)
      .set('lineId', paginateParameters.params?.lineId)
      .set('routeId', paginateParameters.params?.routeId)
      .set('joineryId', paginateParameters.params?.joineryId)
      .set('joineryTypeId', paginateParameters.params?.joineryTypeId)
      .set('materialTypeId', paginateParameters.params?.materialTypeId)
      .set('orderByAsc', paginateParameters.params?.orderByAsc)
      .set('orderBy', paginateParameters.params?.orderBy)
      .set('withTrashed', paginateParameters.params?.withTrashed);
      

    

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');

    return this.http.get<Pagination>(`${environment.apiUrl}/doormodel`, { headers, params });
  }
  
  getModel() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      
    return this.http.get<any>(`${environment.apiUrl}/doormodel/getModel`, { headers });
  }

  getMaterialType() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      
    return this.http.get<any>(`${environment.apiUrl}/doormodel/getMaterialType`, { headers });
  }

  getJoinery() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      
    return this.http.get<any>(`${environment.apiUrl}/doormodel/getJoinery`, { headers });
  }

  getJoineryType() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      
    return this.http.get<any>(`${environment.apiUrl}/doormodel/getJoineryType`, { headers });
  }

  getRoute() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      
    return this.http.get<any>(`${environment.apiUrl}/doormodel/getRoute`, { headers });
  }
  getLine() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      
    return this.http.get<any>(`${environment.apiUrl}/doormodel/getLine`, { headers });
  }
  

  getTypesBoxJourney() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
      
    return this.http.get<any>(`${environment.apiUrl}/doormodel/getTypesBoxJourney`, { headers });
  }


  store(doorModel: any) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.post<any>(`${environment.apiUrl}/doormodel`, doorModel, { headers });

  }

  update(id: number, doorModel: DoorModel) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.put<any>(`${environment.apiUrl}/doormodel/${id}`, doorModel, { headers });
  }


  delete(id: number) {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.delete<any>(`${environment.apiUrl}/doormodel/${id}`, { headers });
  }
}
