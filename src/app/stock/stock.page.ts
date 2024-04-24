import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationExtras, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage implements OnInit {
  inventory: any[] = [];
  filteredInventory: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedQuantityRange: string = '';

  isModalOpen = false;
  selectedImageUrl = '';
  modalTitle = '';
  photo: any[] = [];

  constructor(private firestore: AngularFirestore, private router: Router) {
  }

  ngOnInit() {
    this.getInventory();
  }
  goToUpdate(
    name: any,
    category: any,
    description: any,
    quantity: any,
    barcode: any,
    pickersDetails: any,
    dateOfPickup: any,
    timeOfPickup: any,
    imageUrl: any
  ) {
    let navi: NavigationExtras = {
      state: {
        name: name,
        category: category,
        description: description,
        imageUrl: imageUrl || '',
        quantity: quantity,
        pickersDetails: pickersDetails,
        dateOfPickup: dateOfPickup,
        timeOfPickup: timeOfPickup,
        barcode: barcode || '',
      },
    };
    this.router.navigate(['/store'], navi);
  }

  openModal(imageUrl: string, itemName: string) {
    this.selectedImageUrl = imageUrl;
    this.modalTitle = itemName;
    this.isModalOpen = true;
  }

  getInventory() {
    this.firestore
      .collection('store')
      .valueChanges()
      .subscribe((data: any[]) => {
        this.inventory = data;
        this.filterInventory();
        this.inventory.forEach((item: { imageUrl: any; }) => {
          const imageUrl = item.imageUrl; // Assuming 'capturedPhotosUrl' is where you store the image URL in Firestore
          if (imageUrl) {
            // If the image URL exists, add it to capturedPhotos array
            this.photo.push(imageUrl);
          }
        });
      });
  }

  filterInventory() {
    this.filteredInventory = this.inventory.filter((item) =>
      (item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      this.searchTerm === '') && 
      (this.selectedCategory === '' || item.category === this.selectedCategory) &&
      (this.selectedQuantityRange === '' || this.checkQuantityRange(item.quantity))
    );
  }

  checkQuantityRange(quantity: number): boolean {
    if (this.selectedQuantityRange === 'tooLow' && quantity <= 10) {
      return true;
    } else if (this.selectedQuantityRange === 'runningLow' && quantity >= 11 && quantity <= 20) {
      return true;
    } else if (this.selectedQuantityRange === 'middle' && quantity >= 21 && quantity <= 49) {
      return true;
    } else if (this.selectedQuantityRange === 'full' && quantity >= 50) {
      return true;
    } else {
      return false;
    }
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  goToStoreroomPage() {
    this.router.navigate(['/storeroom']);
  }
  Update() {
    this.router.navigate(['/store']);
  }
}