import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepickerPage } from './homepicker.page';

const routes: Routes = [
  {
    path: '',
    component: HomepickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomepickerPageRoutingModule {}
