<template>
  <v-form @submit.prevent="addRepair">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Repair</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Brand"
                v-model="newRepair.brand"
                :items="brandOptions"
                required
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Model"
                v-model="newRepair.model"
                :items="filteredModelOptions"
                required
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Issue"
                v-model="newRepair.issue"
                :items="issueOptions"
                required
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                label="Customer Type"
                v-model="newRepair.customerType"
                :items="['Retail', 'Wholesale']"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-if="newRepair.customerType === 'Wholesale'">
              <v-text-field
                label="Wholesale Customer Name"
                v-model="newRepair.wholesaleCustomerName"
                type="text"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                label="Status"
                v-model="newRepair.status"
                :items="['In Progress', 'Just Got', 'Done', 'Failed']"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-for="field in fields" :key="field.name">
              <v-text-field
                v-if="field.name !== 'profit' && field.name !== 'date'"
                :label="field.label"
                v-model="newRepair[field.name]"
                :type="field.type"
                required
              ></v-text-field>
              <v-text-field
                v-else-if="field.name === 'date'"
                :label="field.label"
                v-model="newRepair[field.name]"
                :type="field.type"
                required
              ></v-text-field>
              <v-text-field
                v-else
                :label="field.label"
                :value="profit"
                type="number"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeForm">Cancel</v-btn>
        <v-btn color="blue darken-1" text type="submit">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  props: {
    repairs: {
      type: Array,
      default: () => []
    }
  },
  name: 'AddRepairForm',
  data() {
    return {
      newRepair: {
        date: new Date().toISOString().substr(0, 10) // Set default date to present day
      },
      fields: [
        { name: 'imei', label: 'IMEI', type: 'text' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'fullPrice', label: 'Full Price', type: 'number' },
        { name: 'costPrice', label: 'Cost Price', type: 'number' },
        { name: 'profit', label: 'Profit', type: 'number' }
      ]
    }
  },
  computed: {
    profit() {
      const fullPrice = parseFloat(this.newRepair.fullPrice) || 0;
      const costPrice = parseFloat(this.newRepair.costPrice) || 0;
      return fullPrice - costPrice;
    },
    brandOptions() {
      return [...new Set(this.repairs.map(repair => repair.data.brand))];
    },
    modelOptions() {
      return this.repairs.reduce((options, repair) => {
        if (!options[repair.data.brand]) {
          options[repair.data.brand] = [];
        }
        options[repair.data.brand].push(repair.data.model);
        return options;
      }, {});
    },
    issueOptions() {
      return [...new Set(this.repairs.map(repair => repair.data.issue))];
    },
    filteredModelOptions() {
      return this.modelOptions[this.newRepair.brand] || [];
    }
  },
  methods: {
    addRepair() {
      const newRepair = {
        ...this.newRepair,
        profit: this.profit
      };
      this.$emit('add-repair', newRepair);
    },
    closeForm() {
      this.$emit('close');
    }
  }
}
</script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 4px;
    max-width: 400px;
    width: 100%;
  }
  </style>