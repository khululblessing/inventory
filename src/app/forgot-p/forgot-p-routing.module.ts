import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPPage } from './forgot-p.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPPageRoutingModule {}
