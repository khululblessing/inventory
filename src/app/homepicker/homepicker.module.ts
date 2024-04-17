import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomepickerPageRoutingModule } from './homepicker-routing.module';

import { HomepickerPage } from './homepicker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomepickerPageRoutingModule
  ],
  declarations: [HomepickerPage]
})
export class HomepickerPageModule {}
