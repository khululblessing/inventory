import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  confirm_password: string = '';
  role: string = '';

  constructor(
    private db: AngularFirestore,
    private Auth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async register() {
    if (this.password !== this.confirm_password) {
      await this.presentToast('Passwords do not match', 'danger');
      return;
    }

    // Show loading spinner while registering
    const loading = await this.loadingController.create({
      message: 'Registering...',
    });
    await loading.present();
    setTimeout(async () => {
      await loading.dismiss();
    }, 3000);
   // await loading.dismiss();

    const userData = {
      firstname: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
    };

   try {
    const userCredential: firebase.auth.UserCredential = await this.Auth.createUserWithEmailAndPassword(
      this.email,
      this.password
    );
    if (userCredential.user) {
      const userData = {
        firstname: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
      };
      await this.db.collection('Users').doc(userCredential.user.uid).set(userData);
      console.log('User data added successfully');
      await this.sendVerificationEmail(userCredential.user);
      
      await this.router.navigate(['/login']);
    } else {
      console.error('User credential is missing');
    }
  } catch (error) {
    // ... (existing error handling)
  }
  }

  async sendVerificationEmail(user: firebase.User) {
    try {
      await user.sendEmailVerification();
      await this.presentToast('Verification email sent. Please check your inbox.', 'success');
    } catch (error) {
      console.error('Error sending verification email:', error);
      await this.presentToast('Error sending verification email. Please try again.', 'danger');
    }
  }

  private async handleRegistrationError(error: unknown) {
    let errorMessage = 'Registration failed. Please try again.';
    if (this.isFirebaseAuthError(error) && error.code === 'auth/email-already-in-use') {
      errorMessage = 'The email address is already in use by another account.';
    } else if (this.isFirebaseAuthError(error) && error.code === 'auth/weak-password') {
      errorMessage = 'The password is too weak.';
    } else if (this.isFirebaseAuthError(error) && error.code === 'auth/invalid-email') {
      errorMessage = 'The email address is not valid.';
    } else if (this.isFirebaseAuthError(error) && error.code === 'auth/invalid-password') {
      errorMessage = 'The password is invalid.';
    } else if (this.isFirebaseAuthError(error) && error.code === 'auth/user-not-found') {
      errorMessage = 'The user was not found.';
    } else if (this.isFirebaseAuthError(error) && error.code === 'auth/wrong-password') {
      errorMessage = 'The password is incorrect.';
    }
    await this.presentToast(errorMessage, 'danger');
  }

  private isFirebaseAuthError(error: unknown): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error;
  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}