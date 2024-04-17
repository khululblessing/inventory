import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-homepicker',
  templateUrl: './homepicker.page.html',
  styleUrls: ['./homepicker.page.scss'],
})
export class HomepickerPage implements OnInit {

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
 
}

