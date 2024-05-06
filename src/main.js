import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// Import Firebase App module
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

loadFonts()

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6TBzpG4rooZnOeWzK-Y6FuoNwuWtAB7w",
  authDomain: "supplies-782c5.firebaseapp.com",
  projectId: "supplies-782c5",
  storageBucket: "supplies-782c5.appspot.com",
  messagingSenderId: "761520225918",
  appId: "1:761520225918:web:e28f892670250bf548e22f",
  measurementId: "G-VXBFNZFY1T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set authentication persistence
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    // Auth state persisted successfully
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

let app;

// Check authentication state before creating the Vue app
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    // Create the Vue app
    app = createApp(App);

    app.use(vuetify)

    // Use the router
    app.use(router);

    // Mount the app
    app.mount('#app');
  }
});