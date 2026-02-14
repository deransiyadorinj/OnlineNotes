import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrpNsvbr_1QkWFprqYOJbnBgkcMutpPQQ",
  authDomain: "simplenotesapp-9d777.firebaseapp.com",
  projectId: "simplenotesapp-9d777",
  storageBucket: "simplenotesapp-9d777.firebasestorage.app",
  messagingSenderId: "7957661856",
  appId: "1:7957661856:web:a631edb5fd9ff800fb61c5",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export interface Note {
  id: string;
  text: string;
  pinned: boolean;
  important: boolean;
  createdAt: Timestamp | null;
}

export {
  db,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
};
