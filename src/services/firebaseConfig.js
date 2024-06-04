import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC8XNvs7byhqFZ1dtWMJwVQjv2y9J_TsvU",
  authDomain: "aquainsight-6584c.firebaseapp.com",
  databaseURL: "https://aquainsight-6584c-default-rtdb.firebaseio.com",
  projectId: "aquainsight-6584c",
  storageBucket: "aquainsight-6584c.appspot.com",
  messagingSenderId: "100658924701",
  appId: "1:100658924701:web:157c8445d65cd2a880d874",
  measurementId: "G-3K6RCRSS0Z"
};

let app;
let auth;
let database;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  database = getDatabase(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  database = getDatabase(app);
}

export { auth, database };