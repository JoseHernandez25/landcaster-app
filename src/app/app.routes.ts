import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth.component'),
        children: [
            {
                path: 'login',
                title: "Land'Caster",
                loadComponent: () => import('./auth/pages/login/login.component'),
            },

            {
                path: '', redirectTo: 'login', pathMatch: 'full',
            }
        ]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component'),
        children: [
            {
                path: 'profile',
                title: 'Mi Perfil',
                data: { icon: 'bi bi-person' },
                loadComponent: () => import('./dashboard/pages/profile/profile.component'),
            },
            {
                path: 'users',
                title: 'Usuarios',
                loadComponent: () => import('./dashboard/pages/users/users.component'),
            },
            {
                path: 'hinges',
                title: 'Bisagras',
                loadComponent: () => import('./dashboard/pages/hinges/hinges.component'),
            },
            {
                path: 'drawer-slides',
                title: 'Correderas',
                loadComponent: () => import('./dashboard/pages/drawer-slides/drawer-slides.component'),
            },
            {
                path: 'colors',
                title: 'Colores',
                loadComponent: () => import('./dashboard/pages/colors/colors.component'),
            },
            {
                path: 'materials',
                title: 'Materiales',
                loadComponent: () => import('./dashboard/pages/materials/materials.component'),
            },
            {
                path: 'models',
                title: 'Modelos',
                loadComponent: () => import('./dashboard/pages/models/models.component'),
            },
            {
                path: 'inventories',
                title: 'Inventarios',
                loadComponent: () => import('./dashboard/pages/stock/stock.component'),
            },
            {
                path: 'lines',
                title: 'Lineas',
                loadComponent: () => import('./dashboard/pages/lines/lines.component'),
            },
            {
                path: 'areas',
                title: 'Areas',
                loadComponent: () => import('./dashboard/pages/areas/areas.component'),
            },
            {
                path: 'routes',
                title: 'Rutas',
                loadComponent: () => import('./dashboard/pages/routes/routes.component'),
            },  
            {  
                path: 'joinery',
                title: 'Armados',
                loadComponent: () => import('./dashboard/pages/joinery/joinery.component'),
            },
            {
                path: 'categories',
                title: 'Categorias',
                loadComponent: () => import('./dashboard/pages/categories/categories.component'),
            },
            {
                path: 'external-accesories',
                title: 'Otros accesorios',
                loadComponent: () => import('./dashboard/pages/external-accesories/external-accesories.component'),
            },
            {
                path: '', redirectTo: 'profile', pathMatch: 'full',
            }
        ]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }


];
