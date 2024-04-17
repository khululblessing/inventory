import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private router: Router, private loadingController: LoadingController) {}

  async ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']); // Navigate to the login page after a delay
    }, 3000);
  }

}
