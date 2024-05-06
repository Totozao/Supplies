<template>
  <div class="d-flex align-center justify-center" style="height: 100vh;">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-text-field variant="outlined" v-model="email" placeholder="Email" />
          <v-text-field variant="outlined" v-model="password" type="password" placeholder="Password" />
          <v-btn @click="login">Login</v-btn>
          {{ loginMessage }}
        </v-card>
        </div>
</template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  
  export default {
    name: 'LoginPage',
    data() {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      login() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, this.email, this.password)
          .then(() => {
            this.$router.push('/main');
          })
          .catch(error => {
            console.error('Error signing in:', error);
          });
      }
    }
  }
  </script>

<style scoped>
.v-card {
  width: 25%;
  border-radius: 10px;
  background-color: #dbd7d7;
}

.v-card-title {
  margin-top: 1%;
  margin-bottom: 1%;
  font-weight: bold;
  font-size: 2em;
  text-align: center;
}

.v-btn {
  margin-left: 10px;
  margin-bottom: 10px;
}

.v-text-field {
  margin-left:10px;
  margin-right: 10px;
}
</style>