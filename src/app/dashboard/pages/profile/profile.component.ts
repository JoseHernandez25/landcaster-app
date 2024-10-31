
import { Component, computed, inject } from '@angular/core';
import { ProfileImagePipe } from '../../../pipes/profile-image.pipe';
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileImagePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export default class ProfileComponent {

  public urlImage: string = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  private authService = inject(AuthService);

  public user = computed(() => this.authService.user());
}
