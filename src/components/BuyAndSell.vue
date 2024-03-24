<template>
  <div>
    <h2>Buy and Sell</h2>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4">
          <v-btn @click="showBuyTable = !showBuyTable" rounded="xl" size="x-large" block>Buy</v-btn>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn @click="showSellTable = !showSellTable" rounded="xl" size="x-large" block>Sell</v-btn>
        </v-col>
        <v-col cols="12" sm="4">
          <Info />
        </v-col>
      </v-row>
    </v-container>

    <BuyComponent v-if="showBuyTable" />
    <SellComponent v-if="showSellTable" />
  </div>
</template>

<script>
import BuyComponent from './BuyComponent.vue';
import SellComponent from './SellComponent.vue';

export default {
  name: 'BuyAndSell',
  components: {
    BuyComponent,
    SellComponent,
  },
  data() {
    return {
      showBuyTable: false,
      showSellTable: false,
    };
  },
};
</script>