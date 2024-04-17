import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
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
    private router: Router,
    private Nav: NavController
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

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
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
  
  Login() {
    this.Auth.signInWithEmailAndPassword(this.email, this.password)
    .then((userCredential) => {
      if (userCredential) {
        const email = userCredential.user?.email; // Extract email from userCredential
  
        if (email) {
          this.db.collection('Users', ref => ref.where('email', '==', email))
            .get()
            .toPromise()
            .then((querySnapshot: any) => {
              querySnapshot.forEach((doc: any) => {
                const userData = doc.data();
                const status = userData.status; // Get the status field from userData
                console.log(status);
  
                // Check if the email is verified before navigating
                this.checkEmailVerification();
              });
            })
            .catch((error: any) => {
              this.showToast('Error fetching user data: ' + error);
            });
        } else {
          this.showToast('User email not found in userCredential');
        }
      } else {
        this.showToast('User credential is missing');
      }
    })
    .catch((error: any) => {
      this.showToast('Error signing in: ' + error);
    });
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
            await this.router.navigate(['/homepicker']);
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