import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "md-editor-v3/lib/style.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { VueFire } from "vuefire";

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();

const vuetify = createVuetify({
  theme: {
    defaultTheme: "dark",
  },
  components,
  directives,
});

const app = createApp(App);
const firebaseApp = initializeApp({
  apiKey: "AIzaSyDVnLiWGERPNY9GfB2wscnQPSJaIm4moAI",
  authDomain: "vivre-db.firebaseapp.com",
  projectId: "vivre-db",
  storageBucket: "vivre-db.appspot.com",
  messagingSenderId: "844676752816",
  appId: "1:844676752816:web:acb9f55e9d522d287be275",
  measurementId: "G-7XD8VF8CKQ",
});

const analytics = getAnalytics(firebaseApp);

app.use(router);
app.use(vuetify);
app.use(pinia);
app.use(VueFire, {
  firebaseApp: firebaseApp,
});

app.mount("#app");
