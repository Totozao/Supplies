<template>
    <!-- Existing code -->
    <v-data-table :headers="sellPhoneTabletHeaders" :items="sellPhoneTabletItems" class="elevation-1">
      <!-- Existing code -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" @click="openEditPhoneTabletDialog(item)">Edit</v-btn>
        <v-btn color="error" @click="removePhoneTabletItem(item)">Remove</v-btn>
      </template>
    </v-data-table>
    <v-data-table :headers="sellAccessoryHeaders" :items="sellAccessoryItems" class="elevation-1">
      <!-- Existing code -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" @click="openEditAccessoryDialog(item)">Edit</v-btn>
        <v-btn color="error" @click="removeAccessoryItem(item)">Remove</v-btn>
      </template>
    </v-data-table>
    <!-- Existing code -->
    <v-dialog v-model="editPhoneTabletDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Phone/Tablet</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedPhoneTablet.brand" label="Brand"></v-text-field>
          <v-text-field v-model="editedPhoneTablet.model" label="Model"></v-text-field>
          <v-text-field v-model="editedPhoneTablet.memory" label="Memory"></v-text-field>
          <v-text-field v-model="editedPhoneTablet.ram" label="RAM"></v-text-field>
          <v-text-field v-model="editedPhoneTablet.color" label="Color"></v-text-field>
          <v-text-field v-model="editedPhoneTablet.cost" label="Cost"></v-text-field>
          <v-text-field v-model="editedPhoneTablet.imei" label="IMEI/SN"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditPhoneTabletDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveEditedPhoneTablet">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editAccessoryDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Accessory</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedAccessory.category" label="Category"></v-text-field>
          <v-text-field v-model="editedAccessory.brand" label="Brand"></v-text-field>
          <v-text-field v-model="editedAccessory.model" label="Model"></v-text-field>
          <v-text-field v-model="editedAccessory.cost" label="Cost"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditAccessoryDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveEditedAccessory">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  <script>
  // Existing code
  
  export default {
    // Existing code
    data() {
      return {
        // Existing code
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
        // Existing code
        sellPhoneTabletHeaders: [
          // Existing headers
          { title: 'Actions', value: 'actions', sortable: false },
        ],
        sellAccessoryHeaders: [
          // Existing headers
          { title: 'Actions', value: 'actions', sortable: false },
        ],
      };
    },
    methods: {
      // Existing methods
      openEditPhoneTabletDialog(item) {
        this.editedPhoneTablet = { ...item };
        this.editPhoneTabletDialog = true;
      },
      closeEditPhoneTabletDialog() {
        this.editPhoneTabletDialog = false;
        this.resetEditedPhoneTablet();
      },
      openEditAccessoryDialog(item) {
        this.editedAccessory = { ...item };
        this.editAccessoryDialog = true;
      },
      closeEditAccessoryDialog() {
        this.editAccessoryDialog = false;
        this.resetEditedAccessory();
      },
      saveEditedPhoneTablet() {
        const index = this.sellPhoneTabletItems.findIndex(
          item => item.imei === this.editedPhoneTablet.imei
        );
        if (index !== -1) {
          this.sellPhoneTabletItems.splice(index, 1, this.editedPhoneTablet);
        }
        this.closeEditPhoneTabletDialog();
      },
      saveEditedAccessory() {
        const index = this.sellAccessoryItems.findIndex(
          item =>
            item.category === this.editedAccessory.category &&
            item.brand === this.editedAccessory.brand &&
            item.model === this.editedAccessory.model &&
            item.cost === this.editedAccessory.cost
        );
        if (index !== -1) {
          this.sellAccessoryItems.splice(index, 1, this.editedAccessory);
        }
        this.closeEditAccessoryDialog();
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
      resetEditedAccessory() {
        this.editedAccessory = {
          category: '',
          brand: '',
          model: '',
          cost: '',
        };
      },
      removePhoneTabletItem(item) {
        const index = this.sellPhoneTabletItems.indexOf(item);
        if (index !== -1) {
          this.sellPhoneTabletItems.splice(index, 1);
        }
      },
      removeAccessoryItem(item) {
        const index = this.sellAccessoryItems.indexOf(item);
        if (index !== -1) {
          this.sellAccessoryItems.splice(index, 1);
        }
      },
    },
  };
  </script>