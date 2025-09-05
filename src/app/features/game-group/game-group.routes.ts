import { Routes } from '@angular/router';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { LayoutMainComponent } from '../../layouts/layout-main/layout-main.component';

export const GAME_GROUP_ROUTES: Routes = [
  {
    path: 'game-group',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/create/game-group-create.page').then(
            (m) => m.GameGroupCreatePage,
          ),
      },
    ],
  },
];
