import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'import',
    loadChildren: () => import('./pages/wallet/import/import.module').then(m => m.ImportPageModule)
  },
  {
    path: 'transaction',
    loadChildren: () => import('./pages/transaction/transaction.module').then(m => m.TransactionPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then(m => m.SettingPageModule)
  },
  {
    path: 'infowallet',
    loadChildren: () => import('./pages/wallet/create/info/info.module').then(m => m.InfoPageModule)
  },
  {
    path: 'homewallet',
    loadChildren: () => import('./pages/wallet/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'detailwallet',
    loadChildren: () => import('./pages/wallet/create/detail/detail.module').then(m => m.DetailPageModule)
  },
  {
    path: 'generatewallet',
    loadChildren: () => import('./pages/wallet/create/generate/generate.module').then(m => m.GeneratePageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/wallet/add/add.module').then(m => m.AddPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
