import { Routes } from '@angular/router';
import { LayoutMainComponent } from '@app/layouts/layout-main/layout-main.component';

export const DEMO_ROUTES: Routes = [
  {
    path: 'demo',
    component: LayoutMainComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/demo.page').then((m) => m.DemoPage),
      },
    ],
  },
];
