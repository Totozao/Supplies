<template>
    <div>
      <v-container>
        <v-data-table :headers="buyPhoneTabletHeaders" :items="buyPhoneTabletItems" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Buy - Phones and Tablets</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openBuyPhoneTabletDialog">Add</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small color="primary" @click="editBuyPhoneTabletItem(item)">Edit</v-btn>
            <v-btn small color="error" @click="removeBuyPhoneTabletItem(item)">Remove</v-btn>
          </template>
          <template v-slot:[`item.total`]="{ item }">
            {{ item.cost * item.quantity }}
          </template>
        </v-data-table>
  
        <v-data-table :headers="buyAccessoryHeaders" :items="buyAccessoryItems" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Buy - Accessories</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openBuyAccessoryDialog">Add</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small color="primary" @click="editBuyAccessoryItem(item)">Edit</v-btn>
            <v-btn small color="error" @click="removeBuyAccessoryItem(item)">Remove</v-btn>
          </template>
          <template v-slot:[`item.total`]="{ item }">
            {{ item.cost * item.quantity }}
          </template>
        </v-data-table>
  
        <v-btn color="primary" @click="saveBuyItems">Save</v-btn>
      </v-container>
  
      <v-dialog v-model="buyPhoneTabletDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add Buy Phone/Tablet</span>
          </v-card-title>
          <v-card-text>
            <v-combobox
              v-model="buyPhoneTablet.brand"
              :items="brandOptions"
              label="Brand"
              clearable
            ></v-combobox>
            <v-combobox
              v-model="buyPhoneTablet.model"
              :items="modelOptions"
              label="Model"
              clearable
            ></v-combobox>
            <v-text-field v-model="buyPhoneTablet.memory" label="Memory"></v-text-field>
            <v-text-field v-model="buyPhoneTablet.ram" label="RAM"></v-text-field>
            <v-text-field v-model="buyPhoneTablet.color" label="Color"></v-text-field>
            <v-text-field v-model="buyPhoneTablet.cost" label="Cost"></v-text-field>
            <v-text-field v-model="buyPhoneTablet.quantity" label="Quantity"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeBuyPhoneTabletDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveBuyPhoneTabletItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="buyAccessoryDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add Buy Accessory</span>
          </v-card-title>
          <v-card-text>
            <v-select v-model="buyAccessory.category" :items="['Cable', 'Adapter', 'Memory Card', 'Headphones']" label="Category"></v-select>
            <v-text-field v-model="buyAccessory.brand" label="Brand"></v-text-field>
            <v-text-field v-model="buyAccessory.model" label="Model"></v-text-field>
            <v-text-field v-model="buyAccessory.cost" label="Cost"></v-text-field>
            <v-text-field v-model="buyAccessory.quantity" label="Quantity"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeBuyAccessoryDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveBuyAccessoryItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, increment } from 'firebase/firestore';

export default {
  name: 'BuyComponent',
  data() {
    return {
      buyPhoneTabletDialog: false,
      buyAccessoryDialog: false,
      buyPhoneTablet: {
        brand: '',
        model: '',
        memory: '',
        ram: '',
        color: '',
        cost: '',
        quantity: '',
      },
      buyAccessory: {
        category: '',
        brand: '',
        model: '',
        cost: '',
        quantity: '',
      },
      buyPhoneTabletHeaders: [
        { title: 'Brand', value: 'brand' },
        { title: 'Model', value: 'model' },
        { title: 'Memory', value: 'memory' },
        { title: 'RAM', value: 'ram' },
        { title: 'Color', value: 'color' },
        { title: 'Cost', value: 'cost' },
        { title: 'Quantity', value: 'quantity' },
        { title: 'Total', value: 'total' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      buyPhoneTabletItems: [],
      buyAccessoryHeaders: [
        { title: 'Category', value: 'category' },
        { title: 'Brand', value: 'brand' },
        { title: 'Model', value: 'model' },
        { title: 'Cost', value: 'cost' },
        { title: 'Quantity', value: 'quantity' },
        { title: 'Total', value: 'total' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      buyAccessoryItems: [],
    };
  },
  computed: {
    brandOptions() {
      return [...new Set(this.buyPhoneTabletItems.map(item => item.brand))];
    },
    modelOptions() {
      return [...new Set(this.buyPhoneTabletItems.map(item => item.model))];
    },
  },
  methods: {
    openBuyPhoneTabletDialog() {
      this.buyPhoneTabletDialog = true;
    },
    closeBuyPhoneTabletDialog() {
      this.buyPhoneTabletDialog = false;
      this.resetBuyPhoneTabletForm();
    },
    openBuyAccessoryDialog() {
      this.buyAccessoryDialog = true;
    },
    closeBuyAccessoryDialog() {
      this.buyAccessoryDialog = false;
      this.resetBuyAccessoryForm();
    },
    async saveBuyItems() {
      const db = getFirestore();
      const phonesAndTabletsCollection = collection(db, 'PhonesAndTablets');
      const accessoriesCollection = collection(db, 'Accessories');

      try {
        for (const item of this.buyPhoneTabletItems) {
          const { brand, model, memory, ram, cost } = item;
          const q = query(
            phonesAndTabletsCollection,
            where('brand', '==', brand),
            where('model', '==', model),
            where('memory', '==', memory),
            where('ram', '==', ram),
            where('cost', '==', cost)
          );
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // If no matching record found, add a new record
            await addDoc(phonesAndTabletsCollection, item);
          } else {
            // If a matching record found, update the quantity
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
              quantity: increment(item.quantity),
            });
          }
        }

        // Save buy accessory items to Firestore
        for (const item of this.buyAccessoryItems) {
          await addDoc(accessoriesCollection, item);
        }

        // Clear buy tables
        this.buyPhoneTabletItems = [];
        this.buyAccessoryItems = [];

        console.log('Buy items saved successfully');
      } catch (error) {
        console.error('Error saving buy items:', error);
      }
    },
    editBuyPhoneTabletItem(item) {
      // Logic to edit the selected buy phone/tablet item
      console.log('Editing buy phone/tablet item:', item);
    },
    removeBuyPhoneTabletItem(item) {
      // Logic to remove the selected buy phone/tablet item
      const index = this.buyPhoneTabletItems.indexOf(item);
      if (index !== -1) {
        this.buyPhoneTabletItems.splice(index, 1);
      }
    },
    editBuyAccessoryItem(item) {
      // Logic to edit the selected buy accessory item
      console.log('Editing buy accessory item:', item);
    },
    removeBuyAccessoryItem(item) {
      // Logic to remove the selected buy accessory item
      const index = this.buyAccessoryItems.indexOf(item);
      if (index !== -1) {
        this.buyAccessoryItems.splice(index, 1);
      }
    },
    saveBuyPhoneTabletItem() {
      this.buyPhoneTabletItems.push({ ...this.buyPhoneTablet });
      this.closeBuyPhoneTabletDialog();
    },
    saveBuyAccessoryItem() {
      this.buyAccessoryItems.push({ ...this.buyAccessory });
      this.closeBuyAccessoryDialog();
    },
    resetBuyPhoneTabletForm() {
      this.buyPhoneTablet = {
        brand: '',
        model: '',
        memory: '',
        ram: '',
        color: '',
        cost: '',
        quantity: '',
      };
    },
    resetBuyAccessoryForm() {
      this.buyAccessory = {
        category: '',
        brand: '',
        model: '',
        cost: '',
        quantity: '',
      };
    },
  },
};
</script>