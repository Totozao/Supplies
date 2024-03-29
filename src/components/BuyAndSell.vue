<template>
  <div>
    <v-container>
      <h3>Buy and Sell</h3>
      <v-row>
        <v-col cols="12" sm="4" lg="3">
          <v-btn @click="showBuyTable = !showBuyTable" rounded="lg" size="x-large" block>Buy</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="4" lg="3">
          <v-btn @click="showSellTable = !showSellTable" rounded="lg" size="x-large" block>Sell</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" sm="4" lg="3">
          <v-btn @click="showInfo = !showInfo" rounded="lg" size="x-large" block>Info</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <BuyComponent v-if="showBuyTable" />
    <SellComponent v-if="showSellTable" />
    <InfoComponent v-if="showInfo" />
  </div>
</template>

<script>
import BuyComponent from './BuyComponent.vue';
import SellComponent from './SellComponent.vue';
import InfoComponent from './InfoComponent.vue';

export default {
  name: 'BuyAndSell',
  components: {
    BuyComponent,
    SellComponent,
    InfoComponent,
  },
  data() {
    return {
      showBuyTable: false,
      showSellTable: false,
      showInfo: false,
    };
  },
};
</script>

<style scoped>
.v-btn {
  margin:auto;
  margin-top:1.5%
}

</style>