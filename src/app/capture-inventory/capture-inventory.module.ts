import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CaptureInventoryPageRoutingModule } from './capture-inventory-routing.module';

import { CaptureInventoryPage } from './capture-inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CaptureInventoryPageRoutingModule
  ],
  declarations: [CaptureInventoryPage]
})
export class CaptureInventoryPageModule {}
