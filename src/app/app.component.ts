import { Component } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router'; // Import Router
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
  constructor(
    private auth: AngularFireAuth,
    private alertController: AlertController,
    private router: Router, // Include Router in constructor parameters
    private toastController: ToastController
  ) {
    this.sideMenu();
  }

  navigate: any;

  sideMenu() {
    this.navigate = [
    {
        title: "Store",
        url: "/stock",
        icon: "storefront-outline"
      },
      {
        title: "Storeroom",
        url: "/storeroom",
        icon: "cube-outline"
      },
      {
        title: "Logout",
        icon: "exit",
        click: this.logout.bind(this)
      },
    ];
  }

  logout() {
    // perform logout action, e.g. clear session, local storage, etc.
    this.presentConfirmationAlert();
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to SIGN OUT?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'my-custom-alert',
          handler: () => {
            console.log('Confirmation canceled');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.auth.signOut().then(() => {
              this.router.navigateByUrl("/login");
              this.presentToast();
            }).catch((error) => {
              // Handle error
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'SIGNED OUT!',
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }
}
