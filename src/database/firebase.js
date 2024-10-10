import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_RMlAY4ksbPRazMZ0o6Al8gARa-dwI3c",
  authDomain: "tcc1-a292d.firebaseapp.com",
  projectId: "tcc1-a292d",
  storageBucket: "tcc1-a292d.appspot.com",
  messagingSenderId: "724923275669",
  appId: "1:724923275669:web:379a9360896c3dca91fe9c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);



export {auth,  db, storage };