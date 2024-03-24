<template>
    <div>
      <h2>Login</h2>
      <v-text-field v-model="email" placeholder="Email" />
      <v-text-field v-model="password" type="password" placeholder="Password" />
      <v-btn @click="login">Login</v-btn>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  
  export default {
    name: 'LoginPage',
    data() {
      return {
        email: '',
        password: ''
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