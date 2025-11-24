import { Routes } from '@angular/router';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { LayoutMainComponent } from '../../layouts/layout-main/layout-main.component';

export const ADVENTURE_ROUTES: Routes = [
  {
    path: 'game-groups/:id/adventures',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/create/adventure-create.page').then(
            (m) => m.AdventureCreatePage,
          ),
      },
      {
        path: ':adventureId',
        loadComponent: () =>
          import('./pages/detail/adventure-detail.page').then(
            (m) => m.AdventureDetailPage,
          ),
      }
    ],
  },
  {
    path: 'adventures',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'update/:id',
        loadComponent: () =>
          import('./pages/update/adventure-update.page').then(
            (m) => m.AdventureUpdatePage,
          ),
      }
    ],
  },
];
