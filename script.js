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
  databaseURL: "https://coins-accounting-default-rtdb.firebaseio.com/",
  projectId: "coins-accounting",
  storageBucket: "coins-accounting.firebasestorage.app",
  messagingSenderId: "852862668508",
  appId: "1:852862668508:web:7ad243fc8244a352f4ee19",
  measurementId: "G-VBREPSYJEC"
};

const app =
  initializeApp(firebaseConfig);

const db =
  getDatabase(app);

const titleInput =
  document.getElementById("title");

const amountInput =
  document.getElementById("amount");

const addBtn =
  document.getElementById("addBtn");

const balance =
  document.getElementById("balance");

const list =
  document.getElementById("list");

const dataRef =
  ref(db,"accountData");

let count = 1;

window.changeCount =
function(num){

  count += num;

  if(count < 1){
    count = 1;
  }

  document
    .getElementById("count")
    .textContent = count;
};

addBtn.addEventListener(
  "click",
  async ()=>{

    const title =
      titleInput.value.trim();

    const amount =
      Number(amountInput.value);

    if(title===""){
      alert("商品名を入力してください");
      return;
    }

    if(
      amount<=0 ||
      isNaN(amount)
    ){
      alert("値段を入力してください");
      return;
    }

    await push(dataRef,{
      title,
      amount,
      count,
      createdAt:Date.now()
    });

    titleInput.value="";
    amountInput.value="";

    count = 1;

    document
      .getElementById("count")
      .textContent = count;
  }
);

onValue(dataRef,(snapshot)=>{

  let total = 0;

  list.innerHTML = "";

  const data =
    snapshot.val();

  if(!data){

    balance.textContent =
      "0円";

    return;
  }

  const entries =
    Object.entries(data).reverse();

  entries.forEach(([key,item])=>{

    const subtotal =
      item.amount * item.count;

    total += subtotal;

    const li =
      document.createElement("li");

    li.className =
      "item";

    li.textContent =
      `${item.title} ${item.amount}円 × ${item.count} = ${subtotal}円`;

    list.appendChild(li);

  });

  balance.textContent =
    `${total}円`;

});
