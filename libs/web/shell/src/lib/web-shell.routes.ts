import { Routes } from '@angular/router'
import { LayoutComponent } from './layout/main/layout.component'

export const xactCheckoutShellRoutes: Routes = [
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        loadChildren: () =>
          import('@xact-checkout/web/home/feature').then((m) => m.WebHomeFeatureModule),
      },
      {
        path: 'sell',
        loadChildren: () =>
          import('@xact-checkout/web/sell').then((m) => m.WebSellModule),
      },
    ],
  },
  {
    path: 'checkout/:tokenId/:nftId',
    loadChildren: () =>
      import('@xact-checkout/web/checkout').then((m) => m.WebCheckoutModule),
  },
  {
    path: '**',
    redirectTo: 'app',
  },
]
