import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'capture-inventory',
    loadChildren: () => import('./capture-inventory/capture-inventory.module').then( m => m.CaptureInventoryPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./update/update.module').then( m => m.UpdatePageModule)
  },
  
  {
    path: 'forgot-p',
    loadChildren: () => import('./forgot-p/forgot-p.module').then( m => m.ForgotPPageModule)
  },
  {
    path: 'storeroom',
    loadChildren: () => import('./storeroom/storeroom.module').then( m => m.StoreroomPageModule)
  },
  { 
    path: 'storeroom', loadChildren: () => import('./storeroom/storeroom.module').then(m => m.StoreroomPageModule) 
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
