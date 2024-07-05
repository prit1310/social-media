import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBvX4UTlwTyJXJltq3VZa0TOW8ScuYfkD4",
  authDomain: "socialmedia-626be.firebaseapp.com",
  projectId: "socialmedia-626be",
  storageBucket: "socialmedia-626be.appspot.com",
  messagingSenderId: "1054624119095",
  appId: "1:1054624119095:web:16926fbce0f178845e82b2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getDatabase(app)
export const bucket = getStorage(app)