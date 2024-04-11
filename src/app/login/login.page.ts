import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: any;
  password: any;

  constructor(
    private db: AngularFirestore,
    private Auth: AngularFireAuth,
    private Nav: NavController,
    private toastController: ToastController,
    private loadingController: LoadingController // Inject LoadingController
  ) { }
  

  ngOnInit() {
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...', // You can customize the loading message
      spinner: 'circles' // You can choose a spinner type
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async Login() {
    if (!this.email || !this.password) {
      this.presentToast('Please provide both email and password', 2000);
      return;
    }

    // Show loading indicator before signing in
    await this.presentLoading();

    this.Auth.signInWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        if (userCredential && userCredential.user) {
          const email = userCredential.user.email;

          if (email) {
            this.db.collection('Users', ref => ref.where('email', '==', email))
              .get()
              .toPromise()
              .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                  const id = doc.id;
                  console.log(id);
                  const userData = doc.data();
                });
                console.log("Login successful!");
                this.Nav.navigateForward("/home");
              })
              .catch((error: any) => {
                console.error('Error fetching user data:', error);
                this.presentToast('Error fetching user data', 2000);
              });
          } else {
            console.error('User email not found in userCredential');
            this.presentToast('User email not found', 2000);
          }
        } else {
          console.error('User credential is missing');
          this.presentToast('User credential is missing', 2000);
        }

        // Dismiss loading indicator after login attempt
        this.dismissLoading();
      })
      .catch((error: any) => {
        console.error('Error signing in:', error);
        this.presentToast('Invalid email or password', 2000);

        // Dismiss loading indicator after login attempt
        this.dismissLoading();
      });
  }
}
