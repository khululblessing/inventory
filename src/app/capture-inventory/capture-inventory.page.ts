import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
// import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const pdfMake = require('pdfmake/build/pdfmake.js');
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';

@Component({
  selector: 'app-capture-inventory',
  templateUrl: './capture-inventory.page.html',
  styleUrls: ['./capture-inventory.page.scss'],
})
export class CaptureInventoryPage {
  itemName: string = '';
  itemCategory: string = '';
  itemDescription: string = '';
  itemQuantity: number = 0;
  pickersDetails: string = '';
  dateOfPickup: string = '';
  timeOfPickup: string = '';
  barcode: string = '';
  imageBase64: any;
  imageUrl: string | null = null;
  cart: any[] = []; 
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
   private  ToastController: ToastController,  private alertController: AlertController,
  
  ) {}

  ngOnInit() {
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

  async scanBarcode() {
 
    window.document.querySelector('ion-app')?.classList.add('cameraView');
   
    document.querySelector('body')?.classList.add('scanner-active');
    await BarcodeScanner.checkPermission({ force: true });
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    //BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    // if the result has content
    if (result.hasContent) {
      this.barcode = result.content;
      console.log(result.content);
      
    
      
      const querySnapshot = await this.firestore
      .collection('storeroomInventory')
      .ref.where('barcode', '==', result.content)
      .limit(1)
      .get();
      window.document.querySelector('ion-app')?.classList.remove('cameraView');
      document.querySelector('body')?.classList.remove('scanner-active');
    if (!querySnapshot.empty) {
      // If a product with the same barcode is found, populate the input fields
      
      const productData:any = querySnapshot.docs[0].data();
      this.itemName = productData.name;
      this.itemCategory = productData.category;
      this.itemDescription = productData.description;
   
      // You can similarly populate other input fields here
    } else {
      this.presentToast('Product not found');
    }// log the raw scanned content
      window.document.querySelector('ion-app')?.classList.remove('cameraView');
    }
  }

  async uploadImage(file: string) {
    const fileName = Date.now().toString();
    const filePath = `images/${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = fileRef.putString(file, 'base64', {
      contentType: 'image/jpeg',
    });
    const snapshot = await uploadTask;
    return snapshot.ref.getDownloadURL();
  }
  
  async addItem() {
    const loader = await this.loadingController.create({
      message: 'Adding Inventory...',
    });
    await loader.present();

    try {
      if (this.imageBase64) {
        this.imageUrl = await this.uploadImage(this.imageBase64);
      }

      const newItem = {
        name: this.itemName,
        category: this.itemCategory,
        description: this.itemDescription,
        imageUrl: this.imageUrl || '',
        quantity: this.itemQuantity,
        pickersDetails: this.pickersDetails,
        dateOfPickup: this.dateOfPickup,
        timeOfPickup: this.timeOfPickup,
        barcode: this.barcode || '',
        timestamp: new Date(),
      };
      this.cart.push(newItem);
      this.presentToast('Item added to cart');
      await this.firestore.collection('inventory').add(newItem);
      this.clearFields();
    } catch (error) {
      console.error('Error adding inventory:', error);
      // Handle error
    } finally {
      loader.dismiss();
    }
  }

  clearFields() {
    this.itemName = '';
    this.itemCategory = '';
    this.itemDescription = '';
    this.itemQuantity = 0;
    this.pickersDetails = '';
    this.dateOfPickup = '';
    this.timeOfPickup = '';
    this.barcode = '';
    this.imageBase64 = null;
    this.imageUrl = null;
  }


  async presentToast(message: string) {
    const toast = await this.ToastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }


  async generateSlip() {
    if (!this.cart.length) {
      return;
    }
  
    const loader = await this.loadingController.create({
      message: 'Generating Slip...',
    });
    await loader.present();
  
    console.log("data", this.cart);
  
    try {
      // Create a slip document in Firestore
      const slipData = {
        date: new Date(),
        items: this.cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
          pickersDetails: item.pickersDetails,
          dateOfPickup: item.dateOfPickup,
          timeOfPickup: item.timeOfPickup,
          barcode: item.barcode,
        })),
      };
  
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
  
      // Define PDF content
      const docDefinition = {
        content: [
          {
            text: 'BEST BRIGHT', // Adding the company name to the header
            style: 'companyName'
          },
          {
            text: 'Invoice',
            style: 'header'
          },
          {
            text: `Date: ${new Date().toLocaleDateString()}`,
            style: 'subheader'
          },
          // Iterate over each item in the cart and create a simplified slip layout
          ...this.cart.flatMap((item, index) => [
            {
              columns: [
                // Item details
                {
                  width: 'auto',
                  text: [
                    { text: 'Name: ', bold: true },
                    item.name,
                    '\n',
                    { text: 'Category: ', bold: true },
                    item.category,
                    '\n',
                    { text: 'Description: ', bold: true },
                    item.description,
                    '\n',
                    { text: 'Quantity: ', bold: true },
                    item.quantity.toString(),
                    '\n',
                    { text: 'Deliver\'s Details: ', bold: true },
                    item.pickersDetails,
                    '\n',
                    { text: 'Barcode: ', bold: true },
                    item.barcode,
                  ]
                }
              ],
              margin: [0, 10] // Add some margin between each item
            },
            // Add a separator between items, except for the last item
            index < this.cart.length - 1 ? { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595, y2: 5, lineWidth: 1 }] } : null
          ])
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 10],
            alignment: 'center',
            color: '#4caf50' // Green color for the header
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 10],
            alignment: 'center'
          },
          companyName: { // Style for the company name
            fontSize: 28,
            bold: true,
            margin: [0, 0, 0, 20], // Adjust margin to separate company name from header
            alignment: 'center',
            color: '#ff5722' // Deep orange color for the company name
          }
        }
      };
  
      const pdfDoc = await pdfMake.createPdf(docDefinition);
  
      // Generate the PDF as base64 data
      pdfDoc.getBase64(async (data: any) => {
        // Save the PDF file locally on the device
        try {
          // Generate a random file name for the PDF
          const fileName = `bestBrightness/${Date.now().toLocaleString()}_storeroom.pdf`;
  
          // Write the PDF data to the device's data directory
          const result = await Filesystem.writeFile({
            path: fileName,
            data: data,
            directory: Directory.Documents,
            recursive: true
          });
  
          // Define options for opening the PDF file
          const options: FileOpenerOptions = {
            filePath: result.uri, // Explicitly specify the type of result.uri
            contentType: 'application/pdf', // Mime type of the file
            openWithDefault: true, // Open with the default application
          };
  
          // Use FileOpener to open the PDF file
          await FileOpener.open(options);
          loader.dismiss();
          this.cart = [];
        } catch (error) {
          loader.dismiss();
          alert(`${(error as Error).message} ${error}`);
          console.error('Error saving or opening PDF:', error);
        }
      });
  
      alert('Processing the slip...');
    } catch (error) {
      loader.dismiss();
      console.error('Error generating slip:', error);
      // Handle error
    }
  }
}
