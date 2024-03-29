<template>
  <div class="main-container">
    <v-container>
      <v-row class="header">
        <v-col align="center" cols="12" sm="6" md="4" lg="4">
          <v-btn @click="toggleRepairs" rounded="lg" size="x-large">{{ showRepairs ? 'Repairs' : 'Repairs' }}</v-btn>
        </v-col>
        <v-col align="center" cols="12" sm="6" md="4" lg="4">
          <v-btn @click="toggleBuyAndSell" rounded="lg" size="x-large">{{ showBuyAndSell ? 'Buy and Sell' : 'Buy and Sell' }}</v-btn>
        </v-col>
        <v-col align="center" cols="12" sm="6" md="4" lg="4">
          <v-btn @click="signOut" rounded="lg" size="x-large">Sign Out</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <RepairsTable :repairs="repairs" :columnHeaders="columnHeaders" :showTable="showRepairs" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <BuyAndSell v-if="showBuyAndSell" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import RepairsTable from './RepairsTable.vue';
import BuyAndSell from './BuyAndSell.vue';

export default {
  name: 'MainPage',
  components: {
    RepairsTable,
    BuyAndSell
  },
  data() {
    return {
      repairs: [],
      columnHeaders: {},
      showRepairs: false,
      showBuyAndSell: false
    }
  },
  created() {
    const auth = getAuth();
    const db = getFirestore();
    const repairsCollection = collection(db, 'Repairs');

    // Listen for authentication state changes
    auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        this.fetchRepairs(repairsCollection);
      } else {
        // User is signed out
        this.repairs = [];
        this.columnHeaders = {};
        this.showRepairs = false;
      }
    });
  },
  methods: {
    signOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.$router.push('/');
        })
        .catch(error => {
          console.error('Error signing out:', error);
        });
    },
    fetchRepairs(repairsCollection) {
      onSnapshot(repairsCollection, querySnapshot => {
        this.repairs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));

        // Get unique column headers from the first document
        if (querySnapshot.docs.length > 0) {
          this.columnHeaders = querySnapshot.docs[0].data();
        }
      });
    },
    toggleRepairs() {
      this.showRepairs = !this.showRepairs;
      if (this.showRepairs) {
        this.showBuyAndSell = false;
      }
    },
    openBuyAndSell() {
      // Logic to open the Buy and Sell component
      console.log('Opening Buy and Sell');
    },
    toggleBuyAndSell() {
      this.showBuyAndSell = !this.showBuyAndSell;
      if (this.showBuyAndSell) {
        this.showRepairs = false;
      }
    }
  }
}
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

@media (min-width: 960px) {
  .header {
    height: 200px; /* Adjust the height for larger screens */
  }
}

.v-btn {
  font-weight: bold;
}
</style>

<style>
.v-btn {
  background-color: #ADD8E6;
  color: #404040;
}

.v-data-table {
  background-color: #D3D3D3;
  border-radius: 10px;
}

.v-toolbar {
  background-color: #cccaca;
  border-radius: 10px;
}
</style>
