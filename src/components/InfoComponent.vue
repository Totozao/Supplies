<template>
  <div>
    <v-data-table :headers="phonesAndTabletsHeaders" :items="phonesAndTablets" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Phones and Tablets</v-toolbar-title>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-data-table :headers="accessoriesHeaders" :items="accessories" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Accessories</v-toolbar-title>
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
        { title: 'Brand', value: 'brand' },
        { title: 'Model', value: 'model' },
        { title: 'Memory', value: 'memory' },
        { title: 'RAM', value: 'ram' },
        { title: 'Color', value: 'color' },
        { title: 'Cost', value: 'cost' },
        { title: 'Quantity', value: 'quantity' },
      ],
      phonesAndTablets: [],
      accessoriesHeaders: [
        { title: 'Category', value: 'category' },
        { title: 'Brand', value: 'brand' },
        { title: 'Model', value: 'model' },
        { title: 'Cost', value: 'cost' },
        { title: 'Quantity', value: 'quantity' },
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
  }
</style>