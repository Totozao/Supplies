<template>
  <div>
    <div v-if="showTable">
      <h3>Repairs</h3>
      <div class="search-container">
        <v-btn icon @click="toggleSearchForm">
          <v-icon>{{ showSearchForm ? 'mdi-close' : 'mdi-magnify' }}</v-icon>
        </v-btn>
        <div v-if="showSearchForm" class="search-bar">
          <input type="text" v-model="searchTerm" placeholder="Search repairs..." class="search-input" />
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="filteredRepairs"
        class="elevation-1"
        v-model:sort-by="sortBy"
      >
        <template v-slot:[`item.date`]="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn @click="editRepair(item)">Edit</v-btn>
        </template>
        <template v-slot:[`item.customerType`]="{ item }">
          {{ item.data.customerType }}
        </template>
        <template v-slot:[`item.wholesaleCustomerName`]="{ item }">
          {{ item.data.wholesaleCustomerName || '-' }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          {{ item.data.status }}
        </template>
      </v-data-table>
      <v-btn @click="showAddForm = true">Add Repair</v-btn>
    </div>

    <v-dialog v-model="showEditForm" max-width="500px">
      <EditRepairForm
        :repair="selectedRepair"
        :repairs="repairs"
        @update-repair="handleUpdateRepair"
        @close="closeEditForm"
      />
    </v-dialog>

    <v-dialog v-model="showAddForm" max-width="500px">
      <AddRepairForm
        :repairs="repairs"
        @add-repair="handleAddRepair"
        @close="closeAddForm"
      />
    </v-dialog>
  </div>
</template>

<script>
import { getFirestore, doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { format } from "date-fns";
import EditRepairForm from './EditRepairForm.vue';
import AddRepairForm from './AddRepairForm.vue';

export default {
  name: 'RepairsTable',
  components: {
    EditRepairForm,
    AddRepairForm
  },
  props: {
    repairs: {
      type: Array,
      required: true
    },
    showTable: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      sortBy: [{ key: 'data.brand', order: 'asc' }],
      headers: [
        { title: 'Brand', key: 'data.brand' },
        { title: 'Model', key: 'data.model' },
        { title: 'Issue', key: 'data.issue' },
        { title: 'IMEI', key: 'data.imei' },
        { title: 'Date', key: 'data.date' },
        { title: 'Full Price', key: 'data.fullPrice' },
        { title: 'Cost Price', key: 'data.costPrice' },
        { title: 'Profit', key: 'data.profit' },
        { title: 'Customer Type', key: 'data.customerType' },
        { title: 'Wholesale Customer', key: 'data.wholesaleCustomerName' },
        { title: 'Status', key: 'data.status' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      searchTerm: '',
      showSearchForm: false,
      showEditForm: false,
      selectedRepair: null,
      showAddForm: false
    }
  },
  computed: {
    filteredRepairs() {
      return this.repairs.filter(repair =>
        Object.values(repair.data).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }
  },
  methods: {
    editRepair(repair) {
      this.selectedRepair = repair;
      this.showEditForm = true;
    },
    async handleUpdateRepair(updatedRepair) {
      const db = getFirestore();
      const repairRef = doc(db, 'Repairs', updatedRepair.id);
      await updateDoc(repairRef, updatedRepair);
      this.selectedRepair = null;
      this.showEditForm = false;
    },
    closeEditForm() {
      this.showEditForm = false;
      this.selectedRepair = null;
    },
    async handleAddRepair(newRepair) {
      const db = getFirestore();
      const repairsCollection = collection(db, 'Repairs');
      await addDoc(repairsCollection, newRepair);
      this.showAddForm = false;
    },
    closeAddForm() {
      this.showAddForm = false;
    },
    toggleSearchForm() {
      this.showSearchForm = !this.showSearchForm;
    },
    formatDate(date) {
      const formattedDate = format(date, 'dd.MM.yyyy');
      return formattedDate;
    }
  }
}
</script>

<style scoped>
v-btn {
  padding: 100px
}
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

.search-container {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.search-bar {
  margin-left: 10px;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.search-input:focus {
  border-color: #888;
}
</style>