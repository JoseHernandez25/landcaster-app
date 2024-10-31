import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment.prod";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AuthService } from "../../auth/services/auth.service";
import { Pagination } from "../../interfaces/pagination.interface";

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private readonly baseUrl: string = environment.apiUrl;

  // Injection de dependencias
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() { }

  getAll() {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.token()} ` || '');
    return this.http.get<any>(`${environment.apiUrl}/units/get-all`, { headers });

  }
}
