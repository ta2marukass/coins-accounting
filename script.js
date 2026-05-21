import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDq5lKwhll2EUUpourRT_MkHE3Mj7aTtE",
  authDomain: "coins-accounting.firebaseapp.com",
  projectId: "coins-accounting",
  storageBucket: "coins-accounting.firebasestorage.app",
  messagingSenderId: "852862668508",
  appId: "1:852862668508:web:7ad243fc8244a352f4ee19",
  measurementId: "G-VBREPSYJEC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const balance = document.getElementById("balance");

const dataRef = ref(db, "accountData");

addBtn.addEventListener("click", async ()=>{

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if(title === ""){
    alert("内容を入力してください");
    return;
  }

  if(amount <= 0 || isNaN(amount)){
    alert("正しい金額を入力してください");
    return;
  }

  const item = {
    title,
    amount,
    type,
    createdAt: Date.now()
  };

  await push(dataRef, item);

  titleInput.value = "";
  amountInput.value = "";
});

onValue(dataRef, (snapshot)=>{

  list.innerHTML = "";

  let total = 0;

});