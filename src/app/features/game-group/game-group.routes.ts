import { Routes } from '@angular/router';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { LayoutMainComponent } from '../../layouts/layout-main/layout-main.component';

export const GAME_GROUP_ROUTES: Routes = [
  {
    path: 'game-groups',
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
      {
        path: 'my-groups',
        loadComponent: () =>
          import('./pages/my-groups/game-group-my-groups.page').then(
            (m) => m.GameGroupMyGroupsPage,
          ),
      },
    ],
  },
];
