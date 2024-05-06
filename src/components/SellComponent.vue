<template>
  <div>
    <v-container>
      <v-data-table :headers="sellPhoneTabletHeaders" :items="sellPhoneTabletItems" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Sell - Phones and Tablets</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openSellPhoneTabletDialog" rounded="lg">Add</v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="error" @click="removePhoneTabletItem(item)">
            <v-icon> {{"mdi-close"}} </v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <v-data-table :headers="sellAccessoryHeaders" :items="sellAccessoryItems" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Sell - Accessories</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn  color = "primary" @click="openSellAccessoryDialog" rounded="lg" variant="outlined">Add</v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.quantity`]="{ item }">
          <v-text-field v-model.number="item.quantity" type="number" min="1"></v-text-field>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="error" @click="removeAccessoryItem(item)">
            <v-icon> {{"mdi-close"}} </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-container>

    <v-btn @click="saveSellItems" rounded="lg">Save</v-btn>

    <v-dialog v-model="sellPhoneTabletDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Sell Phone/Tablet</span>
        </v-card-title>
        <v-card-text>
          <v-select v-if="brandOptions.length" v-model="selectedBrand" :items="brandOptions" label="Brand"></v-select>
          <v-select v-if="modelOptions.length" v-model="selectedModel" :items="modelOptions" label="Model"></v-select>
          <v-data-table
            v-if="filteredPhoneTablets.length"
            :headers="sellPhoneTabletHeaders"
            :items="filteredPhoneTablets"
            class="elevation-1"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn color="primary" @click="addToSellPhoneTablets(item)">Add</v-btn>
            </template>
          </v-data-table>
          <v-alert v-else type="info">No matching records found.</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeSellPhoneTabletDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="sellAccessoryDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Sell Accessory</span>
        </v-card-title>
        <v-card-text>
          <v-select v-if="accessoryBrandOptions.length" v-model="selectedAccessoryBrand" :items="accessoryBrandOptions" label="Brand"></v-select>
          <v-select v-if="accessoryModelOptions.length" v-model="selectedAccessoryModel" :items="accessoryModelOptions" label="Model"></v-select>
          <v-data-table
            v-if="filteredAccessories.length"
            :headers="sellAccessoryHeaders"
            :items="filteredAccessories"
            class="elevation-1"
            v-model:sort-by="sortBy"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn @click="addToSellAccessories(item)">Add</v-btn>
            </template>
          </v-data-table>
          <v-alert v-else type="info">No matching records found.</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeSellAccessoryDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

export default {
  name: 'SellComponent',
  data() {
    return {
      sortBy: [{ key: 'data.brand', order: 'asc' }],
      sellPhoneTabletDialog: false,
      sellAccessoryDialog: false,
      sellPhoneTablet: {
        brand: '',
        model: '',
        memory: '',
        ram: '',
        color: '',
        cost: '',
      },
      sellAccessory: {
        category: '',
        brand: '',
        model: '',
        cost: '',
      },
      sellPhoneTabletHeaders: [
        { title: 'Brand', value: 'brand', align: 'center' },
        { title: 'Model', value: 'model', align: 'center' },
        { title: 'Memory', value: 'memory',align: 'center' },
        { title: 'RAM', value: 'ram', align: 'center' },
        { title: 'Color', value: 'color', align: 'center' },
        { title: 'Cost', value: 'cost', align: 'center' },
        { title: 'IMEI/SN', value: 'imei', align: 'center' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      sellPhoneTabletItems: [],
      sellAccessoryItems: [],
      phoneTablets: [],
      accessories: [],
      selectedBrand: '',
      selectedModel: '',
      selectedAccessoryBrand: '',
      selectedAccessoryModel: '',
      sellAccessoryHeaders: [
        { title: 'Category', value: 'category', align: 'center' },
        { title: 'Brand', value: 'brand', align: 'center' },
        { title: 'Model', value: 'model', align: 'center' },
        { title: 'Cost', value: 'cost', align: 'center' },
        { title: 'Quantity', value: 'quantity', align: 'center'},
        { title: 'Location', value: 'location', align: 'center' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  computed: {
    brandOptions() {
      return this.phoneTablets ? [...new Set(this.phoneTablets.map(item => item.brand))] : [];
    },
    modelOptions() {
      return this.phoneTablets ? [...new Set(this.phoneTablets.filter(item => item.brand === this.selectedBrand).map(item => item.model))] : [];
    },
    filteredPhoneTablets() {
      return this.phoneTablets ? this.phoneTablets.filter(item => item.brand === this.selectedBrand && item.model === this.selectedModel) : [];
    },
    accessoryBrandOptions() {
      return [...new Set(this.accessories.map(item => item.brand))];
    },
    accessoryModelOptions() {
      return [...new Set(this.accessories.filter(item => item.brand === this.selectedAccessoryBrand).map(item => item.model))];
    },
    filteredAccessories() {
      return this.accessories.filter(item => item.brand === this.selectedAccessoryBrand && item.model === this.selectedAccessoryModel);
    },
  },
  created() {
    this.fetchPhoneTablets();
    this.fetchAccessories();
  },
  methods: {
    openSellPhoneTabletDialog() {
      this.sellPhoneTabletDialog = true;
    },
    closeSellPhoneTabletDialog() {
      this.sellPhoneTabletDialog = false;
      this.resetSellPhoneTabletForm();
    },
    openSellAccessoryDialog() {
      this.sellAccessoryDialog = true;
    },
    closeSellAccessoryDialog() {
      this.sellAccessoryDialog = false;
      this.resetSellAccessoryForm();
    },
    saveSellPhoneTabletItem() {
      this.sellPhoneTabletItems.push({ ...this.sellPhoneTablet });
      this.closeSellPhoneTabletDialog();
    },
    saveSellAccessoryItem() {
      this.sellAccessoryItems.push({ ...this.sellAccessory });
      this.closeSellAccessoryDialog();
    },
    resetSellPhoneTabletForm() {
      this.sellPhoneTablet = {
        brand: '',
        model: '',
        memory: '',
        ram: '',
        imei: '',
        date: '',
        cost: '',
      };
    },
    resetSellAccessoryForm() {
      this.sellAccessory = {
        category: '',
        brand: '',
        model: '',
        cost: '',
      };
    },
    async fetchPhoneTablets() {
      const db = getFirestore();
      const phonesAndTabletsCollection = collection(db, 'PhonesAndTablets');
      const querySnapshot = await getDocs(phonesAndTabletsCollection);
      this.phoneTablets = querySnapshot.docs.map(doc => doc.data());
    },
    async fetchAccessories() {
      const db = getFirestore();
      const accessoriesCollection = collection(db, 'Accessories');
      const querySnapshot = await getDocs(accessoriesCollection);
      this.accessories = querySnapshot.docs.map(doc => doc.data());
    },
    addToSellPhoneTablets(item) {
      const existingItem = this.sellPhoneTabletItems.find(
        i => i.brand === item.brand && i.model === item.model && i.memory === item.memory && i.ram === item.ram && i.color === item.color
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.sellPhoneTabletItems.push({ ...item, quantity: 1 });
      }
    },
    addToSellAccessories(item) {
      const existingItem = this.sellAccessoryItems.find(
        i => i.category === item.category && i.brand === item.brand && i.model === item.model && i.cost === item.cost
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.sellAccessoryItems.push({ ...item, quantity: 1 });
      }
    },
    async saveSellItems() {
      const db = getFirestore();
      const phonesAndTabletsCollection = collection(db, 'PhonesAndTablets');
      const accessoriesCollection = collection(db, 'Accessories');
      const historyCollection = collection(db, 'History');

      try {
        for (const item of this.sellPhoneTabletItems) {
          const { brand, model, memory, ram, color, quantity } = item;
          const querySnapshot = await getDocs(
            query(
              phonesAndTabletsCollection,
              where('brand', '==', brand),
              where('model', '==', model),
              where('memory', '==', memory),
              where('ram', '==', ram),
              where('color', '==', color)
            )
          );

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const currentQuantity = doc.data().quantity;

            if (currentQuantity >= quantity) {
              await updateDoc(doc.ref, {
                quantity: currentQuantity - quantity,
              });

              await addDoc(historyCollection, {
                type: 'Sell',
                categoryOfGoods: 'Phone/Tablet',
                ...item,
                date: new Date(),
              });
            } else {
              console.error(`Insufficient quantity for item: ${doc.id}`);
            }
          }
        }

        for (const item of this.sellAccessoryItems) {
          const { category, brand, model, cost, quantity } = item;
          const querySnapshot = await getDocs(
            query(
              accessoriesCollection,
              where('category', '==', category),
              where('brand', '==', brand),
              where('model', '==', model),
              where('cost', '==', cost)
            )
          );

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const currentQuantity = doc.data().quantity;

            if (currentQuantity >= quantity) {
              await updateDoc(doc.ref, {
                quantity: currentQuantity - quantity,
              });

              await addDoc(historyCollection, {
                type: 'Sell',
                categoryOfGoods: 'Accessory',
                ...item,
                date: new Date(),
              });
            } else {
              console.error(`Insufficient quantity for item: ${doc.id}`);
            }
          }
        }

        console.log('Sell items saved successfully');
      } catch (error) {
        console.error('Error saving sell items:', error);
      }
    },
    removePhoneTabletItem(item) {
        const index = this.sellPhoneTabletItems.indexOf(item);
        if (index !== -1) {
          this.sellPhoneTabletItems.splice(index, 1);
        }
      },
      removeAccessoryItem(item) {
        const index = this.sellAccessoryItems.indexOf(item);
        if (index !== -1) {
          this.sellAccessoryItems.splice(index, 1);
        }
      },
  },
};
</script>

<style scoped>
.v-btn {
  margin-left: 1%
}
</style> 