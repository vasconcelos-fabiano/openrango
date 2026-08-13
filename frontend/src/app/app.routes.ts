import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { NotImplemented } from './pages/not-implemented/not-implemented';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },

  {
    path: 'app',
    component: MainLayout,
    children: [
      {
        path: 'pedidos',
        component: NotImplemented,
      },
      {
        path: 'estoque',
        component: NotImplemented,
      },
      {
        path: 'clientes',
        component: NotImplemented,
      },
      {
        path: 'rotulos',
        component: NotImplemented,
      },
      {
        path: 'produtos',
        component: NotImplemented,
      },
      {
        path: 'precificacao',
        component: NotImplemented,
      },
      {
        path: 'producao',
        component: NotImplemented,
      },
      {
        path: 'afiliados',
        component: NotImplemented,
      },
       {
        path: 'relatorios',
        component: NotImplemented,
      },
    ],
  },
];