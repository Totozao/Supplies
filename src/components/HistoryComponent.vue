<template>
  <div>
    <v-data-table :headers="historyHeaders" :items="historyRecords" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>History</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:[`item.date`]="{ item }">
        {{ formatDate(item.date) }}
      </template>
      <template v-slot:[`item.quantity`]="{ item }">
        {{ item.quantity || '1' }}
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  name: 'HistoryComponent',
  data() {
    return {
      historyHeaders: [
        { title: 'Type', value: 'type', align: 'center' },
        { title: 'Category of Goods', value: 'categoryOfGoods', align: 'center' },
        { title: 'Brand', value: 'brand', align: 'center' },
        { title: 'Model', value: 'model', align: 'center' },
        { title: 'IMEI/SN', value: 'imei', align: 'center' },
        { title: 'Cost', value: 'cost', align: 'center' },
        { title: 'Quantity', value: 'quantity', align: 'center' },
        { title: 'Date', value: 'date', align: 'center' },
      ],
      historyRecords: [],
    };
  },
  created() {
    this.fetchHistoryRecords();
  },
  methods: {
    async fetchHistoryRecords() {
      const db = getFirestore();
      const historyCollection = collection(db, 'History');
      const querySnapshot = await getDocs(historyCollection);
      this.historyRecords = querySnapshot.docs.map(doc => doc.data());
    },
    formatDate(timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleString();
    },
  },
};
</script>