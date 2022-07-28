client();
let carts = [];
init();

function init() {
  carts = JSON.parse(localStorage.getItem("carts")) || [];

  renderCart(carts);
}
function client() {
  apiGetProducts().then(function (result) {
    var products = result.data;

    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      products[i] = new Product(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.frontCamera,
        product.backCamera,
        product.type,
        product.image,
        product.description
      );
    }

    display(products);
    console.log(products);
  });
}
function display(products) {
  var html = "";
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    html += `
    
    <div class="card" style="width: 18rem">
    <img src=${product.image} class="card-img-top" alt="" />
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">
        ${product.description}
      </p>
      <h1>${product.price}</h1>
      <button class="btn btn-primary" onclick = "addSP(${product.id})" >Add</button>
    </div>
  </div>
     
       
    
    `;
  }
  document.getElementById("tbody").innerHTML = html;
}
function selectType() {
  apiGetProducts().then(function (result) {
    var products = result.data;
    var dtSS = [];
    var dtIP = [];

    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      products[i] = new Product(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.frontCamera,
        product.backCamera,
        product.type,
        product.image,
        product.description
      );

      var type = document.getElementById("selectType").value;
      if (product.type === "Samsung") {
        dtSS.push(product);
      } else {
        dtIP.push(product);
      }
      switch (type) {
        case "A":
          display(dtIP);
          break;
        case "B":
          display(dtSS);
          break;

        default:
          client();
          break;
      }
    }
  });
}

function cartItems(data) {
  for (let i = 0; i < carts.length; i++) {
    let cart = carts[i];
    if (data.product.id === cart.product.id) {
      cart.quantity += 1;
      carts.concat(cart);
      localStorage.setItem("carts", JSON.stringify(carts));

      return;
    }
  }
  carts.push(data);
  localStorage.setItem("carts", JSON.stringify(carts));
}

function addSP(productId) {
  apiGetProductDetail(productId).then(function (result) {
    var sanPham = result.data;
    var cartItemList = new cartItem(sanPham, (quantity = 1));
    cartItems(cartItemList);
    renderCart(carts);
  });
}

function renderCart(carts) {
  var html = "";
  var total = totalProduct();
  for (var i = 0; i < carts.length; i++) {
    var cart = carts[i];
    var subTotal = cart.quantity * cart.product.price;
    html += `
    <tr>  
        <td>${cart.product.name}</td>
        <td>${cart.product.price}</td>
        <td>     
        <i class="fas fa-minus quantity" data-type="decrease" data-id = "${i}"></i>
          ${cart.quantity}
          <i class="fas fa-plus quantity" data-type="increase" data-id = "${i}"></i>  
        </td>
        <td>
        <button 
          class = "btn btn-danger"
          data-type="delete"
          data-id="${i}">Delete
        </button>
        </td>
        <td>${subTotal}</td>                
    </tr>
    `;
  }

  document.getElementById("tbodyProduct").innerHTML = html;
  document.getElementById("Sum").innerHTML = `tổng cộng:${total}`;
}

function deleteProduct(productIndex) {
  var index = findProduct(productIndex);

  if (index !== -1) {
    carts.splice(index, 1);
    localStorage.setItem("carts", JSON.stringify(carts));
    renderCart(carts);
  }
}
function findProduct(productIndex) {
  var index = -1;
  for (var i = 0; i < carts.length; i++) {
    if (i === productIndex) {
      index = i;
      break;
    }
  }
  return index;
}

document
  .getElementById("tbodyProduct")
  .addEventListener("click", handleProductAction);
function handleProductAction(event) {
  var type = event.target.getAttribute("data-type");
  var id = +event.target.getAttribute("data-id");

  switch (type) {
    case "delete":
      deleteProduct(id);
      break;
    case "increase":
      increaseProduct(id);
      break;
    case "decrease":
      decreaseProduct(id);
      break;
    default:
      break;
  }
}

function increaseProduct(productIndex) {
  carts[productIndex].quantity += 1;

  localStorage.setItem("carts", JSON.stringify(carts));

  renderCart(carts);
}
function decreaseProduct(productIndex) {
  if (carts[productIndex].quantity > 1) {
    carts[productIndex].quantity -= 1;
  } else {
    deleteProduct(productIndex);
  }

  localStorage.setItem("carts", JSON.stringify(carts));

  renderCart(carts);
}

function pay() {
  carts = [];
  localStorage.setItem("carts", JSON.stringify(carts));
  renderCart(carts);
}

function totalProduct() {
  let total = 0;
  for (let i = 0; i < carts.length; i++) {
    total += carts[i].quantity * carts[i].product.price;
  }

  return total;
}
