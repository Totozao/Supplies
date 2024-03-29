<template>
  <div>
    <div v-if="showTable">
      <h3>Repairs</h3>
      <div class="search-container">
        <div class="search-bar">
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
          <v-btn @click="deleteRepair(item)">Delete</v-btn>
        </template>
        <template v-slot:[`item.customerType`]="{ item }">
          {{ item.data.customerType }}
        </template>
        <template v-slot:[`item.wholesaleCustomerName`]="{ item }">
          {{ item.data.wholesaleCustomerName || '-' }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <span :class="getStatusClass(item.data.status)">
            {{ item.data.status || '-' }}
          </span>
        </template>
      </v-data-table>
      <v-btn @click="showAddForm = true" class="AddRepair" rounded="lg">Add Repair</v-btn>
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
import { getFirestore, doc, updateDoc, collection, addDoc, deleteDoc } from 'firebase/firestore';
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
        { title: 'Brand', key: 'data.brand', align: 'center' },
        { title: 'Model', key: 'data.model', align: 'center' },
        { title: 'Issue', key: 'data.issue', align: 'center' },
        { title: 'IMEI', key: 'data.imei', align: 'center' },
        { title: 'Date', key: 'data.date', align: 'center' },
        { title: 'Full Price', key: 'data.fullPrice', align: 'center' },
        { title: 'Cost Price', key: 'data.costPrice', align: 'center' },
        { title: 'Profit', key: 'data.profit', align: 'center' },
        { title: 'Customer Type', key: 'data.customerType', align: 'center' },
        { title: 'Wholesale Customer', key: 'data.wholesaleCustomerName', align: 'center' },
        { title: 'Status', key: 'data.status', align: 'center' },
        { title: 'Date Of Finish', key: 'data.dateOfFinish', align: 'center'},
        { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
      ],
      searchTerm: '',
      showSearchForm: false,
      showEditForm: false,
      selectedRepair: null,
      showAddForm: false,
      align: 'center',
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
    async deleteRepair(repair) {
      const db = getFirestore();
      const repairRef = doc(db, 'Repairs', repair.id);
      await deleteDoc(repairRef);
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
    formatDate(date) {
      const formattedDate = format(date, 'dd.MM.yyyy');
      return formattedDate;
    },
    getStatusClass(status) {
      if (status === 'In Progress') {
        return 'status-in-progress';
      } else if (status === 'Done') {
        return 'status-done';
      } else if (status === 'Failed') {
        return 'status-failed';
      }
      return '';
    },
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
}

.search-bar {
  margin-top: 10px;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
}

.search-input {
  width: 100%;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  
}

.search-input:focus {
  border-color: #888;
}

.status-in-progress {
  color: #ffd700;
  border: 1px solid #ffd700;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-done {
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-failed {
  color: #ff0000;
  border: 1px solid #ff0000;
  padding: 4px 8px;
  border-radius: 4px;
}
.v-btn {
  margin-right: 3%;
}

.AddRepair {
  margin-top: 8px;
}
</style>