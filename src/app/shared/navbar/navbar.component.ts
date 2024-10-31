import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { ToastComponent } from '../toast/toast.component';
import { ProfileImagePipe } from '../../pipes/profile-image.pipe';
import { CommonModule } from '@angular/common';
import { CurrencieService } from '../../dashboard/services/currencie.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ToastComponent, ProfileImagePipe, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isSidebarCollapsed: boolean = false;
  private authService = inject(AuthService);
  private currencyService = inject(CurrencieService);

  public user = computed(() => this.authService.user());

  public urlImage: string = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  public currencies: any = [];

  ngAfterViewInit() {
    this.getCurrencies();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logOut() {
    this.authService.logout();
  }

  getCurrencyValue(currency: string) {
    // this.currencyService.getValueCurriency(currency).subscribe({
    //   next: (value) => {
    //     console.log(value);
        
    //     return value.conversion_rate;
    //   },
    //   error: (err) => {

    //   },
    // });
  }


  getCurrencies() {
    this.currencyService.get().subscribe({
      next: (currencies) => {
        console.log(currencies);

        this.currencies = currencies;
      },
      error: (err) => {
        console.log(err);

      },
    });
  }
}
