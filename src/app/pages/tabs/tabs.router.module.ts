import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'transaction',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../transaction/transaction.module').then(m => m.TransactionPageModule)
          }
        ]
      },
      {
        path: 'setting',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../setting/setting.module').then(m => m.SettingPageModule)
          }
        ]
      },
      {
        path: 'chart',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../chart/chart.module').then(m => m.ChartPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
