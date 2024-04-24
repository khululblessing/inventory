import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
// import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const pdfMake = require('pdfmake/build/pdfmake.js');
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {
  items: any[] = [];
  itemName: string = '';
  itemCategory: string = '';
  itemDescription: string = '';
  itemQuantity: number = 0;
  pickersDetails: string = '';
  dateOfPickup: string = '';
  timeOfPickup: string = '';
  barcode: string = '';
  productInfor: any; // Define productInfor property
  newImage: string = ''; // Define newImage property
  imageUrl: string = ''; // Define imageUrl property

  private inventoryCollection: AngularFirestoreCollection<any>; // Provide type for AngularFirestoreCollection
  private storeCollection: AngularFirestoreCollection<any>; // Provide type for AngularFirestoreCollection
  imageBase64: string | undefined;

  constructor(
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router // Inject Router
  ) {
    this.inventoryCollection = this.firestore.collection('inventory');
    this.storeCollection = this.firestore.collection('store');
  }

  ngOnInit() {
    this.fetchItemsFromStore();
    this.getPassedData();
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.imageBase64 = image.base64String;
  }

  async getPassedData() {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.productInfor = await this.router.getCurrentNavigation()?.extras.state;
      console.log(this.productInfor);
      this.barcode = this.productInfor.barcode;
      this.itemName = this.productInfor.name;
      this.itemCategory = this.productInfor.category;
      this.itemDescription = this.productInfor.description;
      this.itemQuantity = this.productInfor.quantity;
      this.newImage = this.productInfor.imageUrl;
      this.imageUrl = this.productInfor.imageUrl;
    }
  }

  async fetchItemsFromStore() {
    const loader = await this.loadingController.create({
      message: 'Fetching items from store...',
    });
    await loader.present();

    try {
      const storeSnapshot = await this.storeCollection.get().toPromise();
      if (storeSnapshot) {
        this.items = storeSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data() as { [key: string]: any },
        }));
      }
    } catch (error) {
      console.error('Error fetching items from store:', error);
    } finally {
      loader.dismiss();
    }
  }

  async addItemToStore() {
    const loader = await this.loadingController.create({
      message: 'Adding item to store...',
    });
    await loader.present();

    try {
      // 1. Decrement the stock quantity in the 'inventory' collection
      const querySnapshot = await this.firestore.collection('inventory').ref.where('barcode', '==',this.barcode).get();
      if (!querySnapshot.empty) {
        const document:any = querySnapshot.docs[0].data();
       
       const documentId = querySnapshot.docs[0].id; 
      
          await this.inventoryCollection.doc(documentId).update({ quantity:  document.quantity + this.itemQuantity });
       
      } else {
        await this.presentToast('Item not found in inventory.');
        return;
      }

      // 2. Add the item to the 'store' collection
      await this.storeCollection.add({
        name: this.itemName,
        category: this.itemCategory,
        description: this.itemDescription,
        quantity: this.itemQuantity,
        pickersDetails: this.pickersDetails,
        dateOfPickup: this.dateOfPickup,
        timeOfPickup: this.timeOfPickup,
        barcode: this.barcode,
      });

      await this.presentToast('Item added to store successfully.');

      // Reset the form fields
      this.itemName = '';
      this.itemCategory = '';
      this.itemDescription = '';
      this.itemQuantity = 0;
      this.barcode = '';
    } catch (error) {
      console.error('Error adding item to store:', error);
      await this.presentToast('Error adding item to store.');
    } finally {
      loader.dismiss();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}