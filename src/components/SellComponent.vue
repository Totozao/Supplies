<template>
    <div>
      <v-container>
        <v-data-table :headers="sellPhoneTabletHeaders" :items="sellPhoneTabletItems" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Sell - Phones and Tablets</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openSellPhoneTabletDialog">Add</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
  
        <v-data-table :headers="sellAccessoryHeaders" :items="sellAccessoryItems" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Sell - Accessories</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openSellAccessoryDialog">Add</v-btn>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-container>
  
      <v-dialog v-model="sellPhoneTabletDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add Sell Phone/Tablet</span>
          </v-card-title>
          <v-card-text>
            <v-select v-model="sellPhoneTablet.brand" :items="brandOptions" label="Brand"></v-select>
            <v-select v-model="sellPhoneTablet.model" :items="modelOptions" label="Model"></v-select>
            <v-text-field v-model="sellPhoneTablet.memory" label="Memory"></v-text-field>
            <v-text-field v-model="sellPhoneTablet.ram" label="RAM"></v-text-field>
            <v-text-field v-model="sellPhoneTablet.color" label="Color"></v-text-field>
            <v-text-field v-model="sellPhoneTablet.cost" label="Cost"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeSellPhoneTabletDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveSellPhoneTabletItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <v-dialog v-model="sellAccessoryDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add Sell Accessory</span>
          </v-card-title>
          <v-card-text>
            <v-select v-model="sellAccessory.category" :items="['Cable', 'Adapter', 'Memory Card', 'Headphones']" label="Category"></v-select>
            <v-text-field v-model="sellAccessory.brand" label="Brand"></v-text-field>
            <v-text-field v-model="sellAccessory.model" label="Model"></v-text-field>
            <v-text-field v-model="sellAccessory.cost" label="Cost"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeSellAccessoryDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveSellAccessoryItem">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SellComponent',
    data() {
      return {
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
          { text: 'Brand', value: 'brand' },
          { text: 'Model', value: 'model' },
          { text: 'Memory', value: 'memory' },
          { text: 'RAM', value: 'ram' },
          { text: 'Color', value: 'color' },
          { text: 'Cost', value: 'cost' },
        ],
        sellPhoneTabletItems: [],
        sellAccessoryHeaders: [
          { title: 'Category', value: 'category' },
          { title: 'Brand', value: 'brand' },
          { title: 'Model', value: 'model' },
          { title: 'Cost', value: 'cost' },
        ],
        sellAccessoryItems: [],
      };
    },
    computed: {
      brandOptions() {
        return [...new Set(this.sellPhoneTabletItems.map(item => item.brand))];
      },
      modelOptions() {
        return [...new Set(this.sellPhoneTabletItems.map(item => item.model))];
      },
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
    },
  };
  </script>