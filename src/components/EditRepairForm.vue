<template>
  <v-form @submit.prevent="updateRepair">
    <v-card>
      <v-card-title>
        Edit Repair
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Brand"
                v-model="editedRepair.brand"
                :items="brandOptions"
                required
                variant="outlined"
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Model"
                v-model="editedRepair.model"
                :items="filteredModelOptions"
                required
                variant="outlined"
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-combobox
                label="Issue"
                v-model="editedRepair.issue"
                :items="issueOptions"
                required
                variant="outlined"
              ></v-combobox>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-for="field in fields" :key="field.name">
              <v-text-field
                v-if="field.name !== 'profit'"
                :label="field.label"
                v-model="editedRepair[field.name]"
                :type="field.type"
                required
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-else
                :label="field.label"
                :value="profit"
                type="number"
                readonly
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                label="Customer Type"
                v-model="editedRepair.customerType"
                :items="['Retail', 'Wholesale']"
                required
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-if="editedRepair.customerType === 'Wholesale'">
              <v-text-field
                label="Wholesale Customer Name"
                v-model="editedRepair.wholesaleCustomerName"
                type="text"
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
              <v-select
                label="Status"
                v-model="editedRepair.status"
                :items="['In Progress', 'Done', 'Failed']"
                required
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeForm">Cancel</v-btn>
        <v-btn color="blue darken-1" text type="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
export default {
  name: 'EditRepairForm',
  props: {
    repair: {
      type: Object,
      required: true
    },
    repairs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      editedRepair: { ...this.repair.data,
        customerType: this.repair.data.customerType,
        wholesaleCustomerName: this.repair.data.wholesaleCustomerName,
        status: this.repair.data.status,
        dateOfFinish: this.repair.data.dateOfFinish },
      fields: [
        { name: 'imei', label: 'IMEI', type: 'text' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'fullPrice', label: 'Full Price', type: 'number' },
        { name: 'costPrice', label: 'Cost Price', type: 'number' },
        { name: 'profit', label: 'Profit', type: 'number' },
        { name: 'dateOfFinish', label: 'Date of Finish', type: 'date' }
      ]
    }
  },
  computed: {
    profit() {
      const fullPrice = parseFloat(this.editedRepair.fullPrice) || 0;
      const costPrice = parseFloat(this.editedRepair.costPrice) || 0;
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
      return this.modelOptions[this.editedRepair.brand] || [];
    }
  },
  methods: {
    updateRepair() {
      const updatedRepair = {
        id: this.repair.id,
        ...this.editedRepair,
        profit: this.profit
      };
      this.$emit('update-repair', updatedRepair);
    },
    closeForm() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.v-card-title {
  margin-left: 5%;
}
</style>