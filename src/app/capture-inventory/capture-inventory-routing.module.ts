import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CaptureInventoryPage } from './capture-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: CaptureInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptureInventoryPageRoutingModule {}
