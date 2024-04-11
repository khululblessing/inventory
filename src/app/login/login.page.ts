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

  async presentToast(message: string, duration: number, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      color: color // Set the color of the toast
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
      this.presentToast('Please provide both email and password', 2000, 'warning');
      return;
    }

    // Show loading indicator before signing in
    await this.presentLoading();

    this.Auth.signInWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        if (userCredential && userCredential.user) {
          const email = userCredential.user.email;
          this.checkEmailVerification();


        } else {
          console.error('User credential is missing');
          this.presentToast('User credential is missing', 2000, 'danger');
        }

        // Dismiss loading indicator after login attempt
        this.dismissLoading();
      })
      .catch((error: any) => {
        console.error('Error signing in:', error);
        this.presentToast('Invalid email or password', 2000, 'danger');

        // Dismiss loading indicator after login attempt
        this.dismissLoading();
      });
  }
  async checkEmailVerification() {
    const userEmail = await this.Auth.currentUser;
    if (userEmail) {
     // await user.reload();
      if (userEmail.emailVerified) {
        // Email is verified
        this.Nav.navigateForward("/home");
        
      } else {
        // Email is not verified
       this.presentToast('Email is not verified. Please check your inbox and verify your email.', 2000, 'danger');
      }
    } 
  }  
}

