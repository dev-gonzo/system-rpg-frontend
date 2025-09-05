import { Routes } from '@angular/router';


export const NOT_FOUND_ROUTES: Routes = [
  {
    path: '**',
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/not-found.page').then(
                (m) => m.NotFoundPage,
              ),
          },
        ],
      },
    ],
  },
];
