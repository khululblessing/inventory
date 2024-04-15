import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  

  constructor(
    private db: AngularFirestore,
    private Auth: AngularFireAuth,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  async presentToast(message: string, duration: number, color: string) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      color,
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'circles',
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async login() {
    if (!this.email || !this.password) {
      await this.presentToast('Please provide both email and password', 2000, 'warning');
      return;
    }

    // Show loading indicator before signing in
    await this.presentLoading();

    try {
      const userCredential: firebase.auth.UserCredential = await this.Auth.signInWithEmailAndPassword(
        this.email,
        this.password
      );
      if (userCredential.user) {
        await this.checkEmailVerification();
      } else {
        console.error('User credential is missing');
        await this.presentToast('User credential is missing', 2000, 'danger');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      await this.presentToast('Invalid email or password', 2000, 'danger');
    } finally {
      // Dismiss loading indicator after login attempt
      await this.dismissLoading();
    }
  }

  private async checkEmailVerification() {
    const userEmail = await this.Auth.currentUser;
  
    if (userEmail) {
      if (userEmail.emailVerified) {
        // Email is verified, now check the user's role
        const userDocSnapshot = await this.db.collection('Users').doc(userEmail.uid).get().toPromise();
        if (userDocSnapshot && userDocSnapshot.exists) {
          const userData = userDocSnapshot.data() as { role?: string };
          if (userData && typeof userData.role === 'string' && userData.role === 'Manager') {
            // Navigate to the home page
            await this.router.navigate(['/home']);
          } else if (userData && typeof userData.role === 'string' && userData.role === 'Picker') {
            // Navigate to the inventory page
            await this.router.navigate(['/inventory']);
          } else {
            // Handle unknown or missing role
            await this.presentToast('Unknown user role', 2000, 'danger');
          }
        } else {
          // User document not found
          await this.presentToast('User data not found', 2000, 'danger');
        }
      } else {
        // Email is not verified
        await this.presentToast('Email is not verified. Please check your inbox and verify your email.', 2000, 'danger');
      }
    }
  }
}