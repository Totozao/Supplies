<template>
    <div>
      <v-card>
        <v-list v-model:opened="openInfo">
          <v-list-group value="Info">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" class="info-title" title="Info">
                <template v-slot:title>
                  <div class="font-weight-bold text-center">Info</div>
                </template>
              </v-list-item>
            </template>
            <v-list-item @click="openPhonesAndTabletsInfo" prepend-icon="mdi-cellphone" title="Phones and Tablets" value="Phones and Tablets"></v-list-item>
            <v-list-item @click="openAccessoriesInfo" prepend-icon="mdi-headphones" title="Accessories" value="Accessories"></v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InfoComponent',
    data() {
      return {
        openInfo: [],
      };
    },
    methods: {
      openPhonesAndTabletsInfo() {
        // Logic to open the Phones and Tablets info
        console.log('Opening Phones and Tablets info');
      },
      openAccessoriesInfo() {
        // Logic to open the Accessories info
        console.log('Opening Accessories info');
      },
    },
  };
  </script>
  
  <style scoped>
  .info-title .v-list-item__title {
    font-weight: bold;
    text-align: center;
  }
  </style>