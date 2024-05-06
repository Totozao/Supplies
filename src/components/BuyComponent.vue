<template>
    <div>
      <v-container>
        <v-data-table 
            :headers="buyPhoneTabletHeaders" 
            :items="buyPhoneTabletItems" 
            class="elevation-1"
            v-model:sort-by="sortByPhones">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Buy - Phones and Tablets</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="outlined" @click="openBuyPhoneTabletDialog">Add</v-btn>
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
  
        <v-data-table 
          :headers="buyAccessoryHeaders" 
          :items="buyAccessoryItems" 
          class="elevation-1"
          v-model:sort-by="sortByPhones">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Buy - Accessories</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="outlined" @click="openBuyAccessoryDialog">Add</v-btn>
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
  
        <v-btn @click="saveBuyItems" class="saveButton" rounded="lg">Save</v-btn>
      </v-container>
  
      <v-dialog v-model="buyPhoneTabletDialog" max-width="500px">
        <v-card>
          <v-card-title>
            Add Buy Phone/Tablet
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Brand"
                  v-model="buyPhoneTablet.brand"
                  :items="brandOptions"
                  variant="outlined"
                  required
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Model"
                  v-model="buyPhoneTablet.model"
                  :items="modelOptions"
                  required
                  variant="outlined"
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-text-field v-model="buyPhoneTablet.memory" label="Memory" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-text-field v-model="buyPhoneTablet.ram" label="RAM" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-text-field v-model="buyPhoneTablet.color" label="Color"  variant="outlined"></v-text-field>
            <v-text-field 
              v-model="buyPhoneTablet.cost" 
              label="Cost"
              suffix="RUB"
              variant="outlined"
            ></v-text-field>
            <v-text-field v-model="buyPhoneTablet.imei" label="IMEI/SN" variant="outlined"></v-text-field>
            <v-text-field v-model="buyPhoneTablet.location" label="Location" variant="outlined"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="closeBuyPhoneTabletDialog" variant="outlined">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="saveBuyPhoneTabletItem"  variant="outlined">Save</v-btn>
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
      <v-dialog v-model="editPhoneTabletDialog" max-width="500px">
        <v-card>
          <v-card-title>
            Edit Buy Phone/Tablet
          </v-card-title>
          <v-card-text>
            <!-- Edit form fields for buy phone/tablet -->
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Brand"
                  v-model="editedPhoneTablet.brand"
                  :items="brandOptions"
                  variant="outlined"
                  required
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Model"
                  v-model="editedPhoneTablet.model"
                  :items="modelOptions"
                  required
                  variant="outlined"
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-text-field v-model="editedPhoneTablet.memory" label="Memory" variant="outlined"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-text-field v-model="editedPhoneTablet.ram" label="RAM" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-text-field v-model="editedPhoneTablet.color" label="Color" variant="outlined"></v-text-field>
            <v-text-field 
              v-model="editedPhoneTablet.cost" 
              label="Cost"
              suffix="RUB"
              variant="outlined"
            ></v-text-field>
            <v-text-field v-model="editedPhoneTablet.imei" label="IMEI/SN" variant="outlined"></v-text-field>
            <v-text-field v-model="editedPhoneTablet.location" label="Location" variant="outlined"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="closeEditPhoneTabletDialog" variant="outlined">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="saveEditedPhoneTablet" variant="outlined">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editAccessoryDialog" max-width="500px">
        <v-card>
          <v-card-title>
            Edit Buy Accessory
          </v-card-title>
          <v-card-text>
            <!-- Edit form fields for buy accessory -->
            <v-select v-model="editedAccessory.category" :items="['Cable', 'Adapter', 'Memory Card', 'Headphones']" label="Category"></v-select>
            <v-row>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Brand"
                  v-model="editedAccessory.brand"
                  :items="accessoryBrandOptions"
                  required
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="6">
                <v-combobox
                  label="Model"
                  v-model="editedAccessory.model"
                  :items="accessoryModelOptions"
                  required
                ></v-combobox>
              </v-col>
            </v-row>
            <v-text-field v-model="editedAccessory.cost" label="Cost"></v-text-field>
            <v-text-field v-model="editedAccessory.quantity" label="Quantity"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEditAccessoryDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveEditedAccessory">Save</v-btn>
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
      sortByPhones: [{ key: 'data.brand', order: 'asc' }],
      sortByAccessories: [{ key: 'data.brand', order: 'asc' }],
      buyPhoneTabletDialog: false,
      buyAccessoryDialog: false,
      buyPhoneTablet: {
        brand: '',
        model: '',
        memory: '',
        ram: '',
        color: '',
        cost: '',
        imei: '',
      },
      buyAccessory: {
        category: '',
        brand: '',
        model: '',
        cost: '',
      },
      buyPhoneTabletHeaders: [
        { title: 'Brand', value: 'brand', align: 'center'  },
        { title: 'Model', value: 'model', align: 'center'  },
        { title: 'Memory', value: 'memory', align: 'center'  },
        { title: 'RAM', value: 'ram', align: 'center'  },
        { title: 'Color', value: 'color', align: 'center'  },
        { title: 'Cost', value: 'cost', align: 'center'  },
        { title: 'Location', value: 'location', align: 'center' },
        { title: 'Total', value: 'total', align: 'center' },
        { title: 'IMEI/SN', value: 'imei', align: 'center' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      buyPhoneTabletItems: [],
      buyAccessoryHeaders: [
        { title: 'Category', value: 'category', align: 'center'  },
        { title: 'Brand', value: 'brand',align: 'center'  },
        { title: 'Model', value: 'model', align: 'center'  },
        { title: 'Cost', value: 'cost', align: 'center'  },
        { title: 'Quantity', value: 'quantity', align: 'center'  },
        { title: 'Total', value: 'total', align: 'center'  },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      buyAccessoryItems: [],
      accessoryBrandOptions: [],
      accessoryModelOptions: [],
      brandOptions: [],
      modelOptions: [],
      editPhoneTabletDialog: false,
      editAccessoryDialog: false,
      editedPhoneTablet: {
        brand: '',
        model: '',
        memory: '',
        ram: '',
        color: '',
        cost: '',
        imei: '',
      },
      editedAccessory: {
        category: '',
        brand: '',
        model: '',
        cost: '',
      },
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
      const historyCollection = collection(db, 'History');

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
            await addDoc(phonesAndTabletsCollection, item);
          } else {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, {
              quantity: increment(item.quantity),
            });
          }

          await addDoc(historyCollection, {
              type: 'Buy',
              categoryOfGoods: 'Phone/Tablet',
              ...item,
              date: new Date(),
            });
        }

        for (const item of this.buyAccessoryItems) {
          await addDoc(accessoriesCollection, item);

          await addDoc(historyCollection, {
            type: 'Buy',
            categoryOfGoods: 'Accessory',
            ...item,
            date: new Date(),
          });
        }

        this.buyPhoneTabletItems = [];
        this.buyAccessoryItems = [];

        console.log('Buy items saved successfully');
      } catch (error) {
        console.error('Error saving buy items:', error);
      }
    },
    editBuyPhoneTabletItem(item) {
      this.editedPhoneTablet = { ...item };
      this.editPhoneTabletDialog = true;
    },
    closeEditPhoneTabletDialog() {
      this.editPhoneTabletDialog = false;
      this.resetEditedPhoneTablet();
    },
    saveEditedPhoneTablet() {
      const index = this.buyPhoneTabletItems.findIndex(
        (item) => item.imei === this.editedPhoneTablet.imei
      );
      if (index !== -1) {
        this.buyPhoneTabletItems.splice(index, 1, this.editedPhoneTablet);
      }
      this.closeEditPhoneTabletDialog();
    },
    resetEditedPhoneTablet() {
      this.editedPhoneTablet = {
        brand: '',
        model: '',
        memory: '',
        ram: '',
        color: '',
        cost: '',
        imei: '',
      };
    },
    removeBuyPhoneTabletItem(item) {
      const index = this.buyPhoneTabletItems.indexOf(item);
      if (index !== -1) {
        this.buyPhoneTabletItems.splice(index, 1);
      }
    },
    editBuyAccessoryItem(item) {
      this.editedAccessory = { ...item };
      this.editAccessoryDialog = true;
    },
    closeEditAccessoryDialog() {
      this.editAccessoryDialog = false;
      this.resetEditedAccessory();
    },
    saveEditedAccessory() {
      const index = this.buyAccessoryItems.findIndex(
        (item) =>
          item.category === this.editedAccessory.category &&
          item.brand === this.editedAccessory.brand &&
          item.model === this.editedAccessory.model &&
          item.cost === this.editedAccessory.cost
      );
      if (index !== -1) {
        this.buyAccessoryItems.splice(index, 1, this.editedAccessory);
      }
      this.closeEditAccessoryDialog();
    },
    resetEditedAccessory() {
      this.editedAccessory = {
        category: '',
        brand: '',
        model: '',
        cost: '',
      };
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

.v-card {
    background-color:  #D3D3D3;
    border-radius: 1%;
  }

.saveButton {
  margin-top: 1%
}

.v-card {
    background-color:  #D3D3D3;
    border-radius: 1%;
  }
</style>