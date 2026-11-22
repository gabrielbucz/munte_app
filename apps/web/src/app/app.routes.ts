import { Routes } from '@angular/router';

export const routes: Routes = [
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
  },
];
