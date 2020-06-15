import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/wallet/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
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
    path: 'add',
    loadChildren: () => import('./pages/wallet/add/add.module').then(m => m.AddPageModule)
  },
  {
    path: 'create-accounts',
    loadChildren: () => import('./pages/wallet/create/create-accounts/create-accounts.module').then( m => m.CreateAccountsPageModule)
  },
  {
    path: 'chart',
    loadChildren: () => import('./pages/chart/chart.module').then( m => m.ChartPageModule)
  },
  {
    path: 'confirm-access',
    loadChildren: () => import('./pages/external/confirm-access/confirm-access.module').then( m => m.ConfirmAccessPageModule)
  },
  {
    path: 'reload-singin',
    loadChildren: () => import('./pages/reload-singin/reload-singin.module').then( m => m.ReloadSinginPageModule)
  },
  {
    path: 'send-transaction',
    loadChildren: () => import('./pages/external/send-transaction/send-transaction.module').then( m => m.SendTransactionPageModule)
  },
 
  {
    path: 'export-privatekey-modal',
    loadChildren: () => import('./pages/dashboard/export-privatekey-modal/export-privatekey-modal.module').then( m => m.ExportPrivatekeyModalPageModule)
  },  {
    path: 'export-privatekey',
    loadChildren: () => import('./pages/wallet/export-privatekey/export-privatekey.module').then( m => m.ExportPrivatekeyPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
