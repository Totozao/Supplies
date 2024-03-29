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
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Brand"
                  v-model="buyPhoneTablet.brand"
                  :items="brandOptions"
                  required
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Model"
                  v-model="buyPhoneTablet.model"
                  :items="modelOptions"
                  required
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-text-field v-model="buyPhoneTablet.memory" label="Memory"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-text-field v-model="buyPhoneTablet.ram" label="RAM"></v-text-field>
              </v-col>
            </v-row>
            <v-text-field v-model="buyPhoneTablet.color" label="Color"></v-text-field>
            <v-text-field 
              v-model="buyPhoneTablet.cost" 
              label="Cost"
              suffix="RUB"
            ></v-text-field>
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
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Brand"
                  v-model="buyAccessory.brand"
                  :items="accessoryBrandOptions"
                  required
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Model"
                  v-model="buyAccessory.model"
                  :items="accessoryModelOptions"
                  required
                ></v-combobox>
              </v-col>
            </v-row>
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
        quantity: '1',
      },
      buyAccessory: {
        category: '',
        brand: '',
        model: '',
        cost: '',
        quantity: '1',
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
      accessoryBrandOptions: [],
      accessoryModelOptions: [],
      brandOptions: [],
      modelOptions: [],
    };
  },
  created() {
    this.fetchBrandAndModelOptions();
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
    async fetchBrandAndModelOptions() {
      const db = getFirestore();
      const phonesAndTabletsCollection = collection(db, 'PhonesAndTablets');
      const accessoriesCollection = collection(db, 'Accessories');

      try {
        const brandOptions = new Set();
        const modelOptions = new Set();
        const accessoryBrandOptions = new Set();
        const accessoryModelOptions = new Set();

        const phonesAndTabletsQuerySnapshot = await getDocs(phonesAndTabletsCollection);
        phonesAndTabletsQuerySnapshot.forEach((doc) => {
          const data = doc.data();
          brandOptions.add(data.brand);
          modelOptions.add(data.model);
        });

        const accessoriesQuerySnapshot = await getDocs(accessoriesCollection);
        accessoriesQuerySnapshot.forEach((doc) => {
          const data = doc.data();
          accessoryBrandOptions.add(data.brand);
          accessoryModelOptions.add(data.model);
        });

        this.brandOptions = Array.from(brandOptions);
        this.modelOptions = Array.from(modelOptions);
        this.accessoryBrandOptions = Array.from(accessoryBrandOptions);
        this.accessoryModelOptions = Array.from(accessoryModelOptions);
      } catch (error) {
        console.error('Error fetching brand and model options:', error);
      }
    },
    filterModelOptions(brand) {
      const db = getFirestore();
      const phonesAndTabletsCollection = collection(db, 'PhonesAndTablets');
      const modelOptions = new Set();

      const q = query(phonesAndTabletsCollection, where('brand', '==', brand));
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            modelOptions.add(data.model);
          });
          this.modelOptions = Array.from(modelOptions);
        })
        .catch((error) => {
          console.error('Error filtering model options:', error);
        });
    },
    filterAccessoryModelOptions(brand) {
      const db = getFirestore();
      const accessoriesCollection = collection(db, 'Accessories');
      const accessoryModelOptions = new Set();

      const q = query(accessoriesCollection, where('brand', '==', brand));
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            accessoryModelOptions.add(data.model);
          });
          this.accessoryModelOptions = Array.from(accessoryModelOptions);
        })
        .catch((error) => {
          console.error('Error filtering accessory model options:', error);
        });
    },
  },
  watch: {
    'buyPhoneTablet.brand'(newBrand) {
      this.filterModelOptions(newBrand);
    },
    'buyAccessory.brand'(newBrand) {
      this.filterAccessoryModelOptions(newBrand);
    },
  },
};
</script>

<style>
.v-data-table {
  margin-top: 1%;
}
</style>