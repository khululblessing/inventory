import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, combineLatest, Observable } from 'rxjs';



// Define an interface for the data structure
interface InventoryItem {
  category: string;
  quantity: number;
  name: string;
  barcode: string;
}

interface CategoryComparisonData {
  category: string;
  inventoryQuantity: number;
  storeroomQuantity: number;
}

interface TotalQuantitiesData {
  category: string;
  totalQuantity: number;
}
interface UpdateFrequencyData {
  category: string;
  updateFrequency: number;
  productName: string;
}
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.generateQuantityByCategoryChart();
  
    this.generateUpdateFrequencyChart();
  }

  generateUpdateFrequencyChart() {
    combineLatest([
      this.firestore.collection('inventory').valueChanges(),
      this.firestore.collection('store').valueChanges(),
    ])
      .pipe(
        map(([inventoryData, storeroomData]: [any[], any[]]) => {
          const inventoryItems: InventoryItem[] = inventoryData.map(
            (item: any) => ({
              category: item.category,
              quantity: item.quantity,
              name: item.name,
              barcode: item.barcode,
            })
          );
          const storeroomItems: InventoryItem[] = storeroomData.map(
            (item: any) => ({
              category: item.category,
              quantity: item.quantity,
              name: item.name,
              barcode: item.barcode,
            })
          );
  
          const allItems = [...inventoryItems, ...storeroomItems];
          const barcodes = Array.from(new Set(allItems.map((item) => item.barcode)));
  
          const updateFrequencyData: UpdateFrequencyData[] = barcodes.map((barcode) => {
            const inventoryUpdates = inventoryItems.filter((item) => item.barcode === barcode).length;
            const storeroomUpdates = storeroomItems.filter((item) => item.barcode === barcode).length;
            const totalUpdates = inventoryUpdates + storeroomUpdates;
            const productName = allItems.find((item) => item.barcode === barcode)?.name || barcode;
            return { category: barcode, updateFrequency: totalUpdates, productName };
          });
  
          return updateFrequencyData;
        })
      )
      .subscribe((updateFrequencyData: UpdateFrequencyData[]) => {
        const ctx = document.getElementById('updateFrequencyChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: updateFrequencyData.map((item) => item.productName),
            datasets: [
              {
                label: 'Update Frequency',
                data: updateFrequencyData.map((item) => item.updateFrequency),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              r: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }
  
  
  generateQuantityByCategoryChart() {
    this.firestore
      .collection('inventory')
      .valueChanges()
      .pipe(
        map((data: unknown[]) => {
          return data.map((item: any) => {
            return {
              category: item.category,
              quantity: item.quantity,
              name: item.name,
            } as InventoryItem;
          });
        })
      )
      .subscribe((data: InventoryItem[]) => {
        const categories = data.map((item) => item.name);
        const uniqueCategories = Array.from(new Set(categories));
  
        const ctx = document.getElementById('quantityByCategoryChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: uniqueCategories,
            datasets: [
              {
                label: 'Mean',
                data: uniqueCategories.map((category) => {
                  const categoryItems = data.filter((item) => item.name === category);
                  const quantities = categoryItems.map((item) => item.quantity);
                  return quantities.reduce((acc, curr) => acc + curr, 0) / quantities.length;
                }),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }
  
}
