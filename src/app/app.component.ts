import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Capture Inventory', url: '/folder/capture-inventory', icon: 'cloud-upload' },
    { title: 'Update Inventory', url: '/folder/outbox', icon: 'add-circle' },
    { title: 'Take Pictures', url: '/folder/favorites', icon: 'camera' },
    { title: 'View Remaining Inventory', url: '/folder/archived', icon: 'eye' },
    { title: 'Product Analytics', url: '/folder/trash', icon: 'analytics' },
  ];
  constructor() {}
}
