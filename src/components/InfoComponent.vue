<template>
  <div>
    <v-data-table :headers="phonesAndTabletsHeaders" :items="phonesAndTablets" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Info - Phones and Tablets</v-toolbar-title>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-data-table :headers="accessoriesHeaders" :items="accessories" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Info - Accessories</v-toolbar-title>
        </v-toolbar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  name: 'InfoComponent',
  data() {
    return {
      phonesAndTabletsHeaders: [
        { title: 'Brand', value: 'brand', align: 'center' },
        { title: 'Model', value: 'model', align: 'center' },
        { title: 'Memory', value: 'memory', align: 'center' },
        { title: 'RAM', value: 'ram', align: 'center' },
        { title: 'Color', value: 'color', align: 'center' },
        { title: 'Cost', value: 'cost', align: 'center' },
        { title: 'Quantity', value: 'quantity', align: 'center' },
        { title: 'IMEI/SN', value: 'imei', align: 'center' },
      ],
      phonesAndTablets: [],
      accessoriesHeaders: [
        { title: 'Category', value: 'category', align: 'center' },
        { title: 'Brand', value: 'brand', align: 'center' },
        { title: 'Model', value: 'model', align: 'center' },
        { title: 'Cost', value: 'cost', align: 'center' },
        { title: 'Quantity', value: 'quantity', align: 'center' },
      ],
      accessories: [],
    };
  },
  created() {
    this.fetchPhonesAndTablets();
    this.fetchAccessories();
  },
  methods: {
    async fetchPhonesAndTablets() {
      const db = getFirestore();
      const phonesAndTabletsCollection = collection(db, 'PhonesAndTablets');
      const querySnapshot = await getDocs(phonesAndTabletsCollection);
      this.phonesAndTablets = querySnapshot.docs.map(doc => doc.data());
    },
    async fetchAccessories() {
      const db = getFirestore();
      const accessoriesCollection = collection(db, 'Accessories');
      const querySnapshot = await getDocs(accessoriesCollection);
      this.accessories = querySnapshot.docs.map(doc => doc.data());
    },
  },
};
</script>

<style scoped>
  .v-data-table {
    margin-top: 1%;
    margin-left: 0.7%;
  }
  
</style>