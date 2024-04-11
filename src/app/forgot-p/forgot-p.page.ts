import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-forgot-p',
  templateUrl: './forgot-p.page.html',
  styleUrls: ['./forgot-p.page.scss'],
})
export class ForgotPPage implements OnInit {

  email: string = '';
  loading: boolean = false;

  constructor(private loadingController: LoadingController) {}
  ngOnInit() {
  }
  async sendResetLink() {
    // Show loading spinner
    this.loading = true;
    const loading = await this.loadingController.create({
      message: 'Sending reset link...',
      duration: 2000 // Example duration, adjust as needed
    });
    await loading.present();

    // Simulate sending reset link (replace with actual logic)
    setTimeout(() => {
      // Hide loading spinner
      this.loading = false;
      loading.dismiss();

      // Display success message or navigate to another page
      // Example: this.router.navigateByUrl('/reset-password');
    }, 2000);
  }
}
