import { menuArray } from "./data.js";

const container = document.getElementById("container");

const payForm = document.getElementById("pay-form");

let totalCost = 0;
let count = {};
let ids = [];

document.addEventListener("click", function (e) {
  menuArray.forEach(function (menuItem) {
    if (Object.values(e.target.dataset).includes(menuItem.id.toString())) {
      if (count[menuItem.name]) {
        count[menuItem.name] += 1;
      } else {
        count[menuItem.name] = 1;
        thankYou.classList.remove("show");
        thankYou.classList.add("hidden");
      }

      handleClick(menuItem);
    }

    if (e.target.dataset.remove === menuItem.name) {
      totalCost -= menuItem.price;
      totalCostItem.innerText = `$${totalCost}`;
      if (count[menuItem.name] != 0) {
        count[menuItem.name] -= 1;
        removeClick(menuItem);
        console.log(count[menuItem.name]);
        if (count[menuItem.name] === 0) {
          ids = ids.filter(function (id) {
            return id != menuItem.id;
          });
          console.log(ids);
          e.target.parentNode.parentNode.remove();
        }
      }
    }
  });

  if (e.target.dataset.action === "order") {
    modal.classList.remove("hidden");
  }
});

payForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(payForm);

  const name = formData.get("name");

  sessionStorage.setItem("reloading", "true");
  sessionStorage.setItem("name", name);
  window.location.reload();
});

window.onload = function () {
  let reloading = sessionStorage.getItem("reloading");
  let name = sessionStorage.getItem("name");
  if (reloading) {
    thankYou.innerHTML = `<p>Thanks ${name}! Your order is on its way!!</p>`;
    sessionStorage.removeItem("reloading");
    sessionStorage.removeItem("name");
    thankYou.classList.remove("hidden");
    thankYou.classList.add("show");
  }
};

function removeClick(menuIte) {
  if (totalCost === 0) {
    cart.classList.remove("show");
    cart.classList.add("hidden");
  }

  const noof = document.getElementById("noof-" + menuIte.name);
  noof.innerText = `x ${count[menuIte.name]}`;

  const insertite = document.getElementById("item-price-" + menuIte.name);
  insertite.innerText = `$${menuIte.price * count[menuIte.name]}`;
}

function handleClick(menuIte) {
  cart.classList.add("show");
  const noof = document.getElementById("noof-" + menuIte.name);
  totalCost += menuIte.price;
  console.log(totalCost);

  totalCostItem.innerText = `$${totalCost}`;

  if (!ids.includes(menuIte.id)) {
    insertItem.innerHTML += `
    <div class="items-added-price" id="items-added-price">
    <div class="items-added">
      <h3>${menuIte.name}</h3>
      <p class ="noof-${menuIte.name} noof" id = "noof-${menuIte.name}" ${
      menuIte.name
    }>x ${count[menuIte.name]}</p>
      <button class="remove-btn" id = "remove-btn" data-remove = ${
        menuIte.name
      }>REMOVE</button>
    </div>
    <p id="item-price-${menuIte.name}">$${menuIte.price}</p>
  </div>
    `;
    ids.push(menuIte.id);
    ids = [...new Set(ids)];
  } else {
    const insertite = document.getElementById("item-price-" + menuIte.name);
    insertite.innerText = `$${menuIte.price * count[menuIte.name]}`;
    noof.innerText = `x ${count[menuIte.name]}`;
    ids.push(menuIte.id);
    ids = [...new Set(ids)];
  }
}

function render() {
  menuArray.forEach(function (menuItem) {
    container.innerHTML += `
  <div id="items">
            <div class="menu">
              <div class="item">
                
                <div class= "test">
                  <p>${menuItem.emoji}</p>
                </div>
               
                <div class="item-desc">
                  <h2>${menuItem.name}</h2>
                  <p class="item-info">${menuItem.ingredients}</p>
                  <p>$${menuItem.price}</p>
                </div>
              </div>
              <div class="add-item-btn-container">
                <button class="add-item-btn" data-${menuItem.name} = ${menuItem.id}>+</button>
              </div>
            </div>
  </div>
  
  `;
  });

  container.innerHTML += `<div id="cart" class = "hidden">
  <h2 class="cart-heading">Your Order</h2>
  <div class="cart-items" id ="cart-items">
    <div id="insert">
  
    </div>
  
    <div class="cost">
      <h3>Total Price</h3>
      <p id = "total-cost-item"><strong></strong></p>
    </div>
  </div>
  <button class="order-btn" id = "order-btn" data-action = "order">Complete Order</button>
  </div>
  <div class="thank-you hidden" id = "thank-you">
            
          </div>`;
}

render();

const cart = document.getElementById("cart");

const insertItem = document.getElementById("insert");
const totalCostItem = document.getElementById("total-cost-item");
const modal = document.getElementById("modal");
const thankYou = document.getElementById("thank-you");
