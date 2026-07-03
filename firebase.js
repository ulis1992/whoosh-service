import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  databaseURL: "XXX",
  projectId: "XXX",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function saveInspection(data) {
  return push(ref(db, "inspections"), data);
}