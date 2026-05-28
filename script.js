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

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.getElementById("addBtn");

  const balance =
    document.getElementById("balance");

  const previewTotal =
    document.getElementById("previewTotal");

  const list =
    document.getElementById("list");

  const inputTab =
    document.getElementById("input-tab");

  const balanceTab =
    document.getElementById("balance-tab");

  const counts = {
    plain: 0,
    strawberry: 0,
    cocoa: 0,
    matcha: 0
  };

  function updatePreviewTotal() {

    let total = 0;

    const products = [
      "plain",
      "strawberry",
      "cocoa",
      "matcha"
    ];

    products.forEach((key) => {

      const price =
        Number(
          document.getElementById(
            `price-${key}`
          )?.value
        ) || 0;

      total +=
        price * counts[key];

    });

    previewTotal.textContent =
      `${total}円`;
  }

  document
    .querySelectorAll("[data-action]")
    .forEach((btn) => {

      btn.addEventListener("click", () => {

        const target =
          btn.dataset.target;

        const action =
          btn.dataset.action;

        if (action === "plus") {
          counts[target]++;
        }

        if (
          action === "minus" &&
          counts[target] > 0
        ) {
          counts[target]--;
        }

        document.getElementById(
          `count-${target}`
        ).textContent =
          counts[target];

        updatePreviewTotal();

      });

    });

  document
    .querySelectorAll(
      'input[id^="price-"]'
    )
    .forEach((input) => {

      input.addEventListener(
        "input",
        updatePreviewTotal
      );

    });

  document
    .getElementById("tab-input")
    ?.addEventListener(
      "click",
      () => {

        inputTab.classList.remove(
          "hidden"
        );

        balanceTab.classList.add(
          "hidden"
        );

      }
    );

  document
    .getElementById("tab-balance")
    ?.addEventListener(
      "click",
      () => {

        inputTab.classList.add(
          "hidden"
        );

        balanceTab.classList.remove(
          "hidden"
        );

      }
    );

  addBtn.addEventListener(
    "click",
    async () => {

      const products = [
        ["プレーン味", "plain"],
        ["ストロベリー味", "strawberry"],
        ["ココア味", "cocoa"],
        ["抹茶味", "matcha"]
      ];

      for (const [name, key] of products) {

        const price =
          Number(
            document.getElementById(
              `price-${key}`
            ).value
          );

        const count =
          counts[key];

        if (
          price > 0 &&
          count > 0
        ) {

          await push(
            dataRef,
            {
              title: name,
              amount: price,
              count: count,
              createdAt: Date.now()
            }
          );

        }

        document.getElementById(
          `price-${key}`
        ).value = "";

        counts[key] = 0;

        document.getElementById(
          `count-${key}`
        ).textContent = "0";

      }

      updatePreviewTotal();

    }
  );

  onValue(dataRef, (snapshot) => {

    let total = 0;

    list.innerHTML = "";

    const data =
      snapshot.val();

    if (!data) {

      balance.textContent = "0円";

      return;
    }

    Object
      .entries(data)
      .reverse()
      .forEach(
        ([key, item]) => {

          const subtotal =
            item.amount *
            item.count;

          total += subtotal;

          const li =
            document.createElement(
              "li"
            );

          li.className = "item";

          li.innerHTML = `
            <span>
              ${item.title}
              ${item.amount}円 × ${item.count}
              = ${subtotal}円
            </span>

            <button class="delete-btn">
              削除
            </button>
          `;

          li
            .querySelector(
              ".delete-btn"
            )
            .addEventListener(
              "click",
              async () => {

                await remove(
                  ref(
                    db,
                    `accountData/${key}`
                  )
                );

              }
            );

          list.appendChild(li);

        }
      );

    balance.textContent =
      `${total}円`;

  });

  updatePreviewTotal();

});
