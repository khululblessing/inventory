import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router,
              private nav: NavController,
  ) { }

  ngOnInit() {
  }

  captureInventory() {
    
    this.router.navigate(['/capture-inventory']);
  }

  updateInventory() {
    this.router.navigateByUrl('/update');
  }

  delivery() {
    this.router.navigateByUrl('/take-pictures');
  }

  viewRemainingInventory() {
    this.router.navigateByUrl('/storeroom');
  }

  viewAnalytics() {
    this.router.navigateByUrl('/analytics');
  }
 
}

