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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dataRef = ref(db, "accountData");

const counts = {
  plain: 0,
  strawberry: 0,
  cocoa: 0,
  matcha: 0
};

function updateCountDisplay(key){
  document.getElementById(
    `count-${key}`
  ).textContent = counts[key];
}

function updatePreviewTotal(){

  let total = 0;

  Object.keys(counts).forEach((key)=>{

    const price =
      Number(
        document.getElementById(
          `price-${key}`
        ).value
      ) || 0;

    total +=
      price * counts[key];
  });

  document.getElementById(
    "previewTotal"
  ).textContent = `${total}円`;
}

document
  .querySelectorAll(".plus")
  .forEach((btn)=>{

    btn.addEventListener("click",()=>{

      const key = btn.dataset.key;

      counts[key]++;

      updateCountDisplay(key);

      updatePreviewTotal();

    });

  });

document
  .querySelectorAll(".minus")
  .forEach((btn)=>{

    btn.addEventListener("click",()=>{

      const key = btn.dataset.key;

      if(counts[key] > 0){

        counts[key]--;

        updateCountDisplay(key);

        updatePreviewTotal();

      }

    });

  });

document
  .querySelectorAll("input")
  .forEach((input)=>{

    input.addEventListener(
      "input",
      updatePreviewTotal
    );

  });

document
  .getElementById("addBtn")
  .addEventListener(
    "click",
    async ()=>{

      const names = {
        plain:"プレーン味",
        strawberry:"ストロベリー味",
        cocoa:"ココア味",
        matcha:"抹茶味"
      };

      for(const key of Object.keys(counts)){

        const price =
          Number(
            document.getElementById(
              `price-${key}`
            ).value
          ) || 0;

        const count =
          counts[key];

        if(
          price > 0 &&
          count > 0
        ){

          await push(dataRef,{
            title:names[key],
            amount:price,
            count:count,
            createdAt:Date.now()
          });

        }

        counts[key] = 0;

        updateCountDisplay(key);

        document.getElementById(
          `price-${key}`
        ).value = "";

      }

      updatePreviewTotal();

    }
  );

onValue(dataRef,(snapshot)=>{

  const list =
    document.getElementById("list");

  list.innerHTML = "";

  let total = 0;

  const data =
    snapshot.val();

  if(!data){

    document.getElementById(
      "balance"
    ).textContent = "0円";

    return;
  }

  Object.entries(data)
    .reverse()
    .forEach(([key,item])=>{

      const subtotal =
        item.amount * item.count;

      total += subtotal;

      const li =
        document.createElement("li");

      li.className = "item";

      li.innerHTML = `
        <span>
          ${item.title}
          ${item.amount}円 × ${item.count}
          = ${subtotal}円
        </span>
        <button>削除</button>
      `;

      li
        .querySelector("button")
        .addEventListener(
          "click",
          async ()=>{
            await remove(
              ref(
                db,
                `accountData/${key}`
              )
            );
          }
        );

      list.appendChild(li);

    });

  document.getElementById(
    "balance"
  ).textContent = `${total}円`;

});

document
  .getElementById("tab-input")
  .addEventListener("click",()=>{

    document
      .getElementById("input-tab")
      .classList.remove("hidden");

    document
      .getElementById("history-tab")
      .classList.add("hidden");

  });

document
  .getElementById("tab-history")
  .addEventListener("click",()=>{

    document
      .getElementById("input-tab")
      .classList.add("hidden");

    document
      .getElementById("history-tab")
      .classList.remove("hidden");

  });

updatePreviewTotal();
