<template>
  <v-form @submit.prevent="addRepair">
    <v-card>
      <v-card-title>
        Add Repair
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
                variant="outlined"
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Model"
                v-model="newRepair.model"
                :items="filteredModelOptions"
                required
                variant="outlined"
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Issue"
                v-model="newRepair.issue"
                :items="issueOptions"
                required
                variant="outlined"
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="4">
              <v-select
                label="Customer Type"
                v-model="newRepair.customerType"
                :items="['Retail', 'Wholesale']"
                required
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-if="newRepair.customerType === 'Wholesale'">
              <v-text-field
                label="Wholesale Customer Name"
                v-model="newRepair.wholesaleCustomerName"
                type="text"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                label="Status"
                v-model="newRepair.status"
                :items="['In Progress', 'Done', 'Failed']"
                required
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-for="field in fields" :key="field.name">
              <v-text-field
                v-if="field.name !== 'profit' && field.name !== 'date'"
                :label="field.label"
                v-model="newRepair[field.name]"
                :type="field.type"
                required
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-else-if="field.name === 'date'"
                :label="field.label"
                v-model="newRepair[field.name]"
                :type="field.type"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="4" lg="12" >
              <v-text-field
                label="Profit"
                :value="profit"
                type="number"
                readonly
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="closeForm" variant="flat">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn text type="submit" variant="flat">Add</v-btn>
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
        profit: this.profit,
        brand: this.newRepair.brand || '-',
        model: this.newRepair.model || '-',
        issue: this.newRepair.issue || '-',
        imei: this.newRepair.imei || '-',
        date: this.newRepair.date || '-',
        fullPrice: this.newRepair.fullPrice || '-',
        costPrice: this.newRepair.costPrice || '-',
        customerType: this.newRepair.customerType || '-',
        wholesaleCustomerName: this.newRepair.wholesaleCustomerName || '-',
        status: this.newRepair.status || '-'
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
  .v-card {
    background-color:  #D3D3D3;
    border-radius: 1%;
  }
  </style>