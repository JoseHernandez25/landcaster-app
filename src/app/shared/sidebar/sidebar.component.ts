import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public dashboardRoutes = routes
    .filter(route => route.path === 'dashboard')
    .flatMap(dashboardRoute => dashboardRoute.children ?? [])
    .filter(route => route.path && !route.path.includes(':'));
  constructor(private route: ActivatedRoute, private router: Router) {

  }

  isActive(path: any): boolean {
    return this.route.snapshot.pathFromRoot.some(segment => segment.firstChild?.routeConfig?.path == path);
  }
}
