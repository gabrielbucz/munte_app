import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'entrar',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/auth-callback/auth-callback').then((m) => m.AuthCallback),
  },
  {
    path: 'inicio',
    loadComponent: () => import('./features/inicio/inicio').then((m) => m.Inicio),
    canActivate: [authGuard],
  },
  {
    path: 'ofertas/nova',
    loadComponent: () =>
      import('./features/driver/ride-offer-form/ride-offer-form').then((m) => m.RideOfferForm),
    canActivate: [authGuard],
  },
];
