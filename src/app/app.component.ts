import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'landcaster-app';

    //signals
    public user = computed(() => this.authService.user());
    private authStatus = computed(() => this.authService.authStatus());
  
    //injectino dependices
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);

    public finishedAuthCheck = computed<boolean>(() => {
      if (this.authService.authStatus() === AuthStatus.checking) {
        return false;
      }
      return true;
    });
    public authStatusChangedEffect = effect(() => {
      const authStatus = this.authStatus();
      if (authStatus === AuthStatus.authenticated) {
        this.router.navigateByUrl('dashboard');
      } else if (authStatus === AuthStatus.checking) {
        return;
      } else if (authStatus === AuthStatus.notAuthenticated) {
        this.router.navigate(['/auth/login']);
      }
  
    });
}
