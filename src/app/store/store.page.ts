import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {
  items: any[] = [];
  itemName: string = '';
  itemCategory: string = '';
  itemDescription: string = '';
  itemQuantity: number = 0;
  barcode: string = '';

  private inventoryCollection: AngularFirestoreCollection;
  private storeCollection: AngularFirestoreCollection;

  constructor(
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.inventoryCollection = this.firestore.collection('inventory');
    this.storeCollection = this.firestore.collection('store');
  }

  ngOnInit() {
    this.fetchItemsFromStore();
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
      
          await this.inventoryCollection.doc(documentId).update({ quantity:  document.quantity - 1 });
       
      } else {
        await this.presentToast('Item not found in inventory.');
        return;
      }

      // 2. Add the item to the 'store' collection
      await this.storeCollection.add({
        name: this.itemName,
        category: this.itemCategory,
        description: this.itemDescription,
        quantity: 1,
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