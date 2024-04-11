import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  name: any;
  email: any;
  password: any;
  confirm_password: any;

  constructor(
    private db: AngularFirestore,
    private Auth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController // Inject LoadingController
  ) { }

  ngOnInit() {
  }

  async register() {
    if (this.password !== this.confirm_password) {
      const toast = await this.toastController.create({
        message: 'Passwords do not match',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      toast.present();
      return;
    }

    // Show loading spinner while registering
    const loading = await this.loadingController.create({
      message: 'Registering...',
    });
    await loading.present();

    const userData = {
      firstname: this.name,
      email: this.email,
      password: this.password,
    };

    try {
      const userCredential = await this.Auth.createUserWithEmailAndPassword(this.email, this.password);
      if (userCredential.user) {
        await this.db.collection('Users').add(userData);
        console.log('User data added successfully');
        const loader = await this.loadingController.create({
          message: 'Signing up',
          cssClass: 'custom-loader-class'
        });
        await loader.present();
      
    
            this.sendVerificationEmail(userCredential.user);
    
            //////
      } else {
        console.error('User credential is missing');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'The email address is already in use by another account.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      }
      const toast = await this.toastController.create({
        message: errorMessage,
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      toast.present();
    } finally {
      // Dismiss the loading spinner when registration is complete or fails
      await loading.dismiss();
    }
  }
  async sendVerificationEmail(user:any) {
    try {
      await user.sendEmailVerification();
     // this.presentToast('Verification email sent. Please check your inbox.');
     this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error sending verification email:', error);
     // this.presentToast('Error sending verification email. Please try again.');
    }
  }
}
