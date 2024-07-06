import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCKzTnuaAtoTIdsk0Tnc5VhS2Yxt7dRnqk",
  authDomain: "social-media1-28ff1.firebaseapp.com",
  projectId: "social-media1-28ff1",
  storageBucket: "social-media1-28ff1.appspot.com",
  messagingSenderId: "346243154098",
  appId: "1:346243154098:web:dbbc4e68bd8764893749ab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const bucket = getStorage(app)