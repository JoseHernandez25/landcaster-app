import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment.prod";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { AuthService } from '../../auth/services/auth.service';
import { Role } from "../../interfaces/models/user.interface";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private readonly baseURL: string = environment.apiUrl
    private http = inject(HttpClient);
    private authService = inject(AuthService)

    constructor() {}
    getAll() {
      const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${this.authService.token()}` || '');
      return this.http.get<Role[]>(`${environment.apiUrl}/roles`, { headers });
  }
}